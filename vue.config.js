const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/ajaxPrefix': {//匹配到 /ajaxPrefix 前缀的请求，则进行拦截转发
                target: 'http://localhost:5001',//代理目标地址
                /*pathRewrite属性名为正则表达式，请求URL中匹配的部分将被替换为属性值*/
                pathRewrite: {
                    /*URL中 /ajaxPrefix 前缀是为解决跨域额外添加的，将其替换为空字符串*/
                    '^/ajaxPrefix': ''
                },
                /*用于控制请求头中的host值。为true时，将host值替换为target属性值，为false时不进行替换*/
                changeOrigin: true,
            }
        },
        port: 8848//修改项目部署端口
    }
})
