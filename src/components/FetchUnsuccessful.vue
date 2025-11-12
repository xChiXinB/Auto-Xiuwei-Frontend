<template>
    <div class="w-full h-screen flex flex-col bg-gray-400 items-center justify-center">
        <h1 class="text-5xl font-bold p-4">
        {{ t('fetch_unsuccessful.title') }}
        </h1>
        <div class="flex flex-wrap p-6">
            <p class="text-2xl">
                {{ t('fetch_unsuccessful.message1') }}
                <span class="underline hover:text-blue-950" @click="refresh">
                {{ t('fetch_unsuccessful.refresh') }}</span>
                {{ t('fetch_unsuccessful.message2') }}
            </p>
        </div>
    </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  function refresh() {window.location.reload();}
</script>