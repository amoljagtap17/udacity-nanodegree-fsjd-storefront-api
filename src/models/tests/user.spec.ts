import { UserStore } from '../user'

const store = new UserStore()

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env
const pepper: string = BCRYPT_PASSWORD!
const saltRounds: string = SALT_ROUNDS!

describe('User Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have a update method', () => {
    expect(store.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined()
  })

  it('create method should add a new user', async () => {
    const result = await store.create({
      firstname: 'First Name',
      lastname: 'Last Name',
      username: 'User Name',
      password: 'test@password',
    })

    expect(result).toEqual(
      jasmine.objectContaining({
        id: 1,
        firstname: 'First Name',
        lastname: 'Last Name',
        username: 'User Name',
      })
    )
  })

  it('index method should return a list of users', async () => {
    const result = await store.index()

    expect(result[0]).toEqual(
      jasmine.objectContaining({
        id: 1,
        firstname: 'First Name',
        lastname: 'Last Name',
        username: 'User Name',
      })
    )
  })

  it('show method should return the correct user', async () => {
    const result = await store.show(1)

    expect(result).toEqual(
      jasmine.objectContaining({
        id: 1,
        firstname: 'First Name',
        lastname: 'Last Name',
        username: 'User Name',
      })
    )
  })

  it('update method should update the existing user', async () => {
    const result = await store.update({
      id: 1,
      firstname: 'Updated First Name',
      lastname: 'Updated Last Name',
      username: 'Updated User Name',
      password: 'updated@password',
    })

    expect(result).toEqual(
      jasmine.objectContaining({
        id: 1,
        firstname: 'Updated First Name',
        lastname: 'Updated Last Name',
        username: 'Updated User Name',
      })
    )
  })

  it('delete method should remove the user', async () => {
    store.delete(1)

    const result = await store.index()

    expect(result).toEqual([])
  })
})
