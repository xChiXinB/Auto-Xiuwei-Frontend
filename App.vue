<template>
  <Group
    :group_name=group
    :students=students
  ></Group>
</template>

<script setup>
  import Group from "./src/components/Group.vue";
  import { ref } from "vue";

  const group = ref("Group");
  const students = ref(['a', 'b', 'c']);
</script>