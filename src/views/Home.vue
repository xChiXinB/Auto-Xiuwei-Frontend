<template>
    <div
        class="w-full min-h-full big-bg"
        v-if="successAPI === successAPITarget"
    >
        <!--品字布局 ⬇️-->
        <div class="w-full h-full flex flex-col">
            <!--品字上面的口 ⬇️-->
            <!--周修为选择栏-->
            <SelectBar ref="selectBarRef" @select="handle_select"></SelectBar>
            <!--品字下面的吅 ⬇️-->
            <!--小组修为展示 | 修为详细记录-->
            <!--在竖屏平板和手机上，“吅”会变成“吕”-->
            <div
                class="flex flex-col lg:flex-row items-start lg:justify-center h-auto my-5"
            >
                <div
                    class="grid grid-cols-1 gap-6 lg:grid-cols-2 m-8 w-[90%] lg:w-[50%]"
                >
                    <Group :groups="scores[selected_period_id]"></Group>
                </div>

                <RecordsTable
                    :transactions="transactions[selected_period_id]"
                ></RecordsTable>
            </div>
        </div>
        <!--品字布局 ⬆️-->
    </div>
    <div v-else-if="successAPI < 0">
        <FetchUnsuccessful></FetchUnsuccessful>
    </div>
    <div v-else>
        <Loading></Loading>
    </div>
</template>

<script setup lang="js">
import Group from '../components/Home/Group.vue';
import SelectBar from '../components/Home/SelectBar.vue';
import RecordsTable from '../components/Home/RecordsTable.vue';
import FetchUnsuccessful from '../components/FetchUnsuccessful.vue';
import Loading from '../components/Loading.vue';
import { provide, ref, watch, nextTick } from 'vue';
import {
    API_route,
    getGroups,
    getPeriods,
    getUsers,
} from '../composables/configurations.mts';

// 选中的period_id
let selected_period_id = ref(0);
const selectBarRef = ref();

function handle_select(id) {
    selected_period_id.value = id;
}

// 网络请求状态
function handle_e() {
    // 将successAPI设为很小的负数，表示请求失败
    successAPI.value = -Infinity;
}
const successAPI = ref(0);
const successAPITarget = 5;

// 当所有API加载完成后，滚动到选中的周期
watch(successAPI, (newVal) => {
    if (newVal === successAPITarget) {
        nextTick(() => selectBarRef.value?.scrollToSelected());
    }
});

// 解析configuration的promise
let periods = ref();
provide('periods', periods);
getPeriods()
    .then((res) => {
        selected_period_id.value = Math.min(
            ...Object.keys(res).map((k) => Number(k)),
        );
        periods.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

let users = ref();
provide('users', users);
getUsers()
    .then((res) => {
        users.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

let groups = ref();
provide('groups', groups);
getGroups()
    .then((res) => {
        groups.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

// 发送网络请求
const class_id = localStorage.getItem('class') || '';
let scores = ref();
fetch(`${API_route}/scores?class_id=${class_id}`)
    .then((r) => r.json())
    .then((res) => {
        scores.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

let transactions = ref();
provide('allTransactions', transactions);
fetch(`${API_route}/pbt?class_id=${class_id}`)
    .then((r) => r.json())
    .then((res) => {
        transactions.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());
</script>
