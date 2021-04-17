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
  const status: string = req.body.status
  const id = parseInt(req.params.id)

  if (status === STATUS.open || status === STATUS.complete) {
  } else {
    res.status(400)
    res.json({ error: 'status is invalid' })
    return
  }

  try {
    const decodedToken = getDecodedToken(req.headers.authorization!)
    const order: Order = {
      id,
      status,
      user_id: decodedToken.user.id,
    }

    const updatedOrder = await store.update(order)

    if (!updatedOrder) {
      res.status(400)
      res.json({ error: `order with id ${id} not found` })
      return
    }

    res.json(updatedOrder)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const deletedOrder = await store.delete(id)

    if (deletedOrder.length === 0) {
      res.status(400)
      res.json({ error: `order with id ${id} not found` })
      return
    }

    res.json(deletedOrder)
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
