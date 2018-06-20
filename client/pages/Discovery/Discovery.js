// pages/Discovery/Discovery.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    listStatus: 1,
    borderStatus: "border-bottom: 1px solid purple; color:purple",
    showbook:[],
    isloading: false,
    nomore: false,
    newbooknum:10,
    bookpage: 1,
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  inSearch:function(){
    console.log("?")//搜索函数
  },

  toHotStatus: function () {
    if (this.data.listStatus == 1) return
    var that = this;
    that.setData({
      listStatus: 1,
      showbook: [],
      isloading: false,
      nomore: false,
      newbooknum: 10,
      bookpage: 1,
    })
    that.LoadMore()
  },

  toNewStatus: function () {
    if (this.data.listStatus==2)return
    var that = this;
    that.setData({
      listStatus: 2,
      showbook: [],
      isloading: false,
      nomore: false,
      newbooknum: 10,
      bookpage: 1,
    })
    that.LoadMore()
  },

  toSearchStatus: function () {
    this.inSearch()//搜索
    var that = this;
    that.setData({
      listStatus: 3,
      showbook: [],
      isloading: false,
      nomore: false,
      newbooknum: 10,
      bookpage: 1,
    })
    that.LoadMore()
  },

  LoadMore: function (event) {
    var that = this;
    if (that.data.newbooknum < 10) {
      that.setData({
        nomore: true,
      })
    }
    if (that.data.nomore || that.data.isloading) return
    that.setData({
      isloading: true,
    })
   //console.log(event)
    if (this.data.listStatus == 1 || this.data.listStatus == 2){
    wx.request({
      //listStatus?热门:(listStatus?最新:搜索)
      url: this.data.listStatus == 1 ? (config.service.bookPVPageUrl + "/" + this.data.bookpage) : 
        (this.data.listStatus == 2 ? (config.service.bookPageUrl + "/" + this.data.bookpage) :
          (config.service.bookPageUrl + "/" + this.data.bookpage) ), 
      method: "GET",
      login: true,
      success: function (temp) {
        console.log(temp);
        that.setData({
          showbook: that.data.showbook.concat(temp.data.info),
          isloading: false,
          bookpage: that.data.bookpage + 1,
          newbooknum: temp.data.info.length,
        }),
        util.codetest(temp.data.code)
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
    }else {
      qcloud.request({
        url: config.service.searchBookUrl + "/" + this.data.bookpage +"/10",
        method: "POST",
        login: true,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          keyword:this.data.inputVal
        },
        success: function (temp) {
          console.log(temp);
          that.setData({
            showbook: that.data.showbook.concat(temp.data.info),
            isloading: false,
            bookpage: that.data.bookpage + 1,
            newbooknum: temp.data.info.length,
          }),
          util.codetest(temp.data.code)
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
    }
    if (that.data.newbooknum < 10) {
      that.setData({
        nomore: true,
      })
    }
  },

  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      showbook: [],
      isloading: false,
      nomore: false,
      newbooknum: 10,
      bookpage: 1,
    })
    that.LoadMore()
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qcloud.Session.clear()
    var that = this;
    this.LoadMore()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})