import { createApp } from "vue";
import App from "/App.vue";
import router from '../router';
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

createApp(App).use(router).mount("#app");
