<script setup>
const products = ref([])
onMounted( async () => {
  const productsResponse = await shopService.products()
  products.value = productsResponse
})

import { shopService } from '@/utils/api/shopService.js'
import { onMounted, ref } from 'vue'
</script>

<template>
  <main>
    <p v-for="(product, index) in products" v-bind:key="index">{{ product.id }} name = {{ product.name }}</p>
  </main>
</template>
