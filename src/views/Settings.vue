<template>
    <div class="w-full h-full big-bg flex flex-col items-start p-10">

        <h1 class="w-full text-3xl font-bold p-3">
            Class Selection
        </h1>
        <div class="w-full h-auto flex flex-col lg:flex-row pl-3 mb-10">
            <label for="class" class="px-3 text-2xl font-extrabold">
                Click to select a class:
            </label>
            <select id="class" v-model="class_name" class="border-2 border-black rounded-[4px]">
                <option v-for="(class_name, class_id) in classes" :key="class_id" :value="class_id">
                    {{ class_name }}
                </option>
            </select>
        </div>

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

            <div class="flex flex-row items-center pb-1.5 lg:pb-0">
                <input type="radio" name="style" value="custom" id="custom" v-model="style"></input>
                <label for="custom" class="px-3 text-2xl font-extrabold">Custom</label>
                <div class="p-0.5 flex flex-row items-center border-2 border-black rounded-[4px]">
                    <input type="color" class="p-0" v-model="custom_color"></input>
                    <span class="px-0.5">Pick a color</span>
                </div>
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

<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { apply_color, remove_all_color } from '../composables/settings/apply_color';
    import { getClasses } from '../composables/configurations.mts';
    let classes = ref();
    getClasses().then(res => {
        classes.value = res;
    });

    // 初始化颜色
    const custom_color = ref(localStorage.getItem('custom') || "#8B95C9");
    const style = ref<string>('');
    style.value = localStorage.getItem('style') || '';
    document.body.className = style.value;
    // 给定颜色调节
    watch(style, (_new, _) => {
        document.body.className = _new;
        localStorage.setItem('style', _new);
        if (_new === 'custom') {
            localStorage.setItem('custom', custom_color.value);
            apply_color(localStorage.getItem('custom') || '');
        } else {
            remove_all_color();
        }
    });
    // 自定义颜色调节
    watch(custom_color, (_new, _) => {
        if (localStorage.getItem('style') !== 'custom') return;
        localStorage.setItem('custom', _new);
        apply_color(localStorage.getItem('custom') || '');
    });

    // transactions展示顺序初始化
    const order = ref();
    order.value = localStorage.getItem('order');
    // 展示顺序调节
    watch(order, (_new, _) => {
        localStorage.setItem('order', _new);
    });

    // 初始化class选择
    const class_name = ref(Number(localStorage.getItem('class')) || 0);
    watch(class_name, (_new, _) => {
        localStorage.setItem('class', _new.toString());
    });
</script>