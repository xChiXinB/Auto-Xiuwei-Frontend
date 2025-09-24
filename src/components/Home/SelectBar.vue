<template>
  <div class="shadow w-full h-14 overflow-x-auto whitespace-nowrap">
    <div v-for="(table, index) in props.tables" :key="index"
         class="inline-block h-full px-5 border-r-gray-500 border-r-1 last:border-r-0 hover:bg-blue-300 hover:font-bold transition duration-200 ease-in-out"
         @click="select(index)"
         :class="selected_index === index ? 'bg-blue-400' : 'bg-blue-200'">
      <div class="flex flex-col justify-center w-full h-full text-3xl text-gray-900">
        {{ table }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

  const props = defineProps({
    tables: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(["select"]);

  const selected_index = ref(0);

  function select(index) {
    selected_index.value = index;
    emit("select", index);
  }
</script>

<!-- md:px-0 md:fixed md:top-0 md:right-0 md:z-50 -->