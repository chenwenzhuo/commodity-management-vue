import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        logged_usr: null//已登陆用户的相关数据
    },
    getters: {},
    mutations: {
        set_usr(state, value) {
            state.logged_usr = value;
        },
    },
    actions: {},
    modules: {}
})
