import Matter from 'matter-js';
import { calculate_radii } from './calculate_radii.js';
import { t2ts } from './transactions2total_score.ts';
import { BallInformation, IBTransactions, UserId2TotalScore, Users } from './interface.ts';

export interface MatterCanvasConfig {
    canvas: HTMLCanvasElement;
    transactions: IBTransactions;
    users: Users;
    minRadius: number;
    areaPercentage: number;
    onSelectionChange: (userId: number | null) => void;
}

export class MatterCanvasManager {
    private canvas: HTMLCanvasElement;
    private transactions: IBTransactions;
    private users: Users;
    private minRadius: number;
    private areaPercentage: number;
    private onSelectionChange: (userId: number | null) => void;

    private engine: Matter.Engine | null = null;
    private render: Matter.Render | null = null;
    private runner: Matter.Runner | null = null;
    private balls: Matter.Body[] = [];
    private ballInfo: BallInformation[] = [];

    private hoveredBall: Matter.Body | null = null;
    private selectedBall: Matter.Body | null = null;
    private mouseInCanvas: boolean = false;
    private mousemoveTimeout?: number;

    private canvasWidth: number = 0;
    private canvasHeight: number = 0;

    constructor(config: MatterCanvasConfig) {
        this.canvas = config.canvas;
        this.transactions = config.transactions;
        this.users = config.users;
        this.minRadius = config.minRadius;
        this.areaPercentage = config.areaPercentage;
        this.onSelectionChange = config.onSelectionChange;
    }

    start(): MatterCanvasManager {
        this.calculateCanvasSize();
        this.createPhysicsEngine();
        this.createBalls();
        this.createWalls();
        this.setupRendering();
        this.setupEventListeners();

        return this;
    }

    private calculateCanvasSize(): void {
        if (window.innerWidth >= 768) {
            this.canvasWidth = this.canvas.clientWidth;
        } else {
            const w_canvas = this.canvas.clientWidth;
            const w_should = document.body.clientWidth * 0.9;
            this.canvasWidth = (Math.abs(w_canvas - w_should) < 5) ? w_canvas : w_should;
        }
        this.canvasHeight = this.canvas.clientHeight;
    }

    private createPhysicsEngine(): void {
        const { Engine, Render, Runner } = Matter;
        const CSSStyleDecoration = window.getComputedStyle(document.body);

        this.engine = Engine.create();
        this.render = Render.create({
            engine: this.engine,
            canvas: this.canvas,
            options: {
                width: this.canvasWidth,
                height: this.canvasHeight,
                wireframes: false,
                background: CSSStyleDecoration.getPropertyValue('--big-bg'),
            }
        });
        Render.run(this.render);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);
    }

    private createBalls(): void {
        const { Bodies } = Matter;
        const CSSStyleDecoration = window.getComputedStyle(document.body);

        const user_id2total_score: UserId2TotalScore = {};
        for (const user_id in this.transactions) {
            user_id2total_score[user_id] = t2ts(this.transactions[user_id]);
        }

        const user_ids = Object.keys(user_id2total_score).map(id => Number(id));
        const total_scores = Object.values(user_id2total_score);
        const radii = calculate_radii(
            total_scores,
            this.minRadius,
            this.canvasWidth * this.canvasHeight * this.areaPercentage,
            0.8
        );

        this.balls = [];
        this.ballInfo = [];
        user_ids.forEach((id) => {
            this.balls.push(Bodies.circle(
                this.canvasWidth / 2,
                this.canvasHeight / 2,
                radii[id],
                {
                    restitution: 0.5,
                    render: {
                        fillStyle: CSSStyleDecoration.getPropertyValue('--color-300'),
                        strokeStyle: CSSStyleDecoration.getPropertyValue('--color-400'),
                        lineWidth: 10,
                    },
                }
            ));
            this.ballInfo.push({
                user_id: +id,
                name: this.users[id],
                total_score: total_scores[id].toFixed(2),
            });
        });
    }

    private createWalls(): void {
        if (!this.engine) return;

        const { Bodies, World } = Matter;
        const CSSStyleDecoration = window.getComputedStyle(document.body);
        const border_color = CSSStyleDecoration.getPropertyValue('--color-500');

        const ceiling = Bodies.rectangle(
            this.canvasWidth / 2, 0, this.canvasWidth, 20,
            { isStatic: true, render: { fillStyle: border_color } }
        );
        const ground = Bodies.rectangle(
            this.canvasWidth / 2, this.canvasHeight, this.canvasWidth, 20,
            { isStatic: true, render: { fillStyle: border_color } }
        );
        const left_wall = Bodies.rectangle(
            0, this.canvasHeight / 2, 20, this.canvasHeight,
            { isStatic: true, render: { fillStyle: border_color } }
        );
        const right_wall = Bodies.rectangle(
            this.canvasWidth, this.canvasHeight / 2, 20, this.canvasHeight,
            { isStatic: true, render: { fillStyle: border_color } }
        );

        World.add(this.engine.world, [...this.balls, ground, left_wall, right_wall, ceiling]);
    }

    private setupRendering(): void {
        if (!this.render) return;

        const { Events } = Matter;
        Events.on(this.render, 'afterRender', () => {
            if (!this.render) return;
            const ctx = this.render.context;
            this.balls.forEach((ball, index) => {
                ctx.save();
                let opacity = 0.3;
                if (this.selectedBall === null && this.hoveredBall == null) {
                    opacity = 1.0;
                } else if (ball === this.selectedBall || ball === this.hoveredBall) {
                    opacity = 1.0;
                }
                ctx.globalAlpha = opacity;

                ctx.beginPath();
                ctx.arc(ball.position.x, ball.position.y, (ball.circleRadius || 0), 0, 2 * Math.PI);
                ctx.fillStyle = ball.render.fillStyle || '';
                ctx.fill();

                const radius = ball.circleRadius || 0;
                const text = this.ballInfo[index].name;

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
    }

    private setupEventListeners(): void {
        const { Query } = Matter;

        this.canvas.addEventListener('mouseenter', () => {
            this.mouseInCanvas = true;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseInCanvas = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            clearTimeout(this.mousemoveTimeout);
            const position = { x: e.offsetX, y: e.offsetY };
            const target = Query.point(this.balls, position);

            if (target.length <= 0) {
                this.hoveredBall = null;
                return;
            }
            this.hoveredBall = target[0];

            this.mousemoveTimeout = window.setTimeout(() => {
                if (this.mouseInCanvas) return;
                this.hoveredBall = null;
            }, 200);
        });

        this.canvas.addEventListener('click', (e) => {
            const position = { x: e.offsetX, y: e.offsetY };
            const target = Query.point(this.balls, position);

            if (target.length <= 0) {
                this.selectedBall = null;
                this.onSelectionChange(null);
                return;
            }
            if (target[0] === this.selectedBall) {
                this.selectedBall = null;
                this.onSelectionChange(null);
                return;
            }
            this.selectedBall = target[0];
            const userId = this.ballInfo[this.balls.indexOf(this.selectedBall)].user_id;
            this.onSelectionChange(userId);
        });
    }

    destroy(): void {
        if (this.render) {
            Matter.Render.stop(this.render);
            this.render.textures = {};
        }
        if (this.runner && this.engine) {
            Matter.Runner.stop(this.runner);
        }
        if (this.engine) {
            Matter.Engine.clear(this.engine);
        }
        clearTimeout(this.mousemoveTimeout);

        this.engine = null;
        this.render = null;
        this.runner = null;
        this.balls = [];
        this.ballInfo = [];
        this.hoveredBall = null;
        this.selectedBall = null;
    }
}
