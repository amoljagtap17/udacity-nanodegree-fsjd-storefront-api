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
      const sql = 'SELECT id, firstname, lastname, username FROM users'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`DB error retrieving users. Error: ${err}`)
    }
  }

  async show(id: number): Promise<Omit<User, 'password'>> {
    try {
      const sql =
        'SELECT id, firstname, lastname, username FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0] || {}
    } catch (err) {
      throw new Error(`DB error retrieving user with id ${id}. Error: ${err}`)
    }
  }

  async create(u: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    try {
      const sql =
        'INSERT INTO users (firstname, lastname, username, password) VALUES($1, $2, $3, $4) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

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

  async delete(id: number): Promise<string> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      await conn.query(sql, [id])

      conn.release()

      return 'User Deleted'
    } catch (err) {
      throw new Error(`DB error deleting user with id ${id}. Error: ${err}`)
    }
  }

  async authenticate(
    userName: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    try {
      const sql = 'SELECT * FROM users WHERE username=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [userName])

      if (result.rows.length) {
        const user = result.rows[0]

        if (bcrypt.compareSync(password + pepper, user.password)) {
          delete user.password

          return user
        }
      }
    } catch (err) {
      throw new Error(
        `DB error checking user with username ${userName}. Error: ${err}`
      )
    }

    throw new Error(`Incorrect credentials.`)
  }
}
