import { api } from './api.js'
import router from '@/router/index.js'

export const shopService = {
  products: (data) =>
    api.get('products', data).then(response => response.data).then( (data) => {
      return data.data
    }),

  addToCart: (product_id) =>
    api.post(`cart/${product_id}`, product_id).then(response => response.data)
}
