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

  async update(o: Order): Promise<Order> {
    try {
      const sql = 'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [o.id, o.status])

      const order: Order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(
        `unable to update order (${o.id} ${o.status} ${o.user_id}): ${err}`
      )
    }
  }

  async delete(id: number): Promise<string> {
    try {
      const sql = 'DELETE FROM orders WHERE id = $1'
      // @ts-ignore
      const conn = await client.connect()

      await conn.query(sql, [id])

      conn.release()

      return 'Order Deleted'
    } catch (err) {
      throw new Error(`unable to delete order with id ${id}. Error: ${err}`)
    }
  }
}
