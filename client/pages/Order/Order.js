
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddress:{},
    showItem:{},
    historytype:0,
    inputcomment:"",
    code:200,
    options:"",
    inAddress:"",
    id:0,
    focus:true,
  },

  toval:function(e){
    var that=this;
    qcloud.request({
      url: config.service.ordersValidateUrl ,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        id:this.data.id,
      },
      success: function (res) {
        console.log(res)
        util.codetest(res.data.code)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/HistoryOrder/HistoryOrder',
          })
          wx.showModal({
            title: "提示",
            content: "确认成功",
            showCancel: false,
          })
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    that.onLoad(this.data.options)
  },

  tobuy:function(e){
    qcloud.request({
      url: config.service.buyBookUrl + '/' + this.data.id,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        address: this.data.inAddress,
      },
      success: function (res) {
        console.log(res)
        util.codetest(res.data.code)
        if (res.data.code==200)
        {
          wx.navigateTo({
            url: "/pages/HistoryOrder/HistoryOrder",
          })
            wx.showModal({
            title: "提示",
            content: "购买成功",
            showCancel: false,
          })
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  bindTextAreaBlur: function (e) {
    this.setData({
      inputcomment: e.detail.value
    })
    console.log(this.data.inputcomment)
  }, 

  inputC:function(){
    console.log(this.data.inputcomment)
    qcloud.request({
      url: config.service.commentUrl,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        contents: this.data.inputcomment,
        book_id: this.data.showItem.book_info.id,
        order_id: this.data.showItem.id,
      },
      success: function (res) {
        util.codetest(res.data.code)
        console.log("评论插入信息", res);
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    wx.navigateTo({
      url: '/pages/Book/Book?bookid=' + this.data.showItem.book_info.id,
    })
  },

  inputCL: function () {
    console.log(this.data.inputcomment)
    qcloud.request({
      url: config.service.commentUrl,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        contents: this.data.inputcomment,
        book_id: this.data.showItem.reward_info.book_info.id,
        order_id: this.data.showItem.id,
      },
      success: function (res) {
        util.codetest(res.data.code)
        console.log("评论插入信息", res);
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    wx.navigateTo({
      url: '/pages/Book/Book?bookid=' + this.data.showItem.reward_info.book_info.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //qcloud.Session.clear()
    var that = this;
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
    that.setData({
      historytype:options.type,
      options:options,
    }),
    qcloud.request(
      {
        url: config.service.infoUrl,
        method: "GET",
        login:true,
        success: function (res) {
          console.log(res)
          that.setData({
            showAddress:res.data.info,
            code: res.data.code,
            inAddress:res.data.info.addressprovince + " " + res.data.info.addresscity + " " + res.data.info.address
          }),
            util.codetest(res.data.code)
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      }
    )
    if (that.data.historytype==0){
      qcloud.request({
        url: config.service.bookUrl + '/' + options.id,
        login: true,
        method: "GET",
        success: function (res) {
          console.log("订单获取信息", res),
            that.setData({
              showItem:res.data.info,
              id:res.data.info.id,
            }),
            util.codetest(res.data.code)
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    } else if (that.data.historytype == 1 || that.data.historytype == 3) {
      qcloud.request({
        url: config.service.ordersUrl + '/getById/' + options.id,
        login: true,
        method: "GET",
        success: function (res) {
          console.log("订单获取信息", res),
            that.setData({
              showItem: res.data.info,
              id: res.data.info.id,
            }),
            util.codetest(res.data.code)
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    } else if (that.data.historytype == 2) {
      qcloud.request({
        url: config.service.ordersUrl + '/getById/' + options.id,
        login: true,
        method: "GET",
        success: function (res) {
          console.log("订单获取信息", res),
            that.setData({
              showItem: res.data.info,
              id: res.data.info.id,
            }),
            util.codetest(res.data.code)
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    }
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