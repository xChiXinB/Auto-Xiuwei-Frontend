<template>
  <div class="w-[90%] lg:w-[40%] min-h-[30vh] m-8 lg:h-200 rounded-2xl shadow-2xl flex flex-col lg:sticky lg:top-10">
    <!--标题-->
    <div class="bg-400 p-4 rounded-t-2xl">
      <h1 class="text-4xl font-bold text-white text-center">
        Detailed Xiuwei Records
      </h1>
    </div>

    <!--表头-->
    <div class="grid grid-cols-4 border-b border-b-gray-900" style="grid-template-columns: 2fr 1fr 1fr 2fr">
      <p v-for="head in table_head" :key="head"
         class="bg-300 p-2 break-words text-center text-black font-bold border-r border-r-gray-500 last:border-r-0">
        {{ head }}
      </p>
    </div>

    <div class="grid grid-cols-1 w-full overflow-auto">
      <!--表格内容-->
      <div class="grid grid-cols-4 border-b border-b-gray-900 last:border-b-0 hover:font-bold" style="grid-template-columns: 2fr 1fr 1fr 2fr"
      v-for="transaction_id in sorted_transaction_id" :key="transaction_id">
        <p class="p-1 text-gray-700 break-words text-center"
        v-for="(data, key) in props.transactions[transaction_id]" :key="key">
          <template v-if="key == 'time'">
            <!--数据库返回的时间戳是秒级的-->
            {{ new Date(data * 1000).toLocaleString() }}
          </template>
          <template v-else-if="key == 'user_id'">
            {{ users[data] }}
          </template>
          <template v-else>
            {{ data }}
          </template>
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
  import { ref, watch } from "vue";
  import { users } from "../../composables/configurations.mjs";

  const table_head = ref([
      'Time', 'Student', 'XiuWei', 'Reason'
  ]);

  const props = defineProps({
    transactions: {
      type: Object,
      // 1: {
      //     time: 1760140343,
      //     user_id: 3,
      //     variation: -1,
      //     reason: "迟到",
      // },
      // 2: {
      //     // 省略
      // },
      required: true
    },
  });

  let sorted_transaction_id;
  watch(() => props.transactions, () => {
    sorted_transaction_id = Object.keys(props.transactions).sort((a, b) => Number(localStorage.getItem('order')) * (a-b));
  });
</script>
