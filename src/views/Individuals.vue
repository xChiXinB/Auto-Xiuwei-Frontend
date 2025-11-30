<template>
    <div class="w-full min-h-full flex flex-col items-center big-bg"
    v-if="successAPI === successAPITarget">
        <ClassTotal
        :sum="class_total_score"></ClassTotal>
        <div class="flex flex-col lg:flex-row items-center lg:justify-evenly w-full h-auto">
            <div class="flex flex-col w-[90%] lg:w-[65%] mb-4">
                <p class="p-2 text-gray-500">
                    {{ t('individuals.hint') }}
                </p>
                <canvas ref="canvas"
                class="w-full h-190 shrink-0"></canvas>
            </div>
            <StudentDetail
            :show="do_show_transactions"
            :transactions="transactions[selected_user_id]"
            :user_id="selected_user_id"
            :clicks="clicks"></StudentDetail>
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
    import { ref, onMounted, onUnmounted, watch, nextTick, provide } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    import ClassTotal from '../components/Individuals/ClassTotal.vue';
    import StudentDetail from '../components/Individuals/StudentDetail.vue';
    import FetchUnsuccessful from '../components/FetchUnsuccessful.vue';
    import Loading from '../components/Loading.vue';
    import { API_route, getUsers } from '../composables/configurations.mts';
    import { ClassTotalScore, IBTransactions, Users, usersKey } from '../composables/Individuals/interface.ts';
    import { MatterCanvasManager } from '../composables/Individuals/matter_canvas_manager.ts';

    // 选中的student_id
    const selected_user_id = ref<number>(0);

    // 网络请求状态
    function handle_e(): void {
        // 将successAPI设为很小的负数，表示请求失败
        successAPI.value = -Infinity;
    }
    const successAPI = ref<number>(0);
    const successAPITarget: number = 3;

    // 解析configuration的promise
    let users = ref<Users>({});
    provide(usersKey, users);
    getUsers().then((res: Users) => {
        users.value = res;
        successAPI.value++;
    }).catch(_ => handle_e());

    // 发送网络请求
    const class_id: string = localStorage.getItem("class") || "";
    let transactions = ref<IBTransactions>({});
    fetch(`${API_route}/ibt?class_id=${class_id}`).then(r => 
        r.json()
    ).then((res: IBTransactions) => {
        transactions.value = res;
        successAPI.value++;
    }).catch(_ => handle_e());

    let class_total_score = ref<number>(0);
    fetch(`${API_route}/total_score?class_id=${class_id}`).then(r => 
        r.json()
    ).then((res: ClassTotalScore) => {
        class_total_score.value = res[Number(class_id)];
        successAPI.value++;
    }).catch(_ => handle_e());

    // StudentDetail子组件额外响应式变量
    const do_show_transactions = ref(false);
    const clicks = ref(0);

    const canvas = ref<HTMLCanvasElement>();
    let canvasManager: MatterCanvasManager | null = null;

    function initCanvas() {
        if (!(canvas.value instanceof HTMLCanvasElement)) return;

        const minRadius = Math.min(50, 0.1 * window.innerWidth);
        const areaPercentage = 0.73;

        canvasManager = new MatterCanvasManager({
            canvas: canvas.value,
            transactions: transactions.value,
            users: users.value,
            minRadius,
            areaPercentage,
            onSelectionChange: (userId) => {
                if (userId === null) {
                    do_show_transactions.value = false;
                } else {
                    do_show_transactions.value = true;
                    selected_user_id.value = userId;
                    clicks.value++;
                }
            }
        }).start();
    }

    // 初始化
    watch(() => successAPI.value, (_new, _old) => {
        if (_new === successAPITarget) {
            nextTick(() => initCanvas());
        };
    });

    // 窗口大小变化（含防抖）
    onMounted(() => window.addEventListener('resize', handleResize));
    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        canvasManager?.destroy();
    });
    let resizeTimeout: number | undefined;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
            canvasManager?.destroy();
            initCanvas();
        }, 200);
    }

</script>
