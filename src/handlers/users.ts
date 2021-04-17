import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, UserStore } from '../models/user'
import { verifyAuthToken } from '../middlewares/auth'

const store = new UserStore()

const tokenSecret: string = process.env.TOKEN_SECRET!

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index()
    res.json(users)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(parseInt(req.params.id))
    res.json(user)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

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
  } catch (error) {
    res.status(400)
    res.json({ error: error.toString() })
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(parseInt(req.params.id))
    res.json(deleted)
  } catch (error) {
    res.status(400)
    res.json({ error: error.toString() })
  }
}

export const users_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.post('/create-root-user', create)
  app.post('/users', verifyAuthToken, create)
  app.delete('/users/:id', verifyAuthToken, destroy)
}
