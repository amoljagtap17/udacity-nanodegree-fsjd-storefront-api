import bcrypt from 'bcrypt'
// @ts-ignore
import { client } from '../database'

export type User = {
  id: number
  firstName: string
  lastName: string
  userName: string
  password: string
}

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env
const pepper: string = BCRYPT_PASSWORD!
const saltRounds: string = SALT_ROUNDS!

export class UserStore {
  async index(): Promise<Omit<User, 'password'>> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Omit<User, 'password'>> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async create(u: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql =
        'INSERT INTO users (firstname, lastname, username, password) VALUES($1, $2, $3, $4) RETURNING *'

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        u.userName,
        hash,
      ])

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
