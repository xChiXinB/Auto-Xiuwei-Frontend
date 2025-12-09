import chroma from 'chroma-js';

interface Res {
    'big-bg': string;
    primary: string[];
    secondary: string[];
}

/**
 * 计算一系列颜色变化量
 * @param color 初始颜色（十六进制字符串）
 * @returns 生成的颜色
 */

function make_colors(color: string): Res {
    const res: Res = {
        'big-bg': '', // 饱和度极低，作为背景色
        primary: [], // 主色调，与初始颜色的颜色一致，但有饱和度变化
        secondary: [], // 辅助色调，与初始颜色互补，且有饱和度变化
    };
    const scale = chroma.scale(['white', color, 'black']);
    const comp_scale = chroma.scale([
        'white',
        chroma(color).set('hsl.h', '+180'),
        'black',
    ]);
    res['big-bg'] = scale(0.05).hex();
    res['primary'] = scale.colors(10).slice(1, 6); // 去掉纯白和很黑的部分
    res['secondary'] = comp_scale.colors(10).slice(1, 6);

    return res;
}

export { make_colors };
