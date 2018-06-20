// pages/Collection/Collection.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    items: "",
    introduction: "",
    bookpage: 1,
    collbook:[],
    leng:0,
    isloading:false,
    nomore:false,
    newbooknum: 10,
  },

  LoadMore: function (event) {
    var that = this;
    if (that.data.newbooknum < 10) {
      that.setData({
        nomore: true,
      })
    }
    if (that.data.nomore || that.data.isloading)return
    that.setData({
      isloading:true,
    })
    console.log(event)
    var that = this;
    qcloud.request({
      url: config.service.favoritesUrl + '/' + this.data.bookpage +"/10",
      method: "GET",
      login:true,
      success: function (res) {
        util.codetest(res.data.code)
        if (res.data.code == 403) {
          that.setData({
            isloading: false,
            newbooknum: 0,
            leng: that.data.collbook.length,
          })
          return
        }
        console.log("收藏获取信息", res),
          that.setData({
            isloading:false,
            collbook: that.data.collbook.concat(res.data.info),
            newbooknum: res.data.info.length,
            bookpage: that.data.bookpage + 1,
          })
        that.setData({
          leng: that.data.collbook.length,
        })
        if (that.data.newbooknum < 10) {
          that.setData({
            nomore: true,
          })
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    if (that.data.newbooknum < 10) {
      that.setData({
        nomore: true,
      })
    }
    console.log(this.data.collbook)
  },

  /*pullUpLoad: function () {
    var that = this;
    LoadMore(that);
  },
  // 定位数据  
  scroll: function (event) {
    var that = this;
    that.setData({
      scrollTop: event.detail.scrollTop
    });
  }, */

  /**
   * 生命周期函数--监听页面加载
   */

  onPullDownRefresh: function () {
    //下拉刷新接口
    this.setData({
      bookpage: 1,
      collbook: [],
      isloading: false,
      leng: 0,
      nomore: false,
      newbooknum: 10,
    })
    this.LoadMore()
    wx.stopPullDownRefresh();
    
  },

  onLoad: function (options) {
    qcloud.Session.clear()
    if (!getApp().globalData.logged) { 
      wx.switchTab({
        url: '/pages/User/User',
      })
      wx.showModal({
        title: "提示",
        content: "请先登录",
        showCancel: false,
      })
      return
    }
    this.setData({
      bookpage: 1,
      collbook: [],
      isloading: false,
      leng: 0,
      nomore: false,
      newbooknum: 10,
    })
    this.LoadMore()
  },

  fresh: function () {
    var that = this;
    that.onLoad()
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
    //this.onLoad()
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
  /*onPullDownRefresh: function () {

  },*/

  /**
   * 页面上拉触底事件的处理函数
   */
  /*onReachBottom: function () {

  },*/

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})