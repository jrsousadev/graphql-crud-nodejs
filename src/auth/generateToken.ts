import jwt from "jsonwebtoken";
import { config } from "../config";
import { User } from "../dtos/models/user-model";

export const generateToken = (user: User) => {
  return `JWT ${jwt.sign({ id: user.id }, config.TOKEN_SECRET)}`
}