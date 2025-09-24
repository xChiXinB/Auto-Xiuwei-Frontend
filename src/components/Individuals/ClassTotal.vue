<template>
    <div class="w-80 md:w-120 h-20 m-10 bg-sky-400 rounded-full flex items-center justify-center hover:shadow-lg hover:-translate-y-2 transition duration-200 ease-in">
        <p class="text-2xl md:text-4xl font-bold">
            {{ `Class total xiuwei: ${sum}'` }}
        </p>
    </div>
</template>

<script setup>
    const props = defineProps({
       sum: {
        type: Number,
        required: true,
       },
    });
</script>
