<template>
    <div class="w-full h-full flex flex-col items-center bg-sky-500 border-r-4 border-sky-600 z-50">
        <div class="w-full py-5 h-auto flex flex-col items-center border-b-2 border-gray-600 hover:bg-sky-300 transition duration-200 md:hidden"
        @click="collapse">
            <img src="/icons/collapse.png" class="w-[40px] h-[40px]">
        </div>
        <div class="w-full py-5 h-auto flex flex-col items-center hover:bg-sky-300 transition duration-200"
        v-for="navigator in ref_navig" :key="navigator.id" :class="(current_router === navigator.router) && `bg-sky-400`"
        @click="alter_router(navigator.router)">
            <img :src="navigator.url" class="w-[40px] h-[40px]">
            <span class="font-semibold" style="font-size: x-small;">{{ navigator.text }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, defineEmits } from "vue";
    import { useRouter } from "vue-router";
    const router = useRouter();

    const emit = defineEmits(["collapse"]);
    function collapse() {
        emit("collapse");
    }

    interface Unit {
        id: number;
        url: string;
        text: string;
        router: string;
    }
    const navigators: Unit[] = [
        { id: 0, url: '/icons/dashboard.png', text: 'Dashboard', router: '/' },
        { id: 1, url: '/icons/individuals.png', text: 'Individuals', router: '/individuals' },
        { id: 2, url: '/icons/lucky-draw.png', text: 'Lucky Draw', router: '/lucky-draw' },
    ]

    const current_router = ref(router.currentRoute.value.path);
    function alter_router(location: string) {
        // 注意：push是异步函数
        router.push(location)
            .then(() => {
                current_router.value = router.currentRoute.value.path;
            });
    }

    const ref_navig = ref(navigators);
</script>
