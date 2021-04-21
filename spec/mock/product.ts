import { Product } from '../../src/models/product'

export const testProductData: Omit<Product, 'id'> = {
  name: 'xperia',
  price: 90000,
  category: 'mobiles',
}
