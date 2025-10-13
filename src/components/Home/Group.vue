<template>
  <div class="flex flex-col bg-blue-300 rounded-2xl p-4 items-center justify-center
  hover:shadow-lg hover:-translate-y-2 transition duration-200 ease-in-out"
  v-for="group_id in sorted_group_id" :key="group_id">
    <h2 class="text-4xl font-extrabold text-center break-words mb-2.5">
      {{ groups[group_id] }}: {{ Object.values(props.groups[group_id]).reduce((a, b) => a+b, 0).toFixed(2) }}'
    </h2>
    <ul class="text-gray-800 text-2xl text-center">
      <li v-for="(score, student_id) in Object.values(props.groups)[group_id]" :key="student_id" class="m-1 break-words">
        {{ users[student_id] }}: {{ score }}'
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { groups, users } from '../../composables/configurations.mjs';

  const props = defineProps({
    groups: {
      type: Object,
      // "Group #1": {
      //     "Stu #1": 1,
      //     "Stu #2": 2,
      //     "Stu #3": 3,
      // } ......
      required: true,
    },
  });

  const sorted_group_id = Object.keys(props.groups).sort((a, b) => a-b);
</script>
