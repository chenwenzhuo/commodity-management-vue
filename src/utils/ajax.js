import Vue from "vue";
import axios from "axios";

export default function (url, data = {}, method = 'GET') {
    const URL_PREFIX = '/ajaxPrefix';
    return new Promise((resolve) => {
        let promise;
        //根据method参数，向后端发送GET/POST请求
        if (method === 'GET') {
            promise = axios.get('http://localhost:8848' + URL_PREFIX + url, {params: data});
        } else if (method === 'POST') {
            promise = axios.post('http://localhost:8848' + URL_PREFIX + url, data);
        } else {
            Vue.prototype.$message.error("请求参数错误！");
            return;
        }
        //若请求成功（与后端通信成功），将promise置为成功状态，否则置为失败状态
        promise.then(response => {
            resolve(response.data);
        }).catch(error => {//请求失败时，弹窗提示
            console.log('----------------------请求出错----------------------');
            console.log(error);
            Vue.prototype.$message.error('请求出错！' + error.message);
        });
    });
}
