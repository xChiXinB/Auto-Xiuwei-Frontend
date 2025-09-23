<template>
  <div class="w-[90%] lg:w-[40%] min-h-[30vh] m-8 lg:h-200 rounded-2xl shadow-2xl flex flex-col">
    <!--标题-->
    <div class="bg-blue-400 p-4 rounded-t-2xl">
      <h1 class="text-4xl font-bold text-white text-center">
        {{ props.title }}
      </h1>
    </div>

    <!--表头-->
    <div class="grid grid-cols-4 border-b border-b-gray-900" style="grid-template-columns: 2fr 1fr 1fr 2fr">
      <p v-for="head in table_head" :key="head"
         class="bg-blue-300 p-2 break-words text-center text-black font-bold border-r border-r-gray-500 last:border-r-0">
        {{ head }}
      </p>
    </div>

    <div class="grid grid-cols-1 w-full overflow-auto">
      <!--表格内容-->
      <div class="grid grid-cols-4 border-b border-b-gray-900 last:border-b-0 hover:font-bold" style="grid-template-columns: 2fr 1fr 1fr 2fr"
           v-for="(row, index) in props.table_data" :key="index">
        <p class="p-1 text-gray-700 break-words text-center"
             v-for="(data, index) in row" :key="index">
          {{ data }}
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
  import { ref, defineProps } from "vue";

  const table_head = ref([
      'Time', 'Student', 'XiuWei', 'Reason'
  ]);

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    table_data: {
      type: Object,
      required: true
    },
  })
</script>