<template>
    <transition name="all">
        <!-- <div class="w-full h-full flex flex-col items-center justify-center" v-if="show_all">
            <h1 class="text-5xl font-bold p-4">
                This page is currently under development.
            </h1>
            <p class="text-2xl">
                Coming soon......
            </p>
        </div> -->
        <!-- <template> -->
            <!--品字布局-->
            <div class="w-full h-full flex flex-col items-center">
                <ClassTotal
                :sum="class_total_score"></ClassTotal>
                <div class="flex flex-col lg:flex-row items-center lg:justify-evenly w-full h-auto">
                    <canvas ref="canvas"
                    class="w-[90%] lg:w-[60%] h-190"></canvas>
                    <StudentDetail
                    :show="show"
                    :details="details"
                    :score="score"></StudentDetail>
                </div>
            </div>
        <!-- </template> -->
    </transition>
</template>

<script setup lang="ts">
    import { ref, nextTick, onMounted } from 'vue';
    import Matter from 'matter-js';
    const { Engine, Events, Render, Runner, World, Bodies, Query } = Matter;
    import ClassTotal from '../components/Individuals/ClassTotal.vue';
    import StudentDetail from '../components/Individuals/StudentDetail.vue';
    import { calculate_radii } from '../composables/Individuals/calculate_radii.js';

    const show_all = ref(false);
    nextTick(() => {show_all.value = true});

    interface ScoreInfoOfOne {
        id: number;
        student: string;
        score: number;
        details: Detail[];
    }
    interface Detail {
        id: number;
        time: string;
        xiuwei: number;
        reason: string;
    }
    interface Result {
        class_total_score: number;
        score_info_of_all: ScoreInfoOfOne[];
    }

    // API数据
    let score_info_of_all: ScoreInfoOfOne[] = [];
    const class_total_score = ref<number>(0);
    const remote_server_domain = '60.205.243.107';
    const get_individuals_url = `http://${remote_server_domain}/api/get_individuals`;
    onMounted(() => {
        fetch(get_individuals_url)
            .then((res: any) => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then((json_data: Result) => {
                score_info_of_all = json_data.score_info_of_all;
                class_total_score.value = json_data.class_total_score;

                w = canvas.value.clientWidth;
                h = canvas.value.clientHeight;
                min_score = Math.min(
                    ...score_info_of_all.map((score) => score.score)
                );
                max_score = Math.max(
                    ...score_info_of_all.map((score) => score.score)
                );
                setTimeout(() => {
                    matterJsInit();
                }, 200);
            });
    });

    // StudentDetail响应式变量
    const show = ref(false);
    const details = ref<Detail[]>([]);
    const score = ref('');

    // matter.js所需变量
    //（所有只let没有赋值的变量，需要fetch后才能定义）
    let min_score: number;
    let max_score: number;

    const min_r = 50;    
    const area_percentage = 0.7854;

    const canvas = ref();
    let w: number, h: number;

    let hovered_ball: any = null;
    let selected_ball: any = null;

    function matterJsInit() {
        // matter.js
        const engine = Engine.create();
        const render = Render.create({
            engine: engine,
            canvas: canvas.value,
            options: {
                width: w,
                height: h,
                wireframes: false,
                background: '#B8E6FE',
            }
        });
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // 计算圆的半径
        const scores = score_info_of_all.map((one) => 
            one.score
        );
        const radii = calculate_radii(scores, min_r, w*h*area_percentage, 0.8);

        const balls: any[] = [];
        let index = 0;
        for (const score of score_info_of_all) {
            balls.push(Bodies.circle(
                // x position, y position, radius
                w/2, h/2, radii[index],
                {
                    restitution: 0.5,
                    render: {
                        fillStyle: '#00A6F4',
                        strokeStyle: '#0084D1',
                        lineWidth: 10,
                    },
                    info: {
                        name: score.student,
                        score: score.score,
                        details: score.details,
                    },
                }
            ));

            index++;
        }
        const ceiling = Bodies.rectangle(
            // x position, y position, width, height
            w/2, 0, w, 20, {
                isStatic: true,
                render: {
                    fillStyle: '#0069A8',
                }
            }
        );
        const ground = Bodies.rectangle(
            w/2, h, w, 20, {
                isStatic: true,
                render: {
                    fillStyle: '#0069A8',
                }
            }
        );
        const left_wall = Bodies.rectangle(
            0, h/2, 20, h, {
                isStatic: true,
                render: {
                    fillStyle: '#0069A8',
                }
            }
        );
        const right_wall = Bodies.rectangle(
            w, h/2, 20, h, {
                isStatic: true,
                render: {
                    fillStyle: '#0069A8',
                }
            }
        );
        World.add(engine.world, [...balls, ground, left_wall, right_wall, ceiling]);

        Events.on(render, "afterRender", () => {
            const ctx = render.context;
            balls.forEach((ball) => {
                ctx.save();
                // 绘制球形高亮
                let opacity: number = 0.3;
                if (selected_ball === null && hovered_ball == null) {
                    opacity = 1.0
                } else if (ball === selected_ball || ball === hovered_ball) {
                    opacity = 1.0;
                }
                ctx.globalAlpha = opacity;

                ctx.beginPath();
                ctx.arc(ball.position.x, ball.position.y, ball.circleRadius, 0, 2*Math.PI);
                ctx.fillStyle = ball.render.fillStyle;
                ctx.fill();

                // 绘制球面文字
                const radius = ball.circleRadius;
                const text = ball.info.name;

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

        render.canvas.addEventListener('mousemove', (e: any) => {
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
        });
        render.canvas.addEventListener('click', (e: any) => {
            const position = {
                x: e.offsetX,
                y: e.offsetY,
            };
            const target = Query.point(balls, position);

            if (target.length <= 0) {
                selected_ball = null; 
                show.value = false;
                return;
            }
            if (target[0] === selected_ball) {
                selected_ball = null;
                show.value = false;
                return;
            }
            selected_ball = target[0];
            show.value = true;

            details.value = selected_ball.info.details;
            score.value = `${selected_ball.info.name}: ${selected_ball.info.score}'`;
        });
    }

</script>

<style>
    .all-enter-active,
    .all-leave-active {
        transition: all 0.3s ease-in;
    }

    .all-enter-from,
    .all-leave-to {
        opacity: 0;
    }
</style>