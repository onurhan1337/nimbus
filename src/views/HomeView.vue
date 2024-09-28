<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import { supabase } from '../lib/supabaseClient'

const props = defineProps(['session'])
const { session } = toRefs(props)

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
  <div v-if="session">
    <ul>
      <li v-for="country in countries" :key="country.id">
        {{ country.name }}
      </li>
      <button v-if="countries.length === 0" @click="getCountries">Add new country</button>
    </ul>
  </div>
  <RouterLink to="/register" v-else />
</template>
