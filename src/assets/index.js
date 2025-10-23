import { createApp } from "vue";
import App from "/App.vue";
import router from '../router';
import { apply_color } from "../composables/settings/apply_color";

// 用户个性化
const style = localStorage.getItem('style');
if (style == undefined) {
    localStorage.setItem('style', 'blue');
    style = 'blue';
} else if (style === 'custom') {
    apply_color(localStorage.getItem('custom'));
}
document.body.className = style;

if (localStorage.getItem('order') == undefined) {
    localStorage.setItem('order', '1');
}

createApp(App).use(router).mount("#app");
