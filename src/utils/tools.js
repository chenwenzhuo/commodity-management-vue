export const formatTime = milliseconds => {
    const d = new Date(milliseconds);
    let month = d.getMonth() + 1;
    month = month >= 10 ? month : ('0' + month);//单位数月份前补0
    let day = d.getDate();
    day = day >= 10 ? day : ('0' + day);//单位数日期前补0
    let hour = d.getHours();
    hour = hour >= 10 ? hour : ('0' + hour);//单位数小时前补0
    let minute = d.getMinutes();
    minute = minute >= 10 ? minute : ('0' + minute);//单位数分钟前补0
    let second = d.getSeconds();
    second = second >= 10 ? second : ('0' + second);//单位数秒钟前补0

    return d.getFullYear() + '-' + month + '-' + day + ' ' +
        hour + '-' + minute + '-' + second;
}

//获取get请求URL中的参数
export const getUrlParams = url => {
    const flagIndex = url.indexOf('?');
    if (flagIndex < 0) {
        return {};//url中不包含问号，直接返回空对象
    }
    const paramsObj = {};
    let params = url.substring(flagIndex + 1).split('&');
    for (const p in params) {
        const curParam = params[p].split('=');
        paramsObj[curParam[0]] = decodeURIComponent(curParam[1]);
    }
    return paramsObj;
}

//得到指定数组的分页信息对象
export function pageFilter(arr, pageNum, pageSize) {
    //将字符串形式的参数转为数字
    pageNum = pageNum * 1;
    pageSize = pageSize * 1;
    //获取分页数据
    const total = arr.length;
    const pages = Math.floor((total + pageSize - 1) / pageSize); //向下取整
    const start = pageSize * (pageNum - 1)
    const end = (start + pageSize) <= total ? start + pageSize : total;
    const list = [];
    for (var i = start; i < end; i++) {
        list.push(arr[i]);
    }
    return {pageNum, pageSize, total, pages, list}
}
