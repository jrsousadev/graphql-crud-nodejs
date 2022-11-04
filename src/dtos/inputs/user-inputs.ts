import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}

@InputType()
export class AuthenticateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  id: string;

  @Field(({ nullable: true }))
  email?: string;

  @Field(({ nullable: true }))
  name?: string;

  @Field(({ nullable: true }))
  password?: string;
}
