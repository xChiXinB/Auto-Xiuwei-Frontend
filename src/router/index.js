import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LuckyDraw from '../views/LuckyDraw.vue';
import Individuals from '../views/Individuals.vue';
import Settings from '../views/Settings.vue';
import Rank from '../views/Rank.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/lucky-draw', component: LuckyDraw },
    { path: '/individuals', component: Individuals },
    { path: '/settings', component: Settings },
    { path: '/rank', component: Rank },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
