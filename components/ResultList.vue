<script setup lang="ts">
import { AppNames } from '@/interfaces/AppNames';

defineProps({
  results: {
    type: Array as () => AppNames[],
    default: () => []
  }
})
</script>
<template>
  <div v-if="results.length >= 1" id="result" class="my-8">
    <h3 class="text-lg font-bold mb-3">結果：</h3>
    <ul class="space-y-6">
      <li v-for="r in results" :key="r.name" class="border shadow-lg py-4 px-2 rounded text-center">
          <h3 class="text-xl font-bold mb-3">{{ r.name }}</h3>
          <p class="text-sm">{{ r.catchphrase }}</p>
      </li>
    </ul> 
  </div>
</template>