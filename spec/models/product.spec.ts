import { Product, ProductStore } from '../../src/models/product'

const productStore = new ProductStore()

const payload = {
  name: 'product 1',
  price: 456,
  category: 'cat 1',
}

describe('Product Model ', () => {
  let product: Product

  it('should have an index method', () => {
    expect(productStore.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(productStore.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(productStore.create).toBeDefined()
  })

  it('should have an update method', () => {
    expect(productStore.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(productStore.delete).toBeDefined()
  })

  it('should have a getProductsByOrderId method', () => {
    expect(productStore.getProductsByOrderId).toBeDefined()
  })

  it('create method should add a new product', async () => {
    product = await productStore.create(payload)

    expect(product).toEqual(jasmine.objectContaining(payload))
  })

  it('index method should return a list of products', async () => {
    const result = await productStore.index()

    const filteredProduct = result.filter((item) => item.id === product.id)

    expect(filteredProduct).toEqual([
      {
        id: product.id,
        ...payload,
      },
    ])
  })

  it('show method should return the correct product', async () => {
    const result = await productStore.show(product.id)

    expect(result).toEqual({
      id: product.id,
      ...payload,
    })
  })

  it('update method should update the existing product', async () => {
    const result: Product = await productStore.update({
      id: product.id,
      name: 'updated product 1',
      price: 756,
      category: 'updated cat 1',
    })

    expect(result).toEqual({
      id: product.id,
      name: 'updated product 1',
      price: 756,
      category: 'updated cat 1',
    })
  })

  it('delete method should delete the product', async () => {
    const result: Product[] = await productStore.delete(product.id)

    expect(result).toEqual([
      {
        id: product.id,
        name: 'updated product 1',
        price: 756,
        category: 'updated cat 1',
      },
    ])
  })
})
