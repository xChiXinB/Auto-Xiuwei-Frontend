<template>
    <div class="w-[90%] lg:w-[30%] min-h-[30vh] lg:h-160 shadow-2xl rounded-4xl bg-sky-200 overflow-auto">
        <template v-if="props.show">
            <div class="w-full h-18 rounded-t-4xl bg-blue-400 flex items-center justify-center">
                <p class="text-4xl font-bold">{{ score }}</p>
            </div>
            <div v-for="detail in props.details" :key="detail.id"
            class="w-full border-b-2 border-gray-600 last:border-b-0 p-2 text-center hover:font-bold">
                {{ `${detail.time}, 
${detail.xiuwei >= 0 ? `+` : ``}${detail.xiuwei} 
because ${detail.reason}`}}
            </div>
        </template>
        <template v-else>
            <div class="w-full h-full flex flex-col items-center justify-center">
                <h1 class="text-3xl font-bold p-4 text-black/50">
                    Click on a ball to see details.
                </h1>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    interface Detail {
        id: number;
        time: string;
        xiuwei: number;
        reason: string;
    };

    const props = defineProps<{
        show: boolean,
        details: Detail[],
        score: string,
    }>();

</script>