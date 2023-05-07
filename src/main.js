import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/reset.css';
import './plugins/element';//引入element-ui所需组件
//import './mock/mock';//引入mock，拦截请求并返回假数据

Vue.config.productionTip = false

export default new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
