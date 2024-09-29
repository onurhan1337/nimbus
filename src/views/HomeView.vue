<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

interface Country {
  id: number
  name: string
}

const countries = ref<Country[]>([])

async function getCountries() {
  const { data } = await supabase.from('countries').select()
  countries.value = (data as Country[]) || []
}

onMounted(() => {
  getCountries()
})
</script>

<template>
  <ul>
    <li v-for="country in countries" :key="country.id">
      {{ country.name }}
    </li>
  </ul>
</template>
