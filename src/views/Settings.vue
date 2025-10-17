<template>
    <div class="w-full h-full big-bg flex flex-col items-start p-10">
        <h1 class="text-3xl font-bold">
            Website Color Style
        </h1>
        <div class="w-full h-auto flex flex-row p-3 mb-10">
            <input type="radio" name="style" value="blue" v-model="style"></input>
            <span class="px-3 text-blue-500 text-2xl font-extrabold">Blue</span>

            <input type="radio" name="style" value="pink" v-model="style"></input>
            <span class="px-3 text-pink-500 text-2xl font-extrabold">Pink</span>
        </div>

        <h1 class="text-3xl font-bold">
            Display Order of XiuWei Records
        </h1>
        <div class="w-full h-auto flex flex-row p-3">
            <input type="radio" name="style" value="1" v-model="order"></input>
            <span class="px-3 text-2xl font-extrabold">Chronological order</span>

            <input type="radio" name="style" value="-1" v-model="order"></input>
            <span class="px-3 text-2xl font-extrabold">Reverse chronological order</span>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';

    const style = ref();
    style.value = localStorage.getItem('style');
    document.body.className = style.value;
    watch(style, (_new, _old) => {
        document.body.className = _new;
        localStorage.setItem('style', _new);
    });

    const order = ref();
    order.value = localStorage.getItem('order');
    watch(order, (_new, _old) => {
        localStorage.setItem('order', _new);
    });
</script>