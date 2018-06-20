// pages/Home/Home.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagenum: [],
    showFormList:false,
    nomore:false,
    actpage:1,
    isloading: false,
    newactnum:5,
    formact:[],
    goact:[],

    image:"/images/cover1.png",
    length:0,
    imleng:0,
  },

  LoadMore: function (event) {
    var that = this;
    if (that.data.newactnum < 5) {
      that.setData({
        nomore: true,
      })
    }
    if (!that.data.showFormList)return
    if (that.data.nomore || that.data.isloading) return
    that.setData({
      isloading: true,
    })
    wx.request({
      url: config.service.activitiesStoppedUrl + "/" + that.data.actpage +"/5",
      method: "GET",
      success: function (temp) {
        console.log(config.service.activitiesStoppedUrl+"/" + that.data.actpage + "/5")
        util.codetest(temp.data.code)
        console.log(temp);
        that.setData({
          formact: that.data.formact.concat(temp.data.info),
          //前端测试接口
          //formact: that.data.formact.concat(that.data.testact),
          isloading: false,
          actpage: that.data.actpage + 1,
          newactnum: temp.data.info.length,
        })
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    if (that.data.newactnum < 5) {
      that.setData({
        nomore: true,
      })
    }
  },

  showList: function () {
    var that = this;
    if (that.data.showFormList) {
      that.setData({
        showFormList: false,
        /*nomore: false,
        actpage: 1,
        isloading: false,
        newactnum: 0,*/
      })
    } else {
      that.setData({
        showFormList: true,
      })
      this.LoadMore()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qcloud.Session.clear()
    var that = this;
    qcloud.request({
      url: config.service.activitiesGoingUrl + "/1"+"/25",
      method: "GET",
      login:true,
      success: function (temp) {
        util.codetest(temp.data.code)
        console.log(temp);
        that.setData({
          goact: temp.data.info,
          length: temp.data.info.length,
        })
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    qcloud.request({
      url: config.service.swapUrl,
      method: "GET",
      login: true,
      success: function (temp) {
        util.codetest(temp.data.code)
        if (temp.data.code == 403) {
          return
        }
        console.log(temp);
        that.setData({
          imagenum:temp.data.info,
          imleng: temp.data.info.length,
        })
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })

  },

  fresh:function(){
    var that = this;
    that.setData({
      goact: [],
      length: 0,
    })
    qcloud.request({
      url: config.service.activitiesGoingUrl + "/1" + "/25",
      method: "GET",
      login: true,
      success: function (temp) {
        util.codetest(temp.data.code)
        console.log(temp);
        that.setData({
          goact: temp.data.info,
          length: temp.data.info.length,
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
  /*onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh();
  },*/

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



