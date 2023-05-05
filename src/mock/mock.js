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

//修改分类名称
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

//添加商品分类
Mock.mock(/manage\/category\/add/, options => {
    const reqData = JSON.parse(options.body);//获取post请求数据
    const newCateObj = {
        _id: nanoid(),
        name: reqData.categoryName,
        parentId: reqData.parentId
    };
    categories.push(newCateObj);
    return {status: 0};
});

//查询商品信息
let products = [
    {
        categoryId: categories[0]._id, pCategoryId: categories[3]._id, name: '美的风锦大1匹空调', price: 2899,
        desc: '美的风锦大1匹空调三级变频除湿抽湿冷暖两用自清洁卧室挂机ZJE', status: 1,//status，在售状态，1-在售，2-下架
        imgs: ['image-1669449503986.jpg', 'image-1669449509233.jpg', 'image-1669449512669.jpg'],
        detail: '<p>空调品牌：<strong>Midea/美的</strong> 美的空调型号：<strong><em>KFR-26GW/N8ZJE3 </em></strong>' +
            '空调功率：<span style="color:#f32784"><span style="background-color:#fdda00">大1匹</span></span></p>' +
            '<p>工作方式：<span style="font-size:18px">变频 </span>系列：<span style="font-size:30px">风锦 </span>' +
            '空调类型：<u>壁挂式</u></p><p>冷暖类型：冷暖电辅空调面板颜色：极地白适用面积：11㎡-17㎡</p><p>能效等级：三级内机堆码层数极限：' +
            '12层外机堆码层数极限：6层</p><p>内机尺寸：835x208x305mm外机包装尺寸：890x380x620mm外机尺寸：820x303x555mm</p>' +
            '<p>内机毛重：13kg内机包装尺寸：910x280x370mm智能类型：其他智能</p><p>制热功率：1070W制热量：3950W制冷量：2610W</p>' +
            '<p>室内机噪音：41dB制冷功率：645W上市时间：2021-01</p><p>电辅加热功率：1050W能效备案号：' +
            '202103-10-612300-70059712943064保修期：72个月</p><p>3C证书编号：2021010703374807</p>'
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[4]._id, name: '小天鹅洗衣机', price: 1999,
        desc: '小天鹅洗衣机10kg全自动家用变频滚筒洗脱一体机 TG100V196WIDY', status: 1,
        imgs: ['image-1669450510468.jpg', 'image-1669450513333.jpg'],
        detail: '<p><span style="color:#fdda00"><span style="background-color:#003ba5">洗衣机品牌：Littleswan/小天鹅型号：' +
            'TG100V196WIDY箱体材质：PCM钢板</span></span></p><p>产地：中国大陆工作方式：皮带驱动颜色分类：巴赫银</p><p>使用方式：' +
            '全自动洗衣程序：棉麻洗 筒自洁 单脱水 混合洗排水方式：上排水</p><p>能效等级：一级内桶材质：不锈钢显示屏类型：LED</p>' +
            '<p>附加功能：自动断电 中途添衣 断电记忆功能 童锁 高温洗 除螨 除菌控制方式：电子式产品类型：滚筒洗衣机</p><p>电机类型：' +
            'BLDC变频电机开合方式：前开式堆码层数极限：4层</p><p>毛重：70kg包装尺寸：700x705x985mm尺寸：595x530x850mm</p>' +
            '<p style="text-align:center;">净重：64kg宽度：595mm智能类型：其他智能</p><p>脱水功率：420W洗涤功率：70W洗涤公斤量：' +
            '10kg</p><p>上市时间：2022-06系列：洗衣机脱水公斤量：10kg</p><p>烘干公斤量：0kg最高转速：1200转/分钟深度：530mm</p>' +
            '<p>高度：850mm保修期：36个月<span style="color:#000000">3C证书编号：2018010705047832</span></p>'
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[3]._id, name: '美的风锦大1匹空调', price: 2899,
        desc: '美的风锦大1匹空调三级变频除湿抽湿冷暖两用自清洁卧室挂机ZJE', status: 1,//status，在售状态，1-在售，2-下架
        imgs: ['image-1669449503986.jpg', 'image-1669449509233.jpg', 'image-1669449512669.jpg']
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[4]._id, name: '小天鹅洗衣机', price: 1999,
        desc: '小天鹅洗衣机10kg全自动家用变频滚筒洗脱一体机 TG100V196WIDY', status: 2,
        imgs: ['image-1669450510468.jpg', 'image-1669450513333.jpg']
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[3]._id, name: '美的风锦大1匹空调', price: 2899,
        desc: '美的风锦大1匹空调三级变频除湿抽湿冷暖两用自清洁卧室挂机ZJE', status: 2,//status，在售状态，1-在售，2-下架
        imgs: ['image-1669449503986.jpg', 'image-1669449509233.jpg', 'image-1669449512669.jpg']
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[4]._id, name: '小天鹅洗衣机', price: 1999,
        desc: '小天鹅洗衣机10kg全自动家用变频滚筒洗脱一体机 TG100V196WIDY', status: 2,
        imgs: ['image-1669450510468.jpg', 'image-1669450513333.jpg']
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[3]._id, name: '美的风锦大1匹空调', price: 2899,
        desc: '美的风锦大1匹空调三级变频除湿抽湿冷暖两用自清洁卧室挂机ZJE', status: 1,//status，在售状态，1-在售，2-下架
        imgs: ['image-1669449503986.jpg', 'image-1669449509233.jpg', 'image-1669449512669.jpg']
    },
    {
        categoryId: categories[0]._id, pCategoryId: categories[4]._id, name: '小天鹅洗衣机', price: 1999,
        desc: '小天鹅洗衣机10kg全自动家用变频滚筒洗脱一体机 TG100V196WIDY', status: 1,
        imgs: ['image-1669450510468.jpg', 'image-1669450513333.jpg']
    }
];

Mock.mock(/manage\/product\/list/, options => {
    const reqData = getUrlParams(options.url);//获取get请求数据
    //检查参数是否有效
    if (!reqData.pageNum || reqData.pageNum <= 0
        || !reqData.pageSize || reqData.pageSize <= 0) {
        return {
            status: 1,
            msg: "请求参数不正确！"
        }
    }
    //参数有效，返回指定分页的数据
    let wantedProducts = products.slice((reqData.pageNum - 1) * reqData.pageSize, reqData.pageNum * reqData.pageSize);
    return {status: 0, data: wantedProducts};
});
