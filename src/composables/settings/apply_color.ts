import { remove_css_var, set_css_var } from './css_var_config';
import { make_colors } from './make_colors';

/**
 * 应用一个自定义颜色
 * @param color 主色
 */
function apply_color(color: string): void {
    const colors = make_colors(color);
    set_css_var({
        '--big-bg': colors['big-bg'],
        '--color-200': colors['primary'][0],
        '--color-300': colors['primary'][1],
        '--color-400': colors['primary'][2],
        '--color-500': colors['primary'][3],
        '--color-600': colors['primary'][4],
        '--secondary-color-200': colors['secondary'][0],
        '--secondary-color-300': colors['secondary'][1],
        '--secondary-color-400': colors['secondary'][2],
        '--secondary-color-500': colors['secondary'][3],
        '--secondary-color-600': colors['secondary'][4],
    });
}

/**
 * 移除所有自定义颜色
 */
function remove_all_color(): void {
    remove_css_var([
        '--big-bg',
        '--color-200',
        '--color-300',
        '--color-400',
        '--color-500',
        '--color-600',
        '--secondary-color-200',
        '--secondary-color-300',
        '--secondary-color-400',
        '--secondary-color-500',
        '--secondary-color-600',
    ]);
}

export { apply_color, remove_all_color };
