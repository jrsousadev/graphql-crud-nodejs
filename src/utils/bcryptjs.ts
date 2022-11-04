import bcrypt from 'bcryptjs';

export const bcryptjs = {
  authenticate: async (plainTextPassword: string, userPassword: string) => {
    return await bcrypt.compare(plainTextPassword, userPassword)
  },

  encryptPassword: (password: string) => {
    return bcrypt.hashSync(password, 8)
  }
}