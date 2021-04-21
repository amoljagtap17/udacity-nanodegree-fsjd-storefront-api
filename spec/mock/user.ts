import { User } from '../../src/models/user'

export const testUserData: Omit<User, 'id'> = {
  firstname: 'admin',
  lastname: 'user',
  username: 'admin',
  password: 'testpassword',
}
