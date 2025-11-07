<template>
    <div class="w-full min-h-full flex flex-col items-center big-bg"
    v-if="successAPI === successAPITarget">
        <ClassTotal
        :sum="class_total_score"></ClassTotal>
        <div class="flex flex-col lg:flex-row items-center lg:justify-evenly w-full h-auto">
            <div class="flex flex-col w-[90%] lg:w-[65%] mb-4">
                <p class="p-2 text-gray-500">
                    The larger the radius of the ball, the higher the total xiuwei of the corresponding student
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
    import Matter from 'matter-js';
    const { Engine, Events, Render, Runner, World, Bodies, Query } = Matter;
    import ClassTotal from '../components/Individuals/ClassTotal.vue';
    import StudentDetail from '../components/Individuals/StudentDetail.vue';
    import FetchUnsuccessful from '../components/FetchUnsuccessful.vue';
    import Loading from '../components/Loading.vue';
    import { calculate_radii } from '../composables/Individuals/calculate_radii.js';
    import { t2ts } from '../composables/Individuals/transactions2total_score.ts';
    import { API_route, getUsers } from '../composables/configurations.mts';
    import { BallInformation, ClassTotalScore, IBTransactions, UserId2TotalScore, Users, usersKey } from '../composables/Individuals/interface.ts';

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
    const clicks = ref(0); // 球被点击的次数

    // matter.js变量初始化
    const min_r = Math.min(50, 0.1 * window.innerWidth);    
    const area_percentage = 0.73;

    const canvas = ref<HTMLCanvasElement>();
    let w: number, h: number;

    let hovered_ball: Matter.Body | null = null;
    let selected_ball: Matter.Body | null = null;

    let mousemove_event_deactivate: number;
    let mouse_in_canvas: boolean;

    function matterJsInit() {
        // 类型收窄
        if (!(canvas.value instanceof HTMLCanvasElement)) return;

        const CSSStyleDecoration = window.getComputedStyle(document.body);
        // matter.js
        // 获取宽度需要区分大小屏幕
        if (window.innerWidth >= 768) {
            w = canvas.value.clientWidth;
        } else {
            const w_canvas = canvas.value.clientWidth;
            const w_should = document.body.clientWidth * 0.9;

            w = (Math.abs(w_canvas - w_should) < 5) ? w_canvas : w_should; // 避免正在播放的动画对canvas宽度产生的干扰影响正常宽度的读取
        }
        h = canvas.value.clientHeight;

        // 初始化组件
        const engine = Engine.create();
        const render = Render.create({
            engine: engine,
            canvas: canvas.value,
            options: {
                width: w,
                height: h,
                wireframes: false,
                background: CSSStyleDecoration.getPropertyValue("--big-bg"),
            }
        });
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        /* 遍历目标：
        { student_id: total_score }
        */
        const user_id2total_score: UserId2TotalScore = {};
        for (const user_id in transactions.value) {
            user_id2total_score[user_id] = t2ts(transactions.value[user_id]);
        }
        // 为了确保接下来计算的鲁棒性，将无序对象转换为有序数组
        const user_ids = Object.keys(user_id2total_score).map(id => Number(id));
        const total_scores = Object.values(user_id2total_score);
        const radii = calculate_radii(total_scores, min_r, w*h*area_percentage, 0.8);

        const balls: Matter.Body[] = [];
        const ball_info: BallInformation[] = [];
        user_ids.forEach((id) => {
            balls.push(Bodies.circle(
                // x position, y position, radius
                w/2, h/2, radii[id],
                {
                    restitution: 0.5,
                    render: {
                        fillStyle: CSSStyleDecoration.getPropertyValue("--color-300"),
                        strokeStyle: CSSStyleDecoration.getPropertyValue("--color-400"),
                        lineWidth: 10,
                    },
                    // info: {
                    //     user_id: +id,
                    //     name: users.value[id],
                    //     total_score: total_scores[id].toFixed(2),
                    // },
                }
            ));
            ball_info.push({
                user_id: +id,
                name: users.value[id],
                total_score: total_scores[id].toFixed(2),
            });
        });
        const border_color = CSSStyleDecoration.getPropertyValue("--color-500");
        const ceiling = Bodies.rectangle(
            // x position, y position, width, height
            w/2, 0, w, 20, {
                isStatic: true,
                render: {
                    fillStyle: border_color,
                }
            }
        );
        const ground = Bodies.rectangle(
            w/2, h, w, 20, {
                isStatic: true,
                render: {
                    fillStyle: border_color,
                }
            }
        );
        const left_wall = Bodies.rectangle(
            0, h/2, 20, h, {
                isStatic: true,
                render: {
                    fillStyle: border_color,
                }
            }
        );
        const right_wall = Bodies.rectangle(
            w, h/2, 20, h, {
                isStatic: true,
                render: {
                    fillStyle: border_color,
                }
            }
        );
        World.add(engine.world, [...balls, ground, left_wall, right_wall, ceiling]);

        Events.on(render, "afterRender", () => {
            const ctx = render.context;
            balls.forEach((ball, index, _) => {
                ctx.save();
                // 绘制球形高亮
                let opacity = 0.3;
                if (selected_ball === null && hovered_ball == null) {
                    opacity = 1.0
                } else if (ball === selected_ball || ball === hovered_ball) {
                    opacity = 1.0;
                }
                ctx.globalAlpha = opacity;

                ctx.beginPath();
                ctx.arc(ball.position.x, ball.position.y, (ball.circleRadius || 0), 0, 2*Math.PI);
                ctx.fillStyle = ball.render.fillStyle || '';
                ctx.fill();

                // 绘制球面文字
                const radius = ball.circleRadius || 0;
                const text = ball_info[index].name;

                let font_size = radius * 0.8;
                ctx.font = `${font_size}px 'Times New Roman'`;
                const width = ctx.measureText(text).width;
                if (width > radius * 1.7) {
                    font_size = font_size * (radius * 1.7 / width);
                    ctx.font = `${font_size}px 'Times New Roman'`;
                }
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, ball.position.x, ball.position.y);
                ctx.restore();
            });
        });

        render.canvas.addEventListener('mouseenter', (e) => {
            mouse_in_canvas = true;
        });
        render.canvas.addEventListener('mouseleave', (e) => {
            mouse_in_canvas = false;
        });

        render.canvas.addEventListener('mousemove', (e) => {
            clearTimeout(mousemove_event_deactivate);
            const position = {
                x: e.offsetX,
                y: e.offsetY,
            };
            const target = Query.point(balls, position);

            if (target.length <= 0) {
                hovered_ball = null;
                return;
            }
            hovered_ball = target[0];

            mousemove_event_deactivate = setTimeout(() => {
                if (mouse_in_canvas) return;
                hovered_ball = null;
            }, 200);
        });
        render.canvas.addEventListener('click', (e) => {
            const position = {
                x: e.offsetX,
                y: e.offsetY,
            };
            const target = Query.point(balls, position);

            if (target.length <= 0) {
                selected_ball = null; 
                do_show_transactions.value = false;
                return;
            }
            if (target[0] === selected_ball) {
                selected_ball = null;
                do_show_transactions.value = false;
                return;
            }
            selected_ball = target[0];

            do_show_transactions.value = true;
            selected_user_id.value = ball_info[balls.indexOf(selected_ball)].user_id;

            clicks.value++;
        });
    }

    // 初始化
    watch(() => successAPI.value, (_new, _old) => {
        if (_new === successAPITarget) {
            nextTick(() => matterJsInit());
        };
    });

    // 窗口大小变化（含防抖）
    onMounted(() => window.addEventListener('resize', matterJsReInit));
    onUnmounted(() => window.removeEventListener('resize', matterJsReInit));
    let timeout: number;
    function matterJsReInit() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            matterJsInit();
        }, 200);
    }

</script>
