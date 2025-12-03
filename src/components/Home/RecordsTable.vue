<template>
  <div class="w-[90%] lg:w-[40%] min-h-[30vh] m-8 lg:h-200 rounded-2xl shadow-2xl flex flex-col lg:sticky lg:top-10">
    <!--标题-->
    <div class="bg-400 p-4 rounded-t-2xl">
      <h1 class="text-4xl font-bold text-black text-center">
        {{ t('records_table.title') }}
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
      <div class="grid grid-cols-4 border-b border-b-gray-900 last:border-b-0 hover:font-bold relative" style="grid-template-columns: 2fr 1fr 1fr 2fr"
      v-for="transaction_id in sorted_transaction_id" :key="transaction_id"
      @mouseenter="handleMouseEnter($event, transaction_id)"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave">
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

    <!-- Tooltip 使用 Teleport 传送到 body -->
    <Teleport to="body">
      <div v-if="tooltipVisible" 
           class="fixed bg-black/80 text-white text-sm px-2 py-1 rounded pointer-events-none z-50 transition-opacity"
           :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }">
        {{ t('records_table.index_tooltip', { index: currentTooltipIndex }) }}
      </div>
    </Teleport>
  </div>

</template>

<script setup>
  import { ref, inject, computed } from "vue";
  import { useI18n } from "vue-i18n";
  const { t } = useI18n();
  const users = inject('users');
  const allTransactions = inject('allTransactions');

  // Tooltip 状态管理
  const tooltipVisible = ref(false);
  const tooltipPosition = ref({ x: 0, y: 0 });
  const currentTooltipIndex = ref(0);

  const handleMouseEnter = (event, transactionId) => {
    currentTooltipIndex.value = transactionIndexMap.value[transactionId];
    tooltipVisible.value = true;
    updateTooltipPosition(event);
  };

  const handleMouseMove = (event) => {
    if (tooltipVisible.value) {
      updateTooltipPosition(event);
    }
  };

  const handleMouseLeave = () => {
    tooltipVisible.value = false;
  };

  const updateTooltipPosition = (event) => {
    tooltipPosition.value = {
      x: event.clientX + 10,
      y: event.clientY - 30
    };
  };

  const table_head = ref([
      t('records_table.headers.time'), t('records_table.headers.student'), t('records_table.headers.xiuwei'), t('records_table.headers.reason')
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

  // 计算全局索引映射：transaction_id -> 索引（1-based）
  const transactionIndexMap = computed(() => {
    if (!allTransactions.value) return {};
    
    // 1. 收集所有 transactions 到一个数组

    /**
     * 结构：[
     *   { 
     *      transaction_id: number,
     *      time: timestamp
     *   },
     *   ...
     * ]
     */
    const allRecords = [];
    for (const periodId in allTransactions.value) {
      const periodTransactions = allTransactions.value[periodId];
      for (const transactionId in periodTransactions) {
        allRecords.push({
          transaction_id: Number(transactionId),
          time: periodTransactions[transactionId].time
        });
      }
    }
    
    // 2. 按后端规则排序：time DESC, transaction_id DESC
    allRecords.sort((recordA, recordB) => {
      if (recordB.time !== recordA.time) {
        return recordB.time - recordA.time; // time DESC
      }
      return recordB.transaction_id - recordA.transaction_id; // transaction_id DESC
    });
    
    // 3. 建立 transaction_id -> 索引的映射（1-based）
    const indexMap = {};
    allRecords.forEach((record, index, _) => {
      indexMap[record.transaction_id] = index + 1;
    });
    
    return indexMap;
  });

  // 计算当前周期的排序后的 transaction_id 列表
  const sorted_transaction_id = computed(() => {
    if (!props.transactions || !transactionIndexMap.value) return [];
    
    const currentTransactions = Object.keys(props.transactions).map(id => ({
      transaction_id: Number(id),
      time: props.transactions[id].time,
      globalIndex: transactionIndexMap.value[Number(id)] // 依赖之前计算的映射获取全局索引
    }));
    
    // 按全局索引排序，确保显示的连续性
    const order = Number(localStorage.getItem('order') || '1');
    currentTransactions.sort((a, b) => {
      if (order === 1) {
        return a.globalIndex - b.globalIndex; // 索引从小到大（从新到旧）
      } else {
        return b.globalIndex - a.globalIndex; // 索引从大到小（从旧到新）
      }
    });
    
    return currentTransactions.map(t => t.transaction_id);
  });
</script>
