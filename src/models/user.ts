import bcrypt from 'bcrypt'
// @ts-ignore
import { client } from '../database'

export type User = {
  id: number
  firstName: string
  lastName: string
  password: string
}

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env
const pepper: string = BCRYPT_PASSWORD!
const saltRounds: string = SALT_ROUNDS!

export class UserStore {
  async create(u: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql =
        'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *'

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))

      const result = await conn.query(sql, [u.firstName, u.lastName, hash])

      const user = result.rows[0]

      conn.release()

      delete user.password

      return user
    } catch (err) {
      throw new Error(
        `unable to create user (${u.firstName} ${u.lastName}): ${err}`
      )
    }
  }
}
