// @ts-ignore
import { client } from '../database'

export enum STATUS {
  open = 'OPEN',
  complete = 'COMPLETE',
}

export type Order = {
  id: number
  status: STATUS
  user_id: number
}

export class OrderStore {
  async create(userId: number): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [STATUS.open, userId])

      const order: Order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(
        `unable to create new order for user with id ${userId}: ${err}`
      )
    }
  }

  // Update status for a specific order
  async update(id: number, status: STATUS): Promise<Order> {
    try {
      const sql = 'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id, status])

      const order: Order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`unable to update order (${id} ${status}): ${err}`)
    }
  }

  async delete(id: number): Promise<Order[]> {
    try {
      const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const deletedOrder: Order[] = result.rows

      conn.release()

      return deletedOrder
    } catch (err) {
      throw new Error(`unable to delete order with id ${id}. Error: ${err}`)
    }
  }

  async addProduct(
    quantity: number,
    orderId: number,
    productId: number
  ): Promise<Order> {
    // get order to see if it is open
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)'
      //@ts-ignore
      const conn = await client.connect()

      const result = await conn.query(ordersql, [orderId])

      const order = result.rows[0]

      if (order.status !== STATUS.open) {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        )
      }

      conn.release()
    } catch (err) {
      throw new Error(`${err}`)
    }

    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      //@ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [quantity, orderId, productId])

      const order: Order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      )
    }
  }
}
