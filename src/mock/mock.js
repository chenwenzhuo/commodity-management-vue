import Mock from 'mockjs';
import {nanoid} from "nanoid";

import vm from '../main';//引入当前应用的vue实例对象
import {getUrlParams} from '@/utils/tools';

Mock.setup({timeout: 1000});//1秒后产生响应
Mock.mock(/login/, options => {
    const reqData = JSON.parse(options.body);//获取post请求数据
    const existingUsers = vm.$store.state.UserModel.users;//当前已有的用户信息
    let loginSuccess = false;//登陆是否成功的标志位
    let userIndex = -1;
    //检查请求发送的用户数据是否存在
    existingUsers.forEach((item, index) => {
        if (item.username === reqData.username && item.password === reqData.password) {
            loginSuccess = true;
            userIndex = index;
        }
    });
    if (loginSuccess) {//登陆成功
        return {
            status: 0,
            data: existingUsers[userIndex],
        }
    }
    //登陆失败
    return {
        status: 1,
        msg: '登陆异常, 请稍后重试',
    };
});

Mock.mock(/logout/, options => {
    console.log('mock logout---------------', options);
});

//查询商品品类
let categories = [
    {_id: nanoid(), name: '大家电', parentId: '0'},
    {_id: nanoid(), name: '小家电', parentId: '0'},
    {_id: nanoid(), name: '调味品', parentId: '0'},
];
categories.push({_id: nanoid(), name: '空调', parentId: categories[0]._id});
categories.push({_id: nanoid(), name: '洗衣机', parentId: categories[0]._id});
categories.push({_id: nanoid(), name: '榨汁机', parentId: categories[1]._id});

Mock.mock(/manage\/category\/list/, options => {
    const reqData = getUrlParams(options.url);//获取get请求数据
    const wantedCategories = categories.filter(item => item.parentId === reqData.parentId);
    return {
        status: 0,
        data: wantedCategories
    }
});

//修改商品名称
Mock.mock(/manage\/category\/update/, options => {
    const reqData = JSON.parse(options.body);//获取post请求数据
    categories.forEach(item => {
        if (item._id === reqData.categoryId) {
            item.name = reqData.categoryName;
        }
    });
    return {status: 0};
});

//删除商品分类
Mock.mock(/manage\/category\/delete/, options => {
    const reqData = JSON.parse(options.body);//获取post请求数据
    categories = categories.filter(item => item._id !== reqData.categoryId);
    return {status: 0};
});
