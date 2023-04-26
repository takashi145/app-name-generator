<script setup lang="ts">
import { AppNames } from '@/interfaces/AppNames';

const results: Ref<AppNames[]> = ref([]);

const loading = ref(false);

const submit = async (description: string) => {
  if(!description) {
    alert('説明文を入力してください。')
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/generate', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: description }),
    })

    results.value = response;
    
    setTimeout(() => {
      const element = document.getElementById('result');

      if (element) {
        const targetDOMRect = element.getBoundingClientRect();
        const targetTop = targetDOMRect.top;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
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
      <AppLogo />
      
      <AppDescriptionForm :loading="loading" @submit="submit" />
    </div>
    
   
    <ResultList :results="results" />

    <div v-if="loading" class="fixed inset-0 bg-black/50 z-50">
      <div class="flex flex-col items-center justify-center mt-40">
        <p class="text-white mb-3 animate-pulse">アプリ名取得中</p>
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    </div>
    
  </div>
</template>
