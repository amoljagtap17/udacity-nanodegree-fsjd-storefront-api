import express, { Request, Response } from 'express'
import { Order, OrderStore, STATUS } from '../models/order'
import { verifyAuthToken } from '../middlewares/auth'
import { getDecodedToken } from '../utils/utils'

const store = new OrderStore()

const create = async (req: Request, res: Response) => {
  try {
    const decodedToken = getDecodedToken(req.headers.authorization!)
    const newOrder = await store.create(decodedToken.user.id)

    res.status(201)
    res.json(newOrder)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const update = async (req: Request, res: Response) => {
  const { status } = req.body
  const id = parseInt(req.params.id)

  try {
    const decodedToken = getDecodedToken(req.headers.authorization!)
    const order: Order = {
      id,
      status,
      user_id: decodedToken.user.id,
    }

    const updatedOrder = await store.update(order)

    res.json(updatedOrder)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(parseInt(req.params.id))

    res.json(deleted)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

export const orders_routes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, create)
  app.put('/orders/:id', verifyAuthToken, update)
  app.delete('/orders/:id', verifyAuthToken, destroy)
}
