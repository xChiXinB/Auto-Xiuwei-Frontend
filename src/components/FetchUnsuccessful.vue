<template>
    <div class="w-full h-screen flex flex-col bg-gray-400 items-center justify-center">
        <h1 class="text-5xl font-bold p-4">
        We are unable to fetch your data.
        </h1>
        <div class="flex flex-wrap p-6">
            <p class="text-2xl">
                Please check your network, or
                <span class="underline hover:text-blue-950" @click="refresh">
                refresh</span>
                the page.
            </p>
        </div>
    </div>
</template>

<script setup>
  function refresh() {window.location.reload();}
</script>