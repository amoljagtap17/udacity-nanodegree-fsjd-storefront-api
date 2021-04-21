import supertest from 'supertest'
import { app } from '../../src/server'
import { testUserData } from '../mock/user'

const request = supertest(app)

const { firstname, lastname, username, password } = testUserData

describe('Test endpoint responses for Users : ', () => {
  let authHeader: string
  let userId: string

  it('creates the new user successfully', async () => {
    const response = await request
      .post('/users')
      .send({ firstname, lastname, username, password })
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()

    userId = response.body.userId
    authHeader = `Bearer ${response.body.token}`
  })

  it('gets correct count for list of users', async () => {
    const response = await request
      .get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    expect(response.body.length).toEqual(1)
  })

  it('gets correct data for the specific user', async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `${authHeader}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()

    expect(response.body).toEqual(
      jasmine.objectContaining({
        id: userId,
        firstname,
        lastname,
        username,
      })
    )
  })
})
