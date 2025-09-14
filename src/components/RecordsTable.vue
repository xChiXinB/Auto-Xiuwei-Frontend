<template>
  <div class="w-[90%] md:w-[40%] min-h-[30vh] m-8 md:h-[80vh] rounded-2xl shadow-2xl overflow-auto flex flex-col">
    <!--标题-->
    <div class="sticky top-0 bg-blue-400 p-4 rounded-t-2xl">
      <h1 class="text-4xl font-bold text-white text-center">
        Detailed XiuWei Records
      </h1>
    </div>

    <div class="grid grid-cols-1 w-full">
      <!--表头-->
      <div class="sticky top-18 grid border-b border-b-gray-900" style="grid-template-columns: 2fr 1fr 1fr 2fr">
        <div v-for="head in table_head" :key="head"
             class="bg-blue-300 p-2 text-center text-black font-bold border-r border-r-gray-500 last-of-type:border-r-0">
          {{ head }}
        </div>
      </div>
      <!--表格内容-->
      <div class="grid border-b border-b-gray-900 last:border-b-0 hover:font-bold" style="grid-template-columns: 2fr 1fr 1fr 2fr"
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
    table_data: {
      type: Object,
      required: true
    },
  })
</script>