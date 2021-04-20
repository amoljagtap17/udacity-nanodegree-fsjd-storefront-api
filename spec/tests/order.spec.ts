import { Order, OrderStore, STATUS } from '../../src/models/order'
import { User, UserStore } from '../../src/models/user'

const orderStore = new OrderStore()
const userStore = new UserStore()

describe('Order Model ', () => {
  let user: User
  let order: Order
  const uuid = new Date().getTime()

  beforeAll(async () => {
    user = await userStore.create({
      firstname: 'F Name',
      lastname: 'L Name',
      username: `orderTestUser@${uuid}`,
      password: 'test@password',
    })
  })

  afterAll(async () => {
    await userStore.delete(user.id)
  })

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined()
  })

  it('should have a update method', () => {
    expect(orderStore.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(orderStore.delete).toBeDefined()
  })

  it('create method should add a new order', async () => {
    order = await orderStore.create(user.id)

    expect(order).toEqual({
      id: order.id,
      status: STATUS.open,
      user_id: user.id,
    })
  })

  it('update method should update the status for an existing order', async () => {
    const result: Order = await orderStore.update(order.id, STATUS.complete)

    expect(result).toEqual({
      id: order.id,
      status: STATUS.complete,
      user_id: user.id,
    })
  })

  it('delete method should delete the order', async () => {
    const result: Order[] = await orderStore.delete(order.id)

    expect(result).toEqual([
      {
        id: order.id,
        status: STATUS.complete,
        user_id: user.id,
      },
    ])
  })
})
