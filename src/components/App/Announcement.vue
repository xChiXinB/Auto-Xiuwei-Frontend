<template>
    <div class="absolute bottom-5 w-full text-center text-gray-600">
        {{ t('announcements.ai') }}
        <span class="font-bold">&nbsp;·&nbsp;</span>
        {{ t('announcements.author') }}
        <span class="font-bold">&nbsp;·&nbsp;</span>
        {{ t('announcements.thanks') }}
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>
