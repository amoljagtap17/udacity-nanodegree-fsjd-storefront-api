import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, UserStore } from '../models/user'

const store = new UserStore()

const tokenSecret: string = process.env.TOKEN_SECRET!

const create = async (req: Request, res: Response) => {
  const { firstName, lastName, userName, password } = req.body

  const user: Omit<User, 'id'> = {
    firstName,
    lastName,
    userName,
    password,
  }

  try {
    const newUser = await store.create(user)

    const token = jwt.sign({ user: newUser }, tokenSecret)

    res.json(token)
  } catch (err) {
    res.status(400)
    res.json(err + user)
  }
}

export const users_routes = (app: express.Application) => {
  app.post('/users', create)
}
