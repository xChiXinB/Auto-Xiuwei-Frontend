import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "/App.vue";
import router from '../router';

import zh from "../i18n/zh.json";
import en from "../i18n/en.json";
import { apply_color } from "../composables/settings/apply_color";

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
    fallbackLocale: "en",
    legacy: false,
    messages: {
        zh,
        en,
    },
});

createApp(App)
   .use(router)
   .use(i18n)
   .mount("#app");
