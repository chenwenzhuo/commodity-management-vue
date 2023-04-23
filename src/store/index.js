import Vue from 'vue'
import Vuex from 'vuex'

import UserModel from './UserModel';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        logged_usr: null//已登陆用户的相关数据
    },
    getters: {},
    mutations: {
        save_usr(state, value) {
            state.logged_usr = value;
        },
    },
    actions: {},
    modules: {
        UserModel
    }
})
