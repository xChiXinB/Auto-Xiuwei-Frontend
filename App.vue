<template>
  <div class="flex flex-col md:flex-row items-center md:justify-center h-auto md:min-h-screen">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 p-6 w-[90%] md:w-[50%]">
      <Group v-for="(students, group_name) in data"
        :group_name=group_name
        :students=students
      ></Group>
    </div>
  </div>
</template>

<script setup>
  import Group from "./src/components/Group.vue";
  import { ref } from "vue";

  let data = ref();
  const remote_server_ipv4 = '60.205.243.107';
  const get_score_url = `http://${remote_server_ipv4}:5000/get_scores`;
  fetch(get_score_url)
      .then(res => {
        if (!res.ok) {
          throw res.error;
        }
        return res.json();
      })
      .then(json_data => {
        data = ref(json_data);
      })
</script>