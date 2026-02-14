<script setup>
import { shopService } from '@/utils/api/shopService.js'
import { useUserStore } from '@/stores/user.js'

const props = defineProps(
  {
    product: Object,
    count: {
      type: Number,
      default: 1,
      required: false,
    },

  }
)

const cartStore = useUserStore()
const image_path = import.meta.env.VITE_CDN_URL

const addToCart = (() => {
  if (props.count >= 1) {
    shopService.addToCart(props.product.product_id)
    updateCart()
    return
  }
  shopService.addToCart(props.product.id)
  updateCart()
})

const updateCart = async () => {
  setTimeout(1500)
  await cartStore.cartList()
}
</script>

<template>
  <div class="product">
    <div class="product-image">
      <img :src="image_path + product.image" />
    </div>
    <div class="product-about">
      <p class="product-name">{{product.name}}</p>
      <p class="product-description">{{product.description}}</p>
      <p class="product-price">Цена: {{product.price}}</p>
      <p class="product-count" v-if="product.count">У вас в корзине {{product.count}}</p>
    </div>
    <button class="button button-add" v-on:click="addToCart" v-if="cartStore.isAuth">
      В корзину
    </button>

  </div>
</template>

<style scoped>
.product{
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 20px;
  border-radius: 14px;
  border: 4px solid #a0f5a0;
  max-width: 400px;
  min-width: 250px;
}
.product-name {
  font-size: 1.2em;
}
.product-description{
  color: #2e2e2e;
  word-wrap: break-word;
  font-size: 0.8em;
}
.product-price{
  color: #292b1e;
  border: 4px solid #c9ffa5;
  padding: 0.2em 0.7em;
  border-radius: 12px;
}
.product-image {
  border-radius: 15px;
}
.product-image > img {
  width: 100%;
}

</style>
