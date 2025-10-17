<template>
    <div class="w-full h-full big-bg flex flex-col items-start p-10">
        <h1 class="w-full text-3xl font-bold p-3">
            Website Color Style
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="blue" id="blue" v-model="style"></input>
                <label for="blue" class="px-3 text-blue-500 text-2xl font-extrabold">Blue</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="pink" id="pink" v-model="style"></input>
                <label for="pink" class="px-3 text-pink-500 text-2xl font-extrabold">Pink</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="green" id="green" v-model="style"></input>
                <label for="green" class="px-3 text-green-500 text-2xl font-extrabold">Green</label>
            </div>
        </div>

        <h1 class="w-full text-3xl font-bold p-3">
            Display Order of XiuWei Records
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="order" value="1" id="order1" v-model="order"></input>
                <label for="order1" class="px-3 text-2xl font-extrabold">Chronological order</label>
            </div>

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="order" value="-1" id="order-1" v-model="order"></input>
                <label for="order-1" class="px-3 text-2xl font-extrabold">Reverse chronological order</label>
            </div>
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