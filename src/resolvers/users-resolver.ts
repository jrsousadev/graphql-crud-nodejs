import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { randomUUID } from "node:crypto";
import { User, UserAuthenticated } from "../dtos/models/user-model";
import { bcryptjs } from "../utils/bcryptjs";
import {
  AuthenticateUserInput,
  CreateUserInput,
  UpdateUserInput,
} from "../dtos/inputs/user-inputs";
import { prismaClient } from "../database/prismaClient";

@Resolver(() => User)
export class UserResolvers {
  @Query(() => [User])
  async getUsers() {
    try {
      return await prismaClient.user.findMany({});
    } catch (err) {
      throw err;
    }
  }

  @Query(() => User)
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

      if (!user) throw new Error("Email or password is not exist!");

      const correctPassword = await bcryptjs.authenticate(
        data.password,
        user.password
      );

      if (!correctPassword) throw new Error("Email or password is not exist!");

      return {
        ...user,
        token: randomUUID(),
      };
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("data") { email, id, name, password }: UpdateUserInput
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
        },
      });
    } catch (err) {
      throw err;
    }
  }

  @Query(() => Boolean)
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
