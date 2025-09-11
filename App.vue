<template>
  <div class="flex flex-col md:flex-row items-center md:justify-center h-auto md:min-h-screen">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 p-6 w-[90%] md:w-[50%]">
      <Group v-for="(students, group) in data"
        :group_name=group
        :students=students
      ></Group>
    </div>
    <p class="text-sm text-gray-500">Test</p>
  </div>
</template>

<script setup>
  import Group from "./src/components/Group.vue";
  import { ref } from "vue";

  const data = ref({
    "Group1": ['a', 'b', 'c', 'd'],
    "Group2": ['a', 'b', 'c', 'd'],
    "Group3": ['a', 'b', 'c', 'd'],
    "Group4": ['a', 'b', 'c', 'd', 'e'],
  });
</script>