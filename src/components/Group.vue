<template>
  <div class="flex flex-col bg-blue-300 rounded-2xl hover:shadow-lg p-4 items-center justify-center">
    <h2 class="text-4xl font-bold text-center break-words">
      {{ props.group_name }}
    </h2>
    <ul class="text-gray-800 text-2xl text-center">
      <li v-for="item in props.students" :key="item.id" class="m-1 break-words">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { defineProps } from "vue";

  const props = defineProps({
    group_name: {
      type: String,
      required: true,
    },
    students: {
      type: Array,
      required: true,
    },
  });
</script>