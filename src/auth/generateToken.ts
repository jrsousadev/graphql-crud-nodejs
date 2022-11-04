import jwt from "jsonwebtoken";
import { config } from "../config";
import { User } from "../dtos/models/user-model";

export const generateToken = (user: User) => {
  return `JWT ${jwt.sign({ user: user.id }, config.TOKEN_SECRET)}`
}