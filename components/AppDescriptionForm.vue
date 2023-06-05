<script setup lang="ts">

defineProps({
  loading: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['submit'])

const description = ref('');

const lang = ref('ja');

const submit = () => {
  emit('submit', description.value, lang.value);
}
</script>
<template>
  <form @submit.prevent="submit" class="pb-8 border p-8 rounded shadow-lg">
    <div class="mb-2">
      <label class="flex items-center font-bold mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-indigo-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
        アプリの説明 <span class="ml-3 font-normal">(例) 今日の天気を教えてくれる</span>
      </label>
      <input type="search" v-model="description" :disabled="loading" class="border w-full rounded-lg bg-gray-50 p-2 focus:outline-none focus:ring-2" placeholder="アプリの説明を入力してください">
    </div>

    <div class="space-x-3">
      <label for="language" class="font-bold">言語:</label>
      <input type="radio" id="japanese" value="ja" v-model="lang"> 日本語
      <input type="radio" id="english" value="en" v-model="lang"> 英語
    </div>
    
    <div class="text-end">
      <button
        type="submit"
        :disabled="!description || loading"
        :class="[description && !loading ? 'bg-indigo-400 hover:bg-blue-500' : 'bg-gray-300']" 
        class="mt-2 text-white rounded py-2 px-4"
      >アプリ名取得</button>  
    </div>
  </form>
</template>