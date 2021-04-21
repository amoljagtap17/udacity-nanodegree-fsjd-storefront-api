import supertest from 'supertest'
import { app } from '../../src/server'
import { testProductData } from '../mock/product'
import { testUserData } from '../mock/user'
import { Product } from '../../src/models/product'

const request = supertest(app)

const { name, price, category } = testProductData
const { username, password } = testUserData

describe('Test endpoint responses for product resource : ', () => {
  let userId: number
  let authHeader: string
  let product: Product

  beforeAll(async () => {
    const response = await request.post('/users/login').send({
      username,
      password,
    })

    userId = response.body.userId
    authHeader = `Bearer ${response.body.token}`
  })

  it('creates new product successfully', async () => {
    const response = await request
      .post('/products')
      .send({
        name,
        price,
        category,
      })
      .set('Accept', 'application/json')
      .set('Authorization', authHeader)

    product = response.body

    expect(response.body).toEqual(
      jasmine.objectContaining({
        name,
        price,
        category,
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
        id: product.id,
        name,
        price,
        category,
      })
    )
  })
})
