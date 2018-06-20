// pages/Address/Address.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    address: "",
    addressprovince:"",
    addresscity:"",
    tel: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  showTopTips:function(){

  },

  onLoad: function (options) {
    var that = this
    //qcloud.Session.clear()
    qcloud.request(
      {
        url: config.service.infoUrl,
        method: "GET",
        login:true,
        success: function (res) {
          console.log(res)
          that.setData({
            userName: res.data.info.name,
            address: res.data.info.address,
            addresscity: res.data.info.addresscity,
            addressprovince: res.data.info.addressprovince,
            tel: res.data.info.tel,
            code: res.data.code
          }),
          console.log(that.data.address)
            util.codetest(res.data.code)
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      }
    )
  },

  addressinput:function(e){
    var that = this
    that.setData({
      address: e.detail.value
    })
  },

  addressprovinceinput: function (e) {
    var that = this
    that.setData({
      addressprovince: e.detail.value
    })
  },

  addresscityinput: function (e) {
    var that = this
    that.setData({
      addresscity: e.detail.value
    })
  },

  nameinput: function (e) {
    var that = this
    that.setData({
      userName: e.detail.value
    })
  }, 

  telinput: function (e) {
    var that = this
    that.setData({
      tel: e.detail.value
    })
  },

  EditClick:function(){
    //this.showTopTips()
    var that = this
    console.log(that.data);
    util.showBusy('正在保存')
    qcloud.request(
      {
        url: config.service.infoUrl,
        method: "POST",
        login: true,
        data:{
          "addressprovince": that.data.addressprovince,
          "addresscity": that.data.addresscity,
          "address": that.data.address,
          "name": that.data.userName,
          "tel": that.data.tel,
        },
        header:{
          "Content-Type": "application/x-www-form-urlencoded"  
        },
        success: function (res) {
          console.log(res)
          util.showSuccess("编辑成功")
          that.onLoad()
          wx.switchTab({
            url: '/pages/User/User',
          })
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
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
  /*onReachBottom: function () {

  },*/

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})