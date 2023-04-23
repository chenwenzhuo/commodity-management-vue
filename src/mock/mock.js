import Mock from 'mockjs';
import vm from '../main';//引入当前应用的vue实例对象

Mock.setup({timeout: 1000});//1秒后产生响应
Mock.mock(/login/, options => {
    const reqData = JSON.parse(options.body);//获取请求数据
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
