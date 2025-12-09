<template>
    <div
        class="w-50 md:w-120 h-20 m-10 bg-400 rounded-full flex items-center justify-center hover:shadow-lg hover:-translate-y-2 transition duration-200 ease-in"
    >
        <p class="text-4xl font-bold">
            {{
                is_md
                    ? t('individuals.class_total.full_text')
                    : t('individuals.class_total.short_text')
            }}{{ sum }}'
        </p>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
    sum: {
        type: Number,
        required: true,
    },
});

const is_md = ref(window.innerWidth >= 768);
let timeout;
onMounted(() => window.addEventListener('resize', handle_resize));
onUnmounted(() => window.removeEventListener('resize', handle_resize));
function handle_resize() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        is_md.value = window.innerWidth >= 768;
    }, 200);
}
</script>
