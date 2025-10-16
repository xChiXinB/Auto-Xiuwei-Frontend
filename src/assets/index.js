import { createApp } from "vue";
import App from "/App.vue";
import router from '../router';

createApp(App).use(router).mount("#app");

// 用户个性化
if (localStorage.getItem('style') == undefined) {
    localStorage.setItem('style', 'blue');
}