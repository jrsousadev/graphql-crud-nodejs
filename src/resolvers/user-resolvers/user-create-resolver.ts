import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput } from "../../dtos/inputs/user-inputs";
import { User } from "../../dtos/models/user-model";
import { randomUUID } from "node:crypto";
import { bcryptjs } from "../../utils/bcryptjs";

const users: User[] = [];

@Resolver(() => User)
export class UserCreateResolver {
  @Query(() => [User])
  async getUsers() {
    return users;
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: bcryptjs.encryptPassword(data.password),
    };

    users.push(user);

    return user;
  }
}
