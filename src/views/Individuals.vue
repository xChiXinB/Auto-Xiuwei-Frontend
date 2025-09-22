<template>
    <transition name="all">
        <div class="w-full h-full flex flex-col items-center justify-center" v-if="show_all">
            <h1 class="text-5xl font-bold p-4">
                This page is currently under development.
            </h1>
            <p class="text-2xl">
                Coming soon......
            </p>
        </div>
    </transition>
</template>

<script setup lang="ts">
    import { ref, nextTick } from 'vue';

    const show_all = ref(false);
    nextTick(() => {show_all.value = true});
</script>

<style>
    .all-enter-active,
    .all-leave-active {
        transition: all 0.3s ease-in;
    }

    .all-enter-from,
    .all-leave-to {
        opacity: 0;
    }
</style>