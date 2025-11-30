import Matter from 'matter-js';
import { calculate_radii } from './calculate_radii';
import { t2ts } from './transactions2total_score';
import { BallInformation, IBTransactions, UserId2TotalScore, Users } from './interface';

interface MatterCanvasConfig {
    transactions: IBTransactions;
    users: Users;
    min_r: number;
    area_percentage: number;
}

/**
 * 创建 Matter.js 物理引擎及其渲染器和运行器
 */
function createEngine(canvas: HTMLCanvasElement, w: number, h: number) {
    const { Engine, Render, Runner } = Matter;
    const CSSStyleDecoration = window.getComputedStyle(document.body);
    
    const engine = Engine.create();
    const render = Render.create({
        engine: engine,
        canvas: canvas,
        options: {
            width: w,
            height: h,
            wireframes: false,
            background: CSSStyleDecoration.getPropertyValue('--big-bg'),
        }
    });
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    
    return { engine, render, runner, CSSStyleDecoration };
}

/**
 * 根据用户交易数据创建球体及其信息
 */
function createBalls(
    config: MatterCanvasConfig,
    w: number,
    h: number,
    CSSStyleDecoration: CSSStyleDeclaration
) {
    const { Bodies } = Matter;
    const { transactions, users, min_r, area_percentage } = config;
    
    const user_id2total_score: UserId2TotalScore = {};
    for (const user_id in transactions) {
        user_id2total_score[user_id] = t2ts(transactions[user_id]);
    }
    
    const user_ids = Object.keys(user_id2total_score).map(id => Number(id));
    const total_scores = Object.values(user_id2total_score);
    const radii = calculate_radii(total_scores, min_r, w * h * area_percentage, 0.8);
    
    const balls: Matter.Body[] = [];
    const ball_info: BallInformation[] = [];
    
    user_ids.forEach((id) => {
        balls.push(Bodies.circle(
            w / 2, h / 2, radii[id],
            {
                restitution: 0.5,
                render: {
                    fillStyle: CSSStyleDecoration.getPropertyValue('--color-300'),
                    strokeStyle: CSSStyleDecoration.getPropertyValue('--color-400'),
                    lineWidth: 10,
                },
            }
        ));
        ball_info.push({
            user_id: +id,
            name: users[id],
            total_score: total_scores[id].toFixed(2),
        });
    });
    
    return { balls, ball_info };
}

/**
 * 创建画布的四周边界墙
 */
function createBoundaries(w: number, h: number, border_color: string) {
    const { Bodies } = Matter;
    
    const ceiling = Bodies.rectangle(
        w / 2, 0, w, 20, {
            isStatic: true,
            render: {
                fillStyle: border_color,
            }
        }
    );
    const ground = Bodies.rectangle(
        w / 2, h, w, 20, {
            isStatic: true,
            render: {
                fillStyle: border_color,
            }
        }
    );
    const left_wall = Bodies.rectangle(
        0, h / 2, 20, h, {
            isStatic: true,
            render: {
                fillStyle: border_color,
            }
        }
    );
    const right_wall = Bodies.rectangle(
        w, h / 2, 20, h, {
            isStatic: true,
            render: {
                fillStyle: border_color,
            }
        }
    );
    
    return [ground, left_wall, right_wall, ceiling];
}

/**
 * 设置渲染逻辑：绘制球体高亮效果和文字
 */
function setupRendering(
    render: Matter.Render,
    balls: Matter.Body[],
    ball_info: BallInformation[],
    getHoveredBall: () => Matter.Body | null,
    getSelectedBall: () => Matter.Body | null
) {
    const { Events } = Matter;
    
    Events.on(render, 'afterRender', () => {
        const ctx = render.context;
        const hovered_ball = getHoveredBall();
        const selected_ball = getSelectedBall();
        
        balls.forEach((ball, index) => {
            ctx.save();
            
            let opacity = 0.3;
            if (selected_ball === null && hovered_ball == null) {
                opacity = 1.0;
            } else if (ball === selected_ball || ball === hovered_ball) {
                opacity = 1.0;
            }
            ctx.globalAlpha = opacity;
            
            ctx.beginPath();
            ctx.arc(ball.position.x, ball.position.y, (ball.circleRadius || 0), 0, 2 * Math.PI);
            ctx.fillStyle = ball.render.fillStyle || '';
            ctx.fill();
            
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
}

/**
 * 设置鼠标交互事件：hover 和 click
 */
function setupInteractions(
    canvas: HTMLCanvasElement,
    balls: Matter.Body[],
    ball_info: BallInformation[],
    onSelectionChange: (user_id: number | null) => void
) {
    const { Query } = Matter;
    
    let hovered_ball: Matter.Body | null = null;
    let selected_ball: Matter.Body | null = null;
    let mousemove_event_deactivate: number | undefined;
    let mouse_in_canvas = false;
    
    canvas.addEventListener('mouseenter', () => {
        mouse_in_canvas = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse_in_canvas = false;
    });
    
    canvas.addEventListener('mousemove', (e) => {
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
    
    canvas.addEventListener('click', (e) => {
        const position = {
            x: e.offsetX,
            y: e.offsetY,
        };
        const target = Query.point(balls, position);
        
        if (target.length <= 0) {
            selected_ball = null;
            onSelectionChange(null);
            return;
        }
        if (target[0] === selected_ball) {
            selected_ball = null;
            onSelectionChange(null);
            return;
        }
        selected_ball = target[0];
        
        const user_id = ball_info[balls.indexOf(selected_ball)].user_id;
        onSelectionChange(user_id);
    });
    
    return {
        getHoveredBall: () => hovered_ball,
        getSelectedBall: () => selected_ball,
    };
}

/**
 * 初始化 Matter.js 画布：创建物理世界、球体和交互逻辑
 */
export function initMatterCanvas(
    canvas: HTMLCanvasElement,
    config: MatterCanvasConfig,
    onSelectionChange: (user_id: number | null) => void
) {
    console.log('Initializing Matter.js canvas...');
    const { World } = Matter;
    
    let w: number, h: number;
    
    if (window.innerWidth >= 768) {
        w = canvas.clientWidth;
    } else {
        const w_canvas = canvas.clientWidth;
        const w_should = document.body.clientWidth * 0.9;
        w = (Math.abs(w_canvas - w_should) < 5) ? w_canvas : w_should;
    }
    h = canvas.clientHeight;
    
    const { engine, render, CSSStyleDecoration } = createEngine(canvas, w, h);
    const { balls, ball_info } = createBalls(config, w, h, CSSStyleDecoration);
    const border_color = CSSStyleDecoration.getPropertyValue('--color-500');
    const boundaries = createBoundaries(w, h, border_color);
    
    World.add(engine.world, [...balls, ...boundaries]);
    
    const { getHoveredBall, getSelectedBall } = setupInteractions(
        canvas,
        balls,
        ball_info,
        onSelectionChange
    );
    
    setupRendering(render, balls, ball_info, getHoveredBall, getSelectedBall);
}
