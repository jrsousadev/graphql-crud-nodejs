import * as jwt from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { unbase64 } from "../auth/base64";
import { config } from "../config";
import { prismaClient } from "../database/prismaClient";

type JWTPayload = {
  id: string;
};

export const isAuthenticated: MiddlewareFn = async ({ context }: any, next) => {
  try {
    const { authorization: authHeader } = context.req.headers;
    if (!authHeader) throw new Error("Unauthorized");

    const authorization = unbase64(authHeader);

    const [, token] = authorization.split(" ");

    const { id } = jwt.verify(token, config.TOKEN_SECRET, {
      algorithms: ["HS256"],
    }) as JWTPayload;

    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) throw new Error("Unauthorized");

    context.req.user = { id: user.id };

    return next();
  } catch (err) {
    throw err;
  }
};
