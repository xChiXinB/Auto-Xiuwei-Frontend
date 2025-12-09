<template>
    <div
        class="w-full min-h-full big-bg"
        v-if="successAPI === successAPITarget"
    >
        <div class="w-full h-full flex flex-col items-center p-8">
            <div class="w-full overflow-x-auto">
                <table
                    class="w-full border-collapse shadow-2xl rounded-2xl overflow-hidden"
                >
                    <thead>
                        <tr>
                            <th
                                class="bg-400 p-4 text-black font-bold text-center border-r border-r-gray-500"
                            >
                                {{ t('rank.table_header.group') }}
                            </th>
                            <th
                                v-for="period_id in sorted_period_ids"
                                :key="period_id"
                                class="bg-400 p-4 text-black font-bold text-center border-r border-r-gray-500 last:border-r-0"
                            >
                                {{ periods[period_id] }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="group_id in sorted_group_ids"
                            :key="group_id"
                            class="border-b border-b-gray-900 last:border-b-0"
                        >
                            <td
                                class="bg-300 p-3 text-black font-bold text-center border-r border-r-gray-500"
                            >
                                {{ groups[group_id] }}
                            </td>
                            <td
                                v-for="period_id in sorted_period_ids"
                                :key="period_id"
                                class="p-3 text-gray-700 text-center border-r border-r-gray-500 last:border-r-0"
                                :class="getCellClass(group_id, period_id)"
                            >
                                {{ getGroupScore(group_id, period_id) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button
                @click="exportToExcel"
                class="fixed right-8 bottom-8 bg-sec-500 hover:bg-sec-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-200"
            >
                {{ t('rank.export_button') }}
            </button>
        </div>
    </div>
    <div v-else-if="successAPI < 0">
        <FetchUnsuccessful></FetchUnsuccessful>
    </div>
    <div v-else>
        <Loading></Loading>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    API_route,
    getPeriods,
    getGroups,
} from '../composables/configurations.mts';
import FetchUnsuccessful from '../components/FetchUnsuccessful.vue';
import Loading from '../components/Loading.vue';
import * as XLSX from 'xlsx-js-style';

const { t } = useI18n();

// 网络请求状态
function handle_e(): void {
    successAPI.value = -Infinity;
}
const successAPI = ref<number>(0);
const successAPITarget: number = 3;

// 获取周期信息
let periods = ref();
provide('periods', periods);
getPeriods()
    .then((res) => {
        periods.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

// 获取组别信息
let groups = ref();
provide('groups', groups);
getGroups()
    .then((res) => {
        groups.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

// 获取分数数据
const class_id = localStorage.getItem('class') || '';
let scores = ref<any>();
fetch(`${API_route}/scores?class_id=${class_id}`)
    .then((r) => r.json())
    .then((res) => {
        scores.value = res;
        successAPI.value++;
    })
    .catch((_) => handle_e());

// 排序后的周期ID列表（根据用户设置的展示顺序）
const sorted_period_ids = computed(() => {
    if (!periods.value) return [];
    const order = Number(localStorage.getItem('order') || '1');
    return Object.keys(periods.value)
        .map((k) => Number(k))
        .sort((a, b) => order * (a - b));
});

// 排序后的组别ID列表
const sorted_group_ids = computed(() => {
    if (!groups.value) return [];
    return Object.keys(groups.value)
        .map((k) => Number(k))
        .sort((a, b) => a - b);
});

// 计算指定组在指定周期的总分
function getGroupScore(group_id: number, period_id: number): string {
    if (
        !scores.value ||
        !scores.value[period_id] ||
        !scores.value[period_id][group_id]
    ) {
        return '0.00';
    }
    const group_scores = scores.value[period_id][group_id];
    const total = Object.values(group_scores).reduce(
        (sum: number, score: any) => sum + Number(score),
        0,
    );
    return total.toFixed(2);
}

// 计算指定周期内所有组的排名
function getRankingsForPeriod(period_id: number): Map<number, number> {
    const rankings = new Map<number, number>();
    if (!scores.value || !scores.value[period_id]) return rankings;

    const group_totals: { group_id: number; total: number }[] = [];

    // 计算该周期内所有组的总分
    for (const gid of sorted_group_ids.value) {
        const group_scores = scores.value[period_id][gid];
        const total = group_scores
            ? Object.values(group_scores).reduce(
                  (sum: number, score: any) => sum + Number(score),
                  0,
              )
            : 0;
        group_totals.push({ group_id: gid, total });
    }

    // 按总分降序排序
    group_totals.sort((a, b) => b.total - a.total);

    // 计算每个组的排名（分数相同则排名相同）
    for (let i = 0; i < group_totals.length; i++) {
        const current_total = group_totals[i].total;
        let rank = i + 1;
        for (let j = 0; j < i; j++) {
            if (group_totals[j].total === current_total) {
                rank = j + 1;
                break;
            }
        }
        rankings.set(group_totals[i].group_id, rank);
    }

    return rankings;
}

// 计算单元格样式（是否高亮）
function getCellClass(group_id: number, period_id: number): string {
    const highlightTopN = Number(localStorage.getItem('highlightTopN') || '3');
    const rankings = getRankingsForPeriod(period_id);
    const rank = rankings.get(group_id);

    if (rank && rank <= highlightTopN) {
        return 'bg-red-200 font-bold';
    }
    return '';
}

// 导出为Excel文件
async function exportToExcel(): Promise<void> {
    if (!periods.value || !groups.value || !scores.value) return;

    const highlightTopN = Number(localStorage.getItem('highlightTopN') || '3');

    // 构建表格数据
    const data: any[] = [];
    const header = [
        t('rank.table_header.group'),
        ...sorted_period_ids.value.map((id) => periods.value[id]),
    ];
    data.push(header);

    for (const group_id of sorted_group_ids.value) {
        const row = [groups.value[group_id]];
        for (const period_id of sorted_period_ids.value) {
            row.push(getGroupScore(group_id, period_id));
        }
        data.push(row);
    }

    // 生成Excel文件
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // 为高亮单元格添加样式
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let row = 1; row <= range.e.r; row++) {
        const group_id = sorted_group_ids.value[row - 1];

        for (let col = 1; col <= range.e.c; col++) {
            const period_id = sorted_period_ids.value[col - 1];
            const rankings = getRankingsForPeriod(period_id);
            const rank = rankings.get(group_id);

            if (!rank || rank > highlightTopN) continue;

            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) continue;

            worksheet[cellAddress].s = {
                fill: {
                    fgColor: { rgb: 'FFCCCB' },
                },
                font: {
                    bold: true,
                },
            };
        }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rank');

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true,
    });
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // 使用文件系统API保存文件，如果不支持则使用传统下载方式
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: t('rank.export_file.suggested_name'),
                types: [
                    {
                        description: t('rank.export_file.description'),
                        accept: {
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                ['.xlsx'],
                        },
                    },
                ],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            alert(t('rank.export_file.success'));
        } catch (err) {
            // 用户取消了保存操作
            if ((err as any).name !== 'AbortError') {
                console.error('Error saving file:', err);
            }
        }
    } else {
        // 备用方案：使用传统的下载方式
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = t('rank.export_file.suggested_name');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(t('rank.export_file.success'));
    }
}
</script>
