// @ts-ignore
import { client } from '../database'

export type Product = {
  id: number
  name: string
  price: number
  category: string
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT id, name, price, category FROM products'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql)

      const products: Product[] = result.rows

      conn.release()

      return products
    } catch (err) {
      throw new Error(`DB error retrieving products. Error: ${err}`)
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT id, name, price, category FROM products WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const product: Product = result.rows[0] || {}

      conn.release()

      return product
    } catch (err) {
      throw new Error(
        `DB error retrieving product with id ${id}. Error: ${err}`
      )
    }
  }

  async create(p: Omit<Product, 'id'>): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [p.name, p.price, p.category])

      const product: Product = result.rows[0]

      conn.release()

      return product
    } catch (err) {
      throw new Error(
        `unable to create product (${p.name} ${p.price} ${p.category}): ${err}`
      )
    }
  }

  async update(p: Product): Promise<Product> {
    try {
      const sql =
        'UPDATE products SET name = $2, price = $3, category = $4 WHERE id = $1 RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [p.id, p.name, p.price, p.category])

      const product: Product = result.rows[0]

      conn.release()

      return product
    } catch (err) {
      throw new Error(
        `unable to update product (${p.id} ${p.name} ${p.price} ${p.category}): ${err}`
      )
    }
  }

  async delete(id: number): Promise<string> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      await conn.query(sql, [id])

      conn.release()

      return 'Product Deleted'
    } catch (err) {
      throw new Error(`DB error deleting product with id ${id}. Error: ${err}`)
    }
  }

  async getProductsByOrderId(
    userId: number,
    orderId: number
  ): Promise<Product[]> {
    try {
      const sql =
        'SELECT p.id, p.name, p.price, p.category, op.quantity FROM products p INNER JOIN order_products op ON p.id = op.product_id INNER JOIN orders o ON o.id = op.order_id WHERE o.user_id = $1 AND op.order_id = $2;'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [userId, orderId])

      const products: Product[] = result.rows

      conn.release()

      return products
    } catch (err) {
      throw new Error(
        `DB error retrieving products (${userId} ${orderId}). Error: ${err}`
      )
    }
  }
}
