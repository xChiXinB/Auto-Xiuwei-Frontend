<template>
  <div class="flex flex-col md:flex-row items-center md:justify-center h-auto md:min-h-screen">
    <SelectBar @select="handle_select" :tables=tables></SelectBar>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 p-6 w-[90%] md:w-[50%]">
      <Group v-for="(students, group_name) in data" :key="group_name"
        :group_name=group_name
        :students=students
      ></Group>
    </div>
  </div>
</template>

<script setup>
  import Group from "./src/components/Group.vue";
  import SelectBar from "./src/components/SelectBar.vue";
  import { ref } from "vue";

  // 分组修为展示
  const unfiltered_data = [];
  let selected_index = 0;
  function handle_select(index) {
    selected_index = index;
    data.value = unfiltered_data[selected_index];
  }
  const data = ref({})

  // 周修为分离选择栏
  const tables = ref([]);

  const remote_server_ipv4 = '60.205.243.107';
  const get_scores_url = `http://${remote_server_ipv4}:5000/get_scores`;
  fetch(get_scores_url)
    .then(res => {
      if (!res.ok) {
        throw res.error;
      }
      return res.json();
    })
    .then(json_data => {
      let i = 0
      Object.entries(json_data).forEach(([key, value]) => {
        tables.value[i] = key; i++;
        unfiltered_data.push(value);
      });
      // 刷新data.value，否则获取的数据无法显示
      data.value = unfiltered_data[selected_index];
    })

</script>