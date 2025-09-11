<template>
  <div class="bg-blue-300 rounded-2xl hover:shadow-lg p-4">
    <h2 class="text-4xl font-bold text-center">
      {{ props.group_name }}
    </h2>
    <ul class="text-gray-800 text-2xl text-center">
      <li v-for="item in props.students" :key="item.id" class="m-1">
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