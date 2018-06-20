// pages/HistoryOrder/HistoryOrder.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var orderid = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showorder: [],
    isloading: false,
    nomore: false,
    newordernum: 5,
    orderpage: 1,
  },

  onClickListener: function (event) {
    
  },

  LoadMore: function (event) {
    var that = this;
    if (that.data.newbooknum < 5) {
      that.setData({
        nomore: true,
      })
    }
    if (that.data.nomore || that.data.isloading) return
    that.setData({
      isloading: true,
    })
      qcloud.request({
        url: config.service.ordersUrl + '/' + this.data.orderpage +'/5/true',
        method: "GET",
        login: true,
        success: function (temp) {
          console.log("订单获取信息", temp);
          that.setData({
            showorder: that.data.showorder.concat(temp.data.info),
            isloading: false,
            orderpage: that.data.orderpage + 1,
            newordernum: temp.data.info.length,
          }),
            util.codetest(temp.data.code)
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    if (that.data.newordernum < 5) {
      that.setData({
        nomore: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //qcloud.Session.clear()
    this.LoadMore();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    qcloud.Session.clear()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})