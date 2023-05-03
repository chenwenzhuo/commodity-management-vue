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

export const getUrlParams = url => {
    const flagIndex = url.indexOf('?');
    if (flagIndex < 0) {
        return {};//url中不包含问号，直接返回空对象
    }
    const paramsObj = {};
    let params = url.substring(flagIndex + 1).split('&');
    for (const p in params) {
        const curParam = params[p].split('=');
        paramsObj[curParam[0]] = curParam[1];
    }
    return paramsObj;
}
