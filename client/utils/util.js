const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

const codetest = function codetest(number){
  switch(number){
    case 400: wx.showModal({ content: "用户名或者密码为空" + number, title: "提示", showCancel: false, }); break;
    case 401: wx.showModal({ content: "用户名或者密码错误" + number, title: "提示", showCancel: false, }); break;
    case 402: wx.showModal({ content: "请求越界" + number, title: "提示", showCancel: false, }); break;
    case 403: wx.showModal({ content: "登录失效" + number, title: "提示", showCancel: false, }); break;
    case 404: wx.showModal({ content: "请求越界" + number, title: "提示", showCancel: false, }); break;
    case 405: wx.showModal({ content: "资源失效" + number, title: "提示", showCancel: false, }); break;
    case 406: wx.showModal({ content: "无效访问" + number, title: "提示", showCancel: false, }); break;
    case 407: wx.showModal({ content: "上传文件过大" + number, title: "提示", showCancel: false, }); break;
    case 408: wx.showModal({ content: "上传中断或者没有选择文件" + number, title: "提示", showCancel: false, }); break;
    case 409: wx.showModal({ content: "文件已经存在" + number, title: "提示", showCancel: false, }); break;
    case 410: wx.showModal({ content: "添加联系失败" + number, title: "提示", showCancel: false, }); break;
    case 411: wx.showModal({ content: "信息不全" + number, title: "提示", showCancel: false, }); break;
    case 412: wx.showModal({ content: "数据已经存在" + number, title: "提示", showCancel: false, }); break;
    case 413: wx.showModal({ content: "权限不足" + number, title: "提示", showCancel: false, }); break;
    case 414: wx.showModal({ content: "删除对象不存在" + number, title: "提示", showCancel: false, }); break;
    case 415: wx.showModal({ content: "登陆超时" + number, title: "提示", showCancel: false, }); break;
    case 416: wx.showModal({ content: "下单失败" + number, title: "提示", showCancel: false, }); break;
    case 418: wx.showModal({ content: "添加失败" + number, title: "提示", showCancel: false, }); break;
    case 420: wx.showModal({ content: "参数过长" + number, title: "提示", showCancel: false, }); break;
    case 421: wx.showModal({ content: "参数非法" + number, title: "提示", showCancel: false, }); break;
    case 422: wx.showModal({ content: "底价为负" + number, title: "提示", showCancel: false, }); break;
    case 423: wx.showModal({ content: "库存不足" + number, title: "提示", showCancel: false, }); break;
    case 424: wx.showModal({ content: "重复砍价" + number, title: "提示", showCancel: false, }); break;
    case 425: wx.showModal({ content: "活动图书不存在" + number, title: "提示", showCancel: false, }); break;
    case 426: wx.showModal({ content: "不在活动时间内" + number, title: "提示", showCancel: false, }); break;
    case 427: wx.showModal({ content: "活动已经参加" + number, title: "提示", showCancel: false, }); break;
    case 428: wx.showModal({ content: "订单非法" + number, title: "提示", showCancel: false, }); break;
    case 429: wx.showModal({ content: "完成订单失败" + number, title: "提示", showCancel: false, }); break;
    case 435: wx.showModal({ content: "活动不存在" + number, title: "提示", showCancel: false, }); break;
    case 436: wx.showModal({ content: "轮盘数量过多" + number, title: "提示", showCancel: false, }); break;
    case 437: wx.showModal({ content: "时间非法" + number, title: "提示", showCancel: false, }); break;
    case 438: wx.showModal({ content: "地址为空" + number, title: "提示", showCancel: false, }); break;
    case 439: wx.showModal({ content: "轮播图过多" + number, title: "提示", showCancel: false, }); break;
    case 440: wx.showModal({ content: "积分不足" + number, title: "提示", showCancel: false, }); break;
    case 441: wx.showModal({ content: "已点过赞" + number, title: "提示", showCancel: false, }); break;
    case 500: wx.showModal({ content: "服务器错误" + number, title: "提示", showCancel: false, }); break;
    default:break;
  }
}

module.exports = { formatTime, showBusy, showSuccess, showModel, codetest: codetest }
