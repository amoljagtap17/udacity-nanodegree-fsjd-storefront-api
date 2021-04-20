import bcrypt from 'bcrypt'
// @ts-ignore
import { client } from '../database'

export type User = {
  id: number
  firstname: string
  lastname: string
  username: string
  password: string
}

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env
const pepper: string = BCRYPT_PASSWORD!
const saltRounds: string = SALT_ROUNDS!

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM users'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql)

      const users: User[] = result.rows

      conn.release()

      return users
    } catch (err) {
      throw new Error(`DB error retrieving users. Error: ${err}`)
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql =
        'SELECT id, firstname, lastname, username, password FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const user: User = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`DB error retrieving user with id ${id}. Error: ${err}`)
    }
  }

  async create(u: Omit<User, 'id'>): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (firstname, lastname, username, password) VALUES($1, $2, $3, $4) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))

      const result = await conn.query(sql, [
        u.firstname,
        u.lastname,
        u.username,
        hash,
      ])

      const user: User = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(
        `unable to create user (${u.firstname} ${u.lastname}): ${err}`
      )
    }
  }

  async update(u: User): Promise<User> {
    try {
      const sql =
        'UPDATE users SET firstname = $2, lastname = $3, username = $4, password = $5 WHERE id = $1 RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))

      const result = await conn.query(sql, [
        u.id,
        u.firstname,
        u.lastname,
        u.username,
        hash,
      ])

      const user: User = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(
        `unable to update user (${u.firstname} ${u.lastname}): ${err}`
      )
    }
  }

  async delete(id: number): Promise<User[]> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const deletedUser: User[] = result.rows

      conn.release()

      return deletedUser
    } catch (err) {
      throw new Error(`DB error deleting user with id ${id}. Error: ${err}`)
    }
  }

  async authenticate(username: string, password: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE username=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [username])

      if (result.rows.length) {
        const user: User = result.rows[0]

        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user
        }
      }
    } catch (err) {
      throw new Error(
        `DB error checking user with username ${username}. Error: ${err}`
      )
    }

    throw new Error(`Incorrect credentials.`)
  }
}
