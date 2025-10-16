<template>
    <div class="w-full h-full big-bg flex flex-col items-start p-10">
        <h1 class="text-3xl font-bold">
            Website Color Style
        </h1>
        <div class="w-full h-auto flex flex-row p-3">
            <input type="radio" name="style" value="blue" v-model="style"></input>
            <span class="px-3 text-blue-500 text-2xl font-extrabold">Blue</span>

            <input type="radio" name="style" value="pink" v-model="style"></input>
            <span class="px-3 text-pink-500 text-2xl font-extrabold">Pink</span>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';

    const style = ref();
    style.value = 'blue';
    document.body.className = 'blue';

    watch(style, (_new, _old) => {
        document.body.className = _new;
    });
</script>