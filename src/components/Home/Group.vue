<template>
    <div
        class="flex flex-col bg-300 rounded-2xl p-4 items-center justify-center hover:shadow-lg hover:-translate-y-2 transition duration-200 ease-in-out"
        v-for="group_id in sorted_group_id"
        :key="group_id"
    >
        <h2 class="text-4xl font-extrabold text-center break-words mb-2.5">
            {{ groups[group_id] }}:
            {{
                Object.values(props.groups[group_id])
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2)
            }}'
        </h2>
        <ul class="text-gray-800 text-2xl text-center">
            <li
                v-for="(score, student_id) in Object.values(filtered_groups)[
                    group_id
                ]"
                :key="student_id"
                class="m-1 break-words"
            >
                {{ users[student_id] }}: {{ score }}'
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, inject, watchEffect } from 'vue';
/*
 * 注意：
 * groups是group_id和group_name的映射表，是一个响应式变量，需要用.value访问其值
 * props.groups是Map<group_id, Map<student_id, score>>，是一个普通对象
 */
const groups = inject('groups');
const users = inject('users');
const DEBUG_GROUP_RENDER =
    (localStorage.getItem('debugGroupRender') || 'f') === 't';

const props = defineProps({
    groups: {
        type: Object,
        // "Group #1": {
        //     "Stu #1": 1,
        //     "Stu #2": 2,
        //     "Stu #3": 3,
        // },
        // "Group #2": {
        //     "Stu #4": 4,
        //     "Stu #5": 5,
        //     "Stu #6": 6,
        // },
        required: true,
    },
});

const sorted_group_id = Object.keys(props.groups).sort((a, b) => a - b);
const filtered_groups = computed(() => {
    const is0Shown = (localStorage.getItem('is0Shown') || 't') === 't';
    if (is0Shown) {
        return props.groups;
    }

    // 筛选掉所有分数为0的学生
    const res = {};
    for (let group_id of sorted_group_id) {
        res[group_id] = {};
        for (let student_id in props.groups[group_id]) {
            const score = props.groups[group_id][student_id];
            if (score === 0) continue;
            res[group_id][student_id] = score;
        }
    }
    return res;
});

watchEffect(() => {
    if (!DEBUG_GROUP_RENDER) return;

    const byValues = Object.values(filtered_groups.value || {});
    const byKeys = Object.keys(filtered_groups.value || {});

    console.groupCollapsed('[Group Debug] Render snapshot');
    console.log('sorted_group_id =>', sorted_group_id);
    console.log('Object.keys(filtered_groups) =>', byKeys);

    for (const group_id of sorted_group_id) {
        const keyBasedMembers = (filtered_groups.value || {})[group_id];
        const valueBasedMembers = byValues[group_id];

        console.log(
            `group_id=${group_id}`,
            {
                groupName: groups?.value?.[group_id],
                keyBasedCount: keyBasedMembers
                    ? Object.keys(keyBasedMembers).length
                    : 'undefined',
                valueBasedCount: valueBasedMembers
                    ? Object.keys(valueBasedMembers).length
                    : 'undefined',
                keyBasedMembers,
                valueBasedMembers,
            },
        );
    }

    console.groupEnd();
});
</script>
