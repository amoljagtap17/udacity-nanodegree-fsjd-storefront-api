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
  it('creates new product successfully using the token for root user', async () => {
    const response = await request
      .post('/products')
      .send({
        name: 'p 1',
        price: 56,
        category: 'c 1',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    product = response.body

    expect(product).toEqual(
      jasmine.objectContaining({
        name: 'p 1',
        price: 56,
        category: 'c 1',
      })
    )
  })

  it('gets list of products successfully with auth token not passed in request', async () => {
    const response = await request
      .get('/products')
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()
    expect(response.body.length).toEqual(1)
  })

  it('gets details of a specific product successfully with auth token not passed in request', async () => {
    const response = await request
      .get(`/products/${product.id}`)
      .set('Accept', 'application/json')

    expect(response.body).toEqual(
      jasmine.objectContaining({
        name: 'p 1',
        price: 56,
        category: 'c 1',
      })
    )
  })

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
