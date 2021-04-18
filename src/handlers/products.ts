import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import { verifyAuthToken } from '../middlewares/auth'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index()
    res.json(products)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id))
    res.json(product)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const create = async (req: Request, res: Response) => {
  const { name, price, category } = req.body

  const product: Omit<Product, 'id'> = {
    name,
    price,
    category,
  }

  try {
    const newProduct = await store.create(product)
    res.status(201)
    res.json(newProduct)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

const update = async (req: Request, res: Response) => {
  const { name, price, category } = req.body
  const id = parseInt(req.params.id)
  const product: Product = {
    id,
    name,
    price,
    category,
  }

  try {
    const updatedProduct = await store.update(product)

    res.json(updatedProduct)
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

const getProductsByOrderId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId)
  const orderId = parseInt(req.params.orderId)

  try {
    const products = await store.getProductsByOrderId(userId, orderId)

    res.json(products)
  } catch (error) {
    res.status(500)
    res.json({ error: error.toString() })
  }
}

export const products_routes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', verifyAuthToken, create)
  app.put('/products/:id', verifyAuthToken, update)
  app.delete('/products/:id', verifyAuthToken, destroy)
  app.get(
    '/users/:userId/orders/:orderId/products',
    verifyAuthToken,
    getProductsByOrderId
  )
}
