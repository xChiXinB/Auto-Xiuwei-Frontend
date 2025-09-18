import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LuckyDraw from "../views/LuckyDraw.vue"

const routes = [
    { path: '/', component: Home },
    { path: '/lucky-draw', component: LuckyDraw},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;