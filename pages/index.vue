<script setup lang="ts">

type AppNames = {
  name: string,
  catchphrase: string,
}

const description = ref('');

const results = ref([] as AppNames[]);

const loading = ref(false);

const submit = async () => {
  if(!description.value) {
    return;
  }

  loading.value = true;
  try {
    const data = await $fetch<AppNames[]>('/api/generate', {
      method: 'post',
      body: { description: description.value },
    })
    results.value = data;
    
    setTimeout(() => {
      const element = document.getElementById('result')!;
      const targetDOMRect = element.getBoundingClientRect();
      const targetTop = targetDOMRect.top;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }, 100);
  }catch(e) {
    alert("取得に失敗しました。");
  }finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <div class="mt-8 mb-16">
      <img src="@/assets/images/logo.png" alt="app name generator" class="w-36 h-36 mx-auto">
      <form @submit.prevent="submit" class="pb-8 border p-8 rounded shadow-lg">
        <div>
          <label class="flex items-center font-bold mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-indigo-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            アプリの説明 <span class="ml-3 font-normal">(例) 今日の天気を教えてくれる</span>
          </label>
          <input type="text" v-model="description" :disabled="loading" class="border w-full rounded-lg bg-gray-50 p-2 focus:outline-none focus:ring-2" placeholder="アプリの説明を入力してください">
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
    </div>
    
   
    <div v-if="results.length >= 1" id="result" class="my-8">
      <h3 class="text-lg font-bold mb-3">結果：</h3>
      <ul class="space-y-6">
        <li v-for="r in results" :key="r.name" class="border shadow-lg py-4 px-2 rounded text-center">
            <h3 class="text-xl font-bold mb-3">{{ r.name }}</h3>
            <p class="text-sm">{{ r.catchphrase }}</p>
        </li>
      </ul> 
    </div>

    <div v-if="loading" class="fixed inset-0 bg-black/50 z-50">
      <div class="flex flex-col items-center justify-center mt-40">
        <p class="text-white mb-3 animate-pulse">アプリ名取得中</p>
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    </div>
    
  </div>
</template>
