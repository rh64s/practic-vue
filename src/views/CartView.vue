<script setup>
import { useUserStore } from '@/stores/user.js'
import { computed, onMounted, ref } from 'vue'
import ProductCard from '@/components/shared/ui/shop/product/ProductCard.vue'

const userStore = useUserStore()
onMounted(async () => {
  userStore.cartList()
})


const mergedCart = computed(() => {
  const map = new Map()
  userStore.cart.forEach(item => {
    const key = item.product_id
    if (map.has(key)) {
      map.get(key).count++
    } else {
      map.set(key, { ...item, count: 1 })
    }
  })
  return Array.from(map.values())
})
</script>

<template>
  <h1 class="page-name">Корзина</h1>
  <div class="cart">
    <div class="item" v-for="(item, index) in mergedCart" v-bind:key="index">
      <product-card :product="item" :count="item.count"></product-card>
    </div>
  </div>
</template>

<style scoped></style>
