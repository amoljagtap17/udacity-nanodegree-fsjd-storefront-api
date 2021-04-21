import supertest from 'supertest'
import { app } from '../../src/server'
import { getDecodedToken } from '../../src/utils/utils'
import { User } from '../../src/models/user'
import { Order, STATUS } from '../../src/models/order'
import { Product } from '../../src/models/product'

const request = supertest(app)

describe('Test endpoint responses : ', () => {
  let token: string
  let authHeader: string
  let rootUser: Omit<User, 'password'>
  let order: Order
  let product: Product

  /* ORDERS TESTS */
  it('creates new order successfully using the token for root user', async () => {
    const response = await request
      .post('/orders')
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    order = response.body

    expect(order).toEqual(
      jasmine.objectContaining({
        status: STATUS.open,
        user_id: rootUser.id,
      })
    )
  })

  /* PRODUCTS TESTS */

  it('product can be added successfully to an order with auth token passed in request', async () => {
    const response = await request
      .post(`/orders/${order.id}/products`)
      .send({
        productId: product.id,
        quantity: 5,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    expect(response.body).toEqual(
      jasmine.objectContaining({
        quantity: 5,
        order_id: order.id,
        product_id: product.id,
      })
    )
  })

  it('gets current order for an user successfully with auth token passed in request', async () => {
    const response = await request
      .get(`/users/${rootUser.id}/orders/${order.id}/products`)
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    const { name, price, category } = product

    expect(response.body[0]).toEqual(
      jasmine.objectContaining({
        name,
        price,
        category,
        quantity: 5,
      })
    )
  })
})
