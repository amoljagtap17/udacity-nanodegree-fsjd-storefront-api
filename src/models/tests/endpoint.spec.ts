import supertest from 'supertest'
import { app } from '../../server'
import { getDecodedToken } from '../../utils/utils'
import { User } from '../../models/user'

const request = supertest(app)

describe('Test endpoint responses', () => {
  let token: string
  let authHeader: string
  let rootUser: Omit<User, 'password'>

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
})
