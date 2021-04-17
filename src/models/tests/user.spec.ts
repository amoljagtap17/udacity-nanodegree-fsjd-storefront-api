import bcrypt from 'bcrypt'
import { User, UserStore } from '../user'

const store = new UserStore()

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env
const pepper: string = BCRYPT_PASSWORD!
const saltRounds: string = SALT_ROUNDS!

const password = 'test@password'
const updatedPassword = 'newtest@password'
const hash = (password: string) =>
  bcrypt.hashSync(password + pepper, parseInt(saltRounds))

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
      firstName: 'First Name',
      lastName: 'Last Name',
      userName: 'User Name',
      password,
    })

    expect(result).toEqual({
      id: 1,
      firstName: 'First Name',
      lastName: 'Last Name',
      userName: 'User Name',
      password: hash(password),
    })
  })

  it('index method should return a list of users', async () => {
    const result = await store.index()

    expect(result).toEqual([
      {
        id: 1,
        firstName: 'First Name',
        lastName: 'Last Name',
        userName: 'User Name',
        password: hash(password),
      },
    ])
  })

  it('show method should return the correct user', async () => {
    const result = await store.show(1)

    expect(result).toEqual({
      id: 1,
      firstName: 'First Name',
      lastName: 'Last Name',
      userName: 'User Name',
      password: hash(password),
    })
  })

  it('delete method should remove the user', async () => {
    store.delete(1)

    const result = await store.index()

    expect(result).toEqual([])
  })

  it('update method should update the existing user', async () => {
    const result = await store.update({
      id: 1,
      firstName: 'Updated First Name',
      lastName: 'Updated Last Name',
      userName: 'Updated User Name',
      password: updatedPassword,
    })

    expect(result).toEqual({
      id: 1,
      firstName: 'Updated First Name',
      lastName: 'Updated Last Name',
      userName: 'Updated User Name',
      password: hash(updatedPassword),
    })
  })
})
