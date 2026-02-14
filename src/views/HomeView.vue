<script setup>
import ProductCard from '@/components/shared/ui/shop/product/ProductCard.vue'

const products = ref([])
const cart = ref([])
const userStore = useUserStore()
const { isAuth } = storeToRefs(userStore)

onMounted(async () => {
  const productsResponse = await shopService.products()
  products.value = productsResponse
  if (localStorage.getItem('token')) {
    const cartResponse = await userService.cart()
    cart.value = cartResponse
  }
})

import { shopService } from '@/utils/api/shopService.js'
import { onMounted, ref } from 'vue'
import { userService } from '@/utils/api/userService.js'
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia'


</script>

<template>
  <main>
    <div v-if="isAuth" class="cart">
      <p>Должа быть карзинка</p>
      <div v-for="(item, index) in cart" v-bind:key="index" class="cart-item">
        <p>раз элемент</p>
      </div>
    </div>
    <div class="products">
      <product-card v-for="(product, index) in products" v-bind:key="index" :product></product-card>
    </div>
  </main>
</template>

<style scoped>
.products {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: start;
  gap: 30px;
}
</style>
