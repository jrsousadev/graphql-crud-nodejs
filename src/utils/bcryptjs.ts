import bcrypt from 'bcryptjs'

export const bcryptjs = {
  authenticate: (plainTextPassword: string, userPassword: string) => {
    return bcrypt.compareSync(plainTextPassword, userPassword);
  },

  encryptPassword: (password: string) => {
    return bcrypt.hashSync(password, 8);
  }
}