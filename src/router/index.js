import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LuckyDraw from "../views/LuckyDraw.vue";
import Individuals from "../views/Individuals.vue";
import Settings from "../views/Settings.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/lucky-draw', component: LuckyDraw},
    { path: '/individuals', component: Individuals},
    { path: '/settings', component: Settings },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;