import Vue from 'vue'
import Vuex from 'vuex'
//vuex-persistedstate用于vuex中数据持久化存储
import createPersistedState from 'vuex-persistedstate'

import UserModel from './UserModel';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        logged_usr: null,//已登陆用户的相关数据
        time: Date.now(),//系统当前时间
        active_menu: '首页',//当前激活的菜单名称，默认激活首页
    },
    getters: {},
    mutations: {
        save_usr(state, value) {
            state.logged_usr = value;
        },
        clear_usr(state) {
            state.logged_usr = null;
        },
        update_time(state, value) {
            state.time = value;
        },
        set_active_menu(state, value) {
            state.active_menu = value;
        }
    },
    actions: {},
    modules: {
        UserModel
    },
    //应用插件
    plugins: [createPersistedState({
        storage: window.sessionStorage,//存储到session storage
        reducer(state) {
            return {//仅持久化logged_usr
                logged_usr: state.logged_usr
            }
        }
    })]
})
