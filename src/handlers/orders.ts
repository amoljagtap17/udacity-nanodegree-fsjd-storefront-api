import express, { Request, Response } from 'express'
import { Order, OrderStore, STATUS } from '../models/order'
import { verifyAuthToken } from '../middlewares/auth'
import { getDecodedToken } from '../utils/utils'

const store = new OrderStore()

const index = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId)
  const orderId = parseInt(req.params.orderId)

  try {
    const order = await store.show(userId, orderId)
    res.json(order)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

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
    const updatedOrder = await store.update(id, status)

    // If returned object is undefined then no records were updted for the given id. Mostly when the id is incorrect.
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

    // If returned array is empty then no records were deleted for the given id. Mostly when the id is incorrect.
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

const addProduct = async (req: Request, res: Response) => {
  const orderId: number = parseInt(req.params.id)
  const productId: number = parseInt(req.body.productId)
  const quantity: number = parseInt(req.body.quantity)

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId)

    res.json(addedProduct)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

export const orders_routes = (app: express.Application) => {
  app.get('/users/:userId/orders/:orderId', index)
  app.post('/orders', verifyAuthToken, create)
  app.put('/orders/:id', verifyAuthToken, update)
  app.delete('/orders/:id', verifyAuthToken, destroy)
  app.post('/orders/:id/products', verifyAuthToken, addProduct)
}
