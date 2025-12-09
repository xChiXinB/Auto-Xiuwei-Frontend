<template>
    <div
        class="w-full h-full flex flex-col items-center bg-400 border-r-4 border-color-500 z-50"
    >
        <div
            class="w-full py-5 h-auto flex flex-col items-center border-b-2 border-gray-600 hover:bg-300 transition duration-200 md:hidden"
            @click="collapse"
        >
            <img src="/icons/collapse.png" class="w-[40px] h-[40px]" />
        </div>
        <div
            class="w-full py-5 h-auto flex flex-col items-center hover:bg-300 transition duration-200"
            v-for="navigator in ref_navig"
            :key="navigator.id"
            :class="current_router === navigator.router && `bg-500`"
            @click="alter_router(navigator.router)"
        >
            <img :src="navigator.url" class="w-[40px] h-[40px]" />
            <!-- 根据语言调整文字大小 -->
            <span
                class="font-semibold"
                :style="{ fontSize: locale === 'zh' ? 'medium' : 'x-small' }"
                >{{ navigator.text }}</span
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n({ useScope: 'global' });
import { useRouter } from 'vue-router';
const router = useRouter();

const emit = defineEmits(['collapse']);
function collapse() {
    emit('collapse');
}

const props = defineProps({
    md: {
        type: Number,
        required: true,
    },
});

interface Unit {
    id: number;
    url: string;
    text: string;
    router: string;
}
const navigators = computed<Unit[]>(() => [
    {
        id: 0,
        url: '/icons/dashboard.png',
        text: t('sidebar.dashboard'),
        router: '/',
    },
    {
        id: 1,
        url: '/icons/individuals.png',
        text: t('sidebar.individuals'),
        router: '/individuals',
    },
    { id: 2, url: '/icons/rank.png', text: t('sidebar.rank'), router: '/rank' },
    {
        id: 3,
        url: '/icons/lucky-draw.png',
        text: t('sidebar.lucky_draw'),
        router: '/lucky-draw',
    },
    {
        id: 4,
        url: '/icons/settings.png',
        text: t('sidebar.settings'),
        router: '/settings',
    },
]);

const current_router = ref<string>('');
onMounted(() => {
    // 目前不知道怎么稳定在网页刚加载就获取路由
    setTimeout(() => {
        current_router.value = router.currentRoute.value.path;
    }, 200);
});
function alter_router(location: string) {
    if (window.innerWidth < props.md) {
        emit('collapse');
    }
    // 注意：push是异步函数
    router.push(location).then(() => {
        current_router.value = router.currentRoute.value.path;
    });
}

const ref_navig = ref(navigators);
</script>
