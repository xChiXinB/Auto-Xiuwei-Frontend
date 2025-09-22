<template>
  <Transition>
    <div class="w-full min-h-full transition duration-300 ease-in"
    :class="is_e ? `bg-gray-400 flex items-center justify-center` : `bg-sky-200`"
    v-if="show_all">
      <Transition>
        <template v-if="scores_ok && records_ok">
          <!--品字布局 ⬇️-->
          <div class="w-full h-full flex flex-col">
            <!--品字上面的口 ⬇️-->        <!--周修为选择栏-->
            <SelectBar @select="handle_select" :tables=tables></SelectBar>
            <!--品字下面的吅 ⬇️--> <!--小组修为展示 | 修为详细记录-->
            <!--在竖屏平板和手机上，“吅”会变成“吕”-->
            <div class="flex flex-col lg:flex-row items-center lg:justify-center h-auto my-5">
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 m-8 w-[90%] lg:w-[50%]">
                <Group v-for="(students, group_name) in data" :key="group_name"
                  :group_name=group_name
                  :students=students
                ></Group>
              </div>

              <RecordsTable
                :table_data="records"
              ></RecordsTable>
            </div>
          </div>
          <!--品字布局 ⬆️-->
        </template>
        <template v-else-if="is_e">
          <div class="w-full h-full flex flex-col items-center justify-center">
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
        <template v-else>
          <h1 class="text-6xl font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">Please wait...</h1>
        </template>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
  import Group from "../components/Group.vue";
  import SelectBar from "../components/SelectBar.vue";
  import RecordsTable from "../components/RecordsTable.vue";
  import { ref, nextTick } from "vue";

  const show_all = ref(false);
  nextTick(() => {show_all.value = true});

  function refresh() {window.location.reload();}

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
  const get_scores_url = `http://${remote_server_ipv4}/api/get_scores`;
  const get_records_url = `http://${remote_server_ipv4}/api/get_records`;

  const scores_ok = ref(false);
  const records_ok = ref(false);
  const is_e = ref(false);

  function handle_e() {
    records_ok.value = scores_ok.value = false;
    is_e.value = true;
  }
  fetch(get_scores_url)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    })
    .then(json_data => {
      let i = 0;
      Object.entries(json_data).forEach(([key, value]) => {
        // 参数：
        // key 字符串：修为周名称
        // value 对象：键是组名，值（数组[字符串]）是每个人的得分
        tables.value[i] = key
          .replaceAll('_', ' ')
          .replaceAll('-', '/')
          .replace('scores', 'Xiuwei');
        i++;
        // unfiltered_sth相当于是把json_data的键值从修为周名称替换为了selected_index
        unfiltered_data.push(value);
      });
      // 刷新data.value，否则获取的数据无法显示
      data.value = unfiltered_data[selected_index];
      scores_ok.value = true;
    })
    .catch(_ => {
      handle_e();
    });

  fetch(get_records_url)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status);
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
      records_ok.value = true;
    })
    .catch(_ => {
      handle_e();
    });

</script>

<style>
  .v-enter-active,
  .v-leave-active {
    transition: all 0.3s ease-in;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
