// pages/User/User.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')



Page({

  /**
   * 页面的初始数据
   */

  data: {
    logged: false,
    takeSession: false,
    requestResult: '',
    SigninText: "签到",
    Signned: false,
    userinfo:{},
    code:200,
    credit:0,
  },
  //测试函数
  loginlog: function (res) {
    this.login()
  },

  backendtest:function () {
    /*  用户加入活动
     qcloud.request({
        url: "https://pk11ehy7.qcloud.la/lottery/joinlottery/11",
        method: "GET",
        success: function (res) {
          console.log(res);
        }
      });
      */
      /* 用户请求活动状态
      qcloud.request({
        url: "https://pk11ehy7.qcloud.la/lottery/usergetlottery/11",
        method: "GET",
        success: function (res) {
          console.log(res);
        }
      });
      */
      // 查询已有订单
      /*
      qcloud.request({
        url: "https://pk11ehy7.qcloud.la/Order",
        method: "GET",
        success: function (res) {
          console.log(res);
        }
      });
      */
      /*
      qcloud.request({
        url: "https://pk11ehy7.qcloud.la/Order/validate",
        method: "POST",
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          "id":"14",
          "address":"奇怪的地址2"
        },
        success: function (res) {
        console.log(res);
        }
      });
      */
      /*
      qcloud.request({
        url:config.service.favoritesUrl,
        success:function (res){
          console.log(res);
        }
      })
      */
      /*
      qcloud.request({
        url: config.service.favoritesUrl,
        method:"POST",
        header:{
          "Content-type":"application/x-www-form-urlencoded"
        },
        data:{"book_id":3},
        success: function (res) {
          console.log(res);
        }
      })
      */
    qcloud.request({
      url: config.service.favoritesUrl,
      method: "DELETE",
      header: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      data: { "book_id": 3 },
      success: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 登录测试
   */
  OnClickListener: function (event) {
    var that = this;
    if(this.data.Signned)return;
    qcloud.request({
      url: config.service.checkinUrl,
      success: function (res) {
        console.log("签到信息", res);
        that.setData({
          Signned: true,
          SigninText: res.data.info.checks + "天"
        })
        //that.onLoad();
      }
    });
    
    /*qcloud.request({
      url: config.service.requestUrl,
      success: function (res) {
        //console.log(res);
        that.setData({
          Signned: true,
          SigninText: res.data.info.checks + "天"
        })//,
          //util.codetest(res.data.code)
        that.onLoad();
      }
    })*/

    qcloud.request({
      url: config.service.creditsUrl,
      method: "GET",
      login: true,
      success: function (temp) {
        console.log(temp)
        that.setData({
          credit: temp.data.info.credits,
        })
      }
    })
  },

  logout: function (e) {
    var that=this;
    qcloud.request({
      url: config.service.logoutUrl,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (temp) {
        that.setData({
          logged: false,
        })
        console.log(temp)
        util.codetest(temp.data.code)
        qcloud.Session.clear()
        wx.showModal({ 
          content: "退出登录成功",
          title: "提示", 
          showCancel: false, 
          }); 
          getApp().globalData.logged = false;
      }
    })
  },

  login: function () {
    var that = this
    if (getApp().globalData.logged&&this.data.logged) return
    util.showBusy('正在登录')

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          console.log("login直接返回", result)
          util.showSuccess("")
          that.setData({
            userinfo:result,
            credit: result.credits,
            logged: true,
          }),
          //util.codetest(result.data.code)
          getApp().globalData.logged = true;
          
          var lastcheck = new Date(result.lastcheck * 1000);
          //console.log("L:" + lastcheck.getDay() + " N:" + new Date().getDay());
          if (lastcheck.getDate() == new Date().getDate()) {
            that.setData({
              Signned: true,
              SigninText: result.checks + "天"
            })
          }

        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            logign: true,
            success: function (result) {
              console.log("从request返回", result)
              util.showSuccess('')
              that.setData({
                userinfo: result,
                credit: result.credits,
                logged: true
              }),
              //util.codetest(result.data.code)
              getApp().globalData.logged=true;

              var lastcheck = new Date(result.data.data.lastcheck*1000);
              //console.log("L:" + lastcheck.getDay() + " N:" + new Date().getDay());
              if(lastcheck.getDate()==new Date().getDate()){
                that.setData({
                  Signned: true,
                  SigninText: result.data.info.checks + "天"
                })
              }
            },
            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },
      fail(error) {
        util.showModel('登录失败1', error)
        console.log('登录失败', error)
      }
    })
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        }),
          util.codetest(result.data.code)
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qcloud.Session.clear();
    if(this.data.logged){
      qcloud.request({
        url: config.service.creditsUrl,
        method: "GET",
        login: true,
        success: function (temp) {
          console.log(temp)
          that.setData({
            credit: temp.data.info.credits,
          })
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
    var that = this
    if (this.data.logged) {
      qcloud.request({
        url: config.service.creditsUrl,
        method: "GET",
        login: true,
        success: function (temp) {
          console.log(temp)
          that.setData({
            credit: temp.data.info.credits,
          })
        },
        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    }
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
