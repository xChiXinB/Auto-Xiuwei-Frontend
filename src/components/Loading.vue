<template>
    <div
        class="w-full h-screen flex flex-col bg-200 items-center justify-center"
    >
        <h1
            class="text-6xl font-bold fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        >
            {{ t('loading.text') }}
        </h1>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
