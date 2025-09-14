<template>
  <div class="flex flex-col md:flex-row items-center md:justify-center h-auto md:min-h-screen">
    <SelectBar @select="handle_select" :tables=tables></SelectBar>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 m-8 w-[90%] md:w-[50%]">
      <Group v-for="(students, group_name) in data" :key="group_name"
        :group_name=group_name
        :students=students
      ></Group>
    </div>

    <RecordsTable
      :table_data="records"
    ></RecordsTable>
  </div>
</template>

<script setup>
  import Group from "./src/components/Group.vue";
  import SelectBar from "./src/components/SelectBar.vue";
  import RecordsTable from "./src/components/RecordsTable.vue";
  import { ref } from "vue";

  // 分组修为展示
  const unfiltered_data = [];
  const data = ref({})

  // 选中索引默认是0，这样默认就展示现在一周的修为
  let selected_index = 0;
  function handle_select(index) {
    selected_index = index;
    // 在未过滤数据中索引出选中的数据，以响应式切换修为周
    data.value = unfiltered_data[selected_index];
    records.value = unfiltered_records[selected_index];
  }

  // 所有修为周名称数据，选择栏用得到
  const tables = ref([]
    // selected_index: 修为周名称
  );

  // 修为具体记录
  const unfiltered_records = [];
  const records = ref({
    // index: 修为周名称
  });

  const remote_server_ipv4 = '60.205.243.107';
  const get_scores_url = `http://${remote_server_ipv4}:5000/get_scores`;
  const get_records_url = `http://${remote_server_ipv4}:5000/get_records`;

  fetch(get_scores_url)
    .then(res => {
      if (!res.ok) {
        throw res.error;
      }
      return res.json();
    })
    .then(json_data => {
      let i = 0;
      Object.entries(json_data).forEach(([key, value]) => {
        // 参数：
        // key 字符串：修为周名称
        // value 对象：键是组名，值（数组[字符串]）是每个人的得分
        tables.value[i] = key; i++;
        // unfiltered_sth相当于是把json_data的键值从修为周名称替换为了selected_index
        unfiltered_data.push(value);
      });
      // 刷新data.value，否则获取的数据无法显示
      data.value = unfiltered_data[selected_index];
    });

  fetch(get_records_url)
    .then(res => {
      if (!res.ok) {
        throw res.error;
      }
      return res.json();
    })
    .then(json_data => {
      Object.entries(json_data).forEach(([_, value]) => {
        // 参数
        // key 字符串：修为周名称
        // value 对象：键是记录id，值（对象）是一条记录
        unfiltered_records.push(value);
      });
      records.value = unfiltered_records[selected_index];
    });

</script>