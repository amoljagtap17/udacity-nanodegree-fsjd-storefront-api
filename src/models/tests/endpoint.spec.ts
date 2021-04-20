import supertest from 'supertest'
import { app } from '../../server'
import { getDecodedToken } from '../../utils/utils'
import { User } from '../../models/user'
import { Order, STATUS } from '../../models/order'
import { Product } from '../../models/product'

const request = supertest(app)

describe('Test endpoint responses : ', () => {
  let token: string
  let authHeader: string
  let rootUser: Omit<User, 'password'>
  let order: Order
  let product: Product

  /* USERS TESTS */
  it('creates the root user successfully', async () => {
    const response = await request
      .post('/create-root-user')
      .send({
        firstname: 'admin',
        lastname: 'user',
        username: 'admin3',
        password: 'testpassword',
      })
      .set('Accept', 'application/json')

    token = response.body

    authHeader = `Bearer ${token}`

    const decodedToken = getDecodedToken(authHeader)

    rootUser = decodedToken.user

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()
  })

  it('gets correct count for list of users', async () => {
    const response = await request
      .get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    expect(response.body.length).toEqual(1)
  })

  it('creates new user successfully using the token for root user', async () => {
    const response = await request
      .post('/users')
      .send({
        firstname: 'test',
        lastname: 'user',
        username: 'testUser1',
        password: 'testpassword1',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()
  })

  it('gets correct data for the specific user', async () => {
    const response = await request
      .get(`/users/${rootUser.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()

    const { firstname, lastname, username } = rootUser

    expect(response.body).toEqual(
      jasmine.objectContaining({
        firstname,
        lastname,
        username,
      })
    )
  })

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
