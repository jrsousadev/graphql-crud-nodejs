import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { User, UserAuthenticated } from "../dtos/models/user-model";
import { generateToken } from "../auth/generateToken";
import { base64 } from "../auth/base64";
import { bcryptjs } from "../utils/bcryptjs";
import { prismaClient } from "../database/prismaClient";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  AuthenticateUserInput,
  CreateUserInput,
  UpdateUserInput,
} from "../dtos/inputs/user-inputs";

@Resolver(() => User)
export class UserResolvers {
  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    try {
      data.password = bcryptjs.encryptPassword(data.password);
      return await prismaClient.user.create({ data });
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => UserAuthenticated)
  async authenticate(@Arg("data") data: AuthenticateUserInput) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) throw new Error("EMAIL_OR_PASSWORD_INVALID");

      const correctPassword = await bcryptjs.authenticate(
        data.password,
        user.password
      );

      if (!correctPassword) throw new Error("EMAIL_OR_PASSWORD_INVALID");

      return {
        ...user,
        token: base64(generateToken(user)),
      };
    } catch (err) {
      throw err
    }
  }

  @Query(() => [User])
  @UseMiddleware(isAuthenticated)
  async getUsers() {
    try {
      return await prismaClient.user.findMany({});
    } catch (err) {
      throw err;
    }
  }

  @Query(() => User)
  @UseMiddleware(isAuthenticated)
  async getOneUser(@Arg("id") id: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) throw new Error("User is not exist");

      return user;
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuthenticated)
  async updateUser(
    @Arg("data") { email, id, name, password, img }: UpdateUserInput
  ) {
    try {
      const userExist = await prismaClient.user.findFirst({
        where: {
          id,
        },
      });

      if (!userExist) throw new Error("User is not exist");

      return await prismaClient.user.update({
        where: {
          id,
        },
        data: {
          email,
          name,
          password: password && bcryptjs.encryptPassword(password),
          img,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteUser(@Arg("id") id: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) throw new Error("User is not exist");

      const userData = await prismaClient.user.delete({
        where: {
          id,
        },
      });

      if (!userData) {
        return false;
      }

      return true;
    } catch (err) {
      throw err;
    }
  }
}
