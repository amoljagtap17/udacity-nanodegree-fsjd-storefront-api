import { User, UserStore } from '../user'

const store = new UserStore()

describe('User Model', () => {
  let user: User

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
    user = await store.create({
      firstname: 'First Name',
      lastname: 'Last Name',
      username: 'User Name',
      password: 'test@password',
    })

    expect(user).toEqual(
      jasmine.objectContaining({
        id: user.id,
        firstname: 'First Name',
        lastname: 'Last Name',
        username: 'User Name',
      })
    )
  })

  it('index method should return a list of users', async () => {
    const result = await store.index()

    const filteredResult = result.filter((item) => user.id === item.id)

    expect(filteredResult[0]).toEqual(
      jasmine.objectContaining({
        id: user.id,
        firstname: 'First Name',
        lastname: 'Last Name',
        username: 'User Name',
      })
    )
  })

  it('show method should return the correct user', async () => {
    const result = await store.show(user.id)

    expect(result).toEqual(
      jasmine.objectContaining({
        id: user.id,
        firstname: 'First Name',
        lastname: 'Last Name',
        username: 'User Name',
      })
    )
  })

  it('update method should update the existing user', async () => {
    const result = await store.update({
      id: user.id,
      firstname: 'Updated First Name',
      lastname: 'Updated Last Name',
      username: 'Updated User Name',
      password: 'updated@password',
    })

    expect(result).toEqual(
      jasmine.objectContaining({
        id: user.id,
        firstname: 'Updated First Name',
        lastname: 'Updated Last Name',
        username: 'Updated User Name',
      })
    )
  })

  it('delete method should remove the user', async () => {
    const result = await store.delete(user.id)

    expect(result[0]).toEqual(
      jasmine.objectContaining({
        id: user.id,
        firstname: 'Updated First Name',
        lastname: 'Updated Last Name',
        username: 'Updated User Name',
      })
    )
  })
})
