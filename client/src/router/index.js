import { createRouter, createWebHistory } from 'vue-router';
import Telegram from '@/pages/Telegram.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import store from '../store';

const routes = [
    {
        path: '/',
        component: Telegram,
        name: 'home',
        beforeEnter: (_, __, next) => {
            if(!store.getters.isLoggedIn){
                next('/login')
            }else if(!store.getters.user.registered){
                next('/register')
            }else{
                next()
            }
        }
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
    },
    {
        path: '/register',
        component: Register,
        name: 'regsiter',
        beforeEnter: (_, __, next) => {
            if(!store.getters.isLoggedIn){
                next('/login')
            }else if(store.getters.user.registered){
                next('/')
            }else{
                next()
            }
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// router.beforeEach((to, from, next) => {
//     if(to.matched.some(record => record.meta.requiresAuth)){
//         if(!store.getters.isLoggedIn){
//             next('/login');
//         }else{
//             next();
//         }
//     }else if(to.matched.some(record => record.meta.requiresGuest)){
//         if(store.getters.isLoggedIn){
//             next('/');
//         }else{
//             next();
//         }
//     }
// });

export default router