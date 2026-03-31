import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from '/App.vue';
import router from '../router';

import zh from '../i18n/zh.json';
import en from '../i18n/en.json';
import { apply_color } from '../composables/settings/apply_color';

// 用户个性化
let style = localStorage.getItem('style');
if (style == null) {
    localStorage.setItem('style', 'blue');
    style = 'blue';
} else if (style === 'custom') {
    apply_color(localStorage.getItem('custom'));
}
document.body.className = style;

if (localStorage.getItem('order') == null) {
    localStorage.setItem('order', '1');
}

if (localStorage.getItem('class') == null) {
    localStorage.setItem('class', '0');
}

if (localStorage.getItem('is0Shown') == null) {
    localStorage.setItem('is0Shown', 't');
}

if (localStorage.getItem('lang') == null) {
    localStorage.setItem('lang', 'zh');
}

if (localStorage.getItem('highlightTopN') == null) {
    localStorage.setItem('highlightTopN', '3');
}

const i18n = createI18n({
    locale: localStorage.getItem('lang') || 'zh',
    fallbackLocale: 'en',
    legacy: false,
    messages: {
        zh,
        en,
    },
});

// 愚人节搞怪效果：利用 MutationObserver 动态给所有 div 添加随机位移和旋转
const applyFoolEffect = (el) => {
    if (el.tagName && el.tagName.toLowerCase() === 'div') {
        const rotate = (Math.random() - 0.5) * 4; // -2 到 2 度
        const translateX = (Math.random() - 0.5) * 4; // -2 到 2 px
        const translateY = (Math.random() - 0.5) * 4;
        el.style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;
        el.style.transition = 'transform 0.3s ease-in-out';
    }
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                applyFoolEffect(node);
                node.querySelectorAll('div').forEach(applyFoolEffect);
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// 对现有可能已经存在的 div 应用
setTimeout(() => {
    document.querySelectorAll('div').forEach(applyFoolEffect);
}, 100);

createApp(App).use(router).use(i18n).mount('#app');
