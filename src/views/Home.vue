<template>
  <div class="w-full min-h-full big-bg">
    <Transition name="content">
      <template v-if="successAPI === successAPITarget">
        <!--品字布局 ⬇️-->
        <div class="w-full h-full flex flex-col">
          <!--品字上面的口 ⬇️-->        <!--周修为选择栏-->
          <SelectBar @select="handle_select"></SelectBar>
          <!--品字下面的吅 ⬇️--> <!--小组修为展示 | 修为详细记录-->
          <!--在竖屏平板和手机上，“吅”会变成“吕”-->
          <div class="flex flex-col lg:flex-row items-center lg:justify-center h-auto my-5">
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 m-8 w-[90%] lg:w-[50%]">
              <Group
                :groups="scores[selected_period_id]"
              ></Group>
            </div>

            <RecordsTable
              :transactions="transactions[selected_period_id]"
            ></RecordsTable>
          </div>
        </div>
        <!--品字布局 ⬆️-->
      </template>
      <template v-else-if="successAPI < 0">
        <FetchUnsuccessful></FetchUnsuccessful>
      </template>
      <template v-else>
        <Loading></Loading>
      </template>
    </Transition>
  </div>
</template>

<script setup>
  import Group from "../components/Home/Group.vue";
  import SelectBar from "../components/Home/SelectBar.vue";
  import RecordsTable from "../components/Home/RecordsTable.vue";
  import FetchUnsuccessful from "../components/FetchUnsuccessful.vue";
  import Loading from "../components/Loading.vue";
  import { ref } from "vue";
  import { pre_api } from "../composables/configurations.mjs";

  // 选中的period_id
  let selected_period_id = ref(0);
  function handle_select(id) {
    selected_period_id.value = id;
  }

  // 网络请求状态
  function handle_e() {
    successAPI.value = -100
  }
  const successAPI = ref(0);
  const successAPITarget = 2;

  // 发送网络请求
  let scores = ref();
  fetch(`${pre_api}/scores`).then(r => 
    r.json()
  ).then(res => {
    scores.value = res;
    successAPI.value++;
  }).catch(_ => handle_e());

  let transactions = ref();
  fetch(`${pre_api}/pbt`).then(r => 
    r.json()
  ).then(res => {
    transactions.value = res;
    successAPI.value++;
  }).catch(_ => handle_e())
</script>

<style>
  .content-enter-active,
  .content-leave-active {
    transition: all 0.3s ease-in;
  }

  .content-enter-from,
  .content-leave-to {
    opacity: 0;
  }
</style>
