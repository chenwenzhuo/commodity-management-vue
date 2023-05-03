import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

import Login from "@/views/Login";
import HomePage from "@/views/HomePage";
import Category from "@/views/Category";

Vue.use(VueRouter)

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
}

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter(to, from, next) {
            //进入登陆页前检查，若已有登陆成功的用户，跳转到主页
            if (store.state.logged_usr) {
                next('/');
                return;
            }
            next();
        },
    },
    {
        path: '/',
        name: 'home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Home'),
        beforeEnter(to, from, next) {
            //进入主页前检查，若还未登陆，跳转到登陆页
            if (!store.state.logged_usr) {
                next('/login');
                return;
            }
            next();
        },
        children: [
            {path: 'home', component: HomePage},
            {path: 'category', component: Category},
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
