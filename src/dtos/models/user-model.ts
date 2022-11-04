import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  img: string;
}

@ObjectType()
export class UserAuthenticated {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  token: string;

  @Field()
  img: string;
}
