<template>
  <div class="shadow w-full h-14 overflow-x-auto whitespace-nowrap">
    <div v-for="period_id in sorted_periods_id" :key="period_id"
         class="inline-block h-full px-5 border-r-gray-500 border-r-1 last:border-r-0 hover:bg-300 hover:font-bold transition duration-200 ease-in-out"
         @click="select(period_id)"
         :class="selected_id === period_id ? 'bg-400' : 'bg-200'">
      <div class="flex flex-col justify-center w-full h-full text-3xl text-gray-900">
        {{ periods[period_id] }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { periods } from '../../composables/configurations.mjs'
  const sorted_periods_id = Object.keys(periods).sort((a, b) => Number(localStorage.getItem('order')) * (a-b));

  const emit = defineEmits(["select"]);

  const selected_id = ref(sorted_periods_id[
    localStorage.getItem('order') === '1'
    ? sorted_periods_id.length - 1
    : 0
  ]);
  emit("select", selected_id.value);

  function select(index) {
    selected_id.value = index;
    emit("select", index);
  }
</script>
