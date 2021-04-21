import supertest from 'supertest'
import { app } from '../../src/server'
import { testProductData } from '../mock/product'
import { testUserData } from '../mock/user'
import { Product } from '../../src/models/product'
import { STATUS, Order } from '../../src/models/order'

const request = supertest(app)

const { name, price, category } = testProductData
const { username, password } = testUserData

describe('Test endpoint responses for order resource : ', () => {
  let authHeader: string
  let userId: string
  let order: Order
  let product: Product

  beforeAll(async () => {
    const response = await request.post('/users/login').send({
      username,
      password,
    })

    authHeader = `Bearer ${response.body.token}`
    userId = response.body.userId

    const res = await request
      .post('/products')
      .send({
        name,
        price,
        category,
      })
      .set('Accept', 'application/json')
      .set('Authorization', authHeader)

    product = res.body
  })

  afterAll(async () => {
    await request.delete(`/products/${product.id}`)
  })

  it('creates new order successfully', async () => {
    const response = await request
      .post('/orders')
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    order = response.body

    expect(order).toEqual(
      jasmine.objectContaining({
        status: STATUS.open,
        user_id: userId,
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
      .get(`/users/${userId}/orders/${order.id}/products`)
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

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
