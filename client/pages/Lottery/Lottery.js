// pages/Lottery/Lottery.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryType: 2,
    options:{},
    isSelected:0,
    code:200,
    lotteryinfo:{},
    id:0,
    stime:"",
    etime:"",
    rewardsimg: ["/images/thx.png", "/images/jiangquan.png", "/images/jifen.png","/images/liwu.png"],
    pos:[0,1,3,2,8,0,7,5,6,4],
    isRoll:false,
    reward:"",
    pre:true,
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: "水木书荟：优惠活动中！",
      //path: '/page/user?id=123'
    }
  },

  sleep:function(n)
  {
    var start= new Date().getTime();
    while(true) if(new Date().getTime() - start > n) break;
  },


  lobur:function(){//转盘抽奖
    if (this.data.lotteryinfo.left <= 0||this.data.isRoll||!this.data.pre)return
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
    var that =this;
    //转盘
    qcloud.request({
      url: config.service.doRoundUrl + '/' + this.data.id,
      method: "PUT",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          reward: res.data.info.reward,
          isRoll:true,
        })
        util.codetest(res.data.code)
        if (res.data.code == 200) {
        }
        console.log(res.data.info.reward)
        var time = 0
        for (var i = 0; i < 9; i++) {
          that.sleep(500 - 50 * i);
          that.setData({
            isSelected: time % 9 + 1
          })
          time++;
        }
        for (var i = 0; i < 9; i++) {
          that.sleep(100);
          that.setData({
            isSelected: time % 9 + 1
          })
          time++;
        }
        for (var i = 0; i < 9; i++) {
          that.sleep(300 + 50 * i);
          that.setData({
            isSelected: time % 9 + 1
          })
          if (!(that.data.reward == 0)&&that.data.lotteryinfo.rewards.length > that.data.pos[that.data.isSelected] && that.data.lotteryinfo.rewards[that.data.pos[that.data.isSelected]].id == that.data.reward) {
            console.log(that.data.lotteryinfo.rewards[that.data.pos[that.data.isSelected]].id)
            wx.navigateTo({
              url: '/pages/HistoryOrder/HistoryOrder',
            })
            wx.showModal({
              title: "提示",
              content: "恭喜中奖",
              showCancel: false,
            })
            break;
          } else if (that.data.reward == 0 && that.data.lotteryinfo.rewards.length <= that.data.pos[that.data.isSelected]) {
            wx.showModal({
              title: "提示",
              content: "谢谢惠顾",
              showCancel: false,
            })
            break;
          } 
          time++;
        }
        that.onShow()
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  lobuw: function () {//微博抽奖
    if (this.data.lotteryinfo.user_state == 1 || !this.data.pre) return
    if (!(this.data.lotteryinfo.state_detail == 1))return
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
    var that = this;
    //抽奖
    qcloud.request({
      url: config.service.joinLotteryUrl + '/' + this.data.id,
      method: "GET",
      login: true,
      success: function (res) {
        console.log(res)
        util.codetest(res.data.code)
        if (res.data.code == 200) {
          wx.showModal({
            title: "提示",
            content: "参加成功",
            showCancel: false,
          })
        }
        that.onShow()
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  lobuc: function () {//砍价
    if (this.data.lotteryinfo.bargained || !this.data.pre) return
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
    var that = this;
    //砍价
    qcloud.request({
      url: config.service.doBargainUrl + '/' + this.data.id,
      method: "PUT",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        util.codetest(res.data.code)
        if (res.data.code == 200) {
          wx.showModal({
            title: "提示",
            content: "砍价成功",
            showCancel: false,
          })
        }
        that.onShow()
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  lobub: function () {//砍价时购买
    if (this.data.lotteryinfo.books_left <= 0 || !this.data.pre) return
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
    //购买
    qcloud.request({
      url: config.service.buyBargainedUrl + '/' + this.data.id,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("换购")
        console.log(res)
        wx.navigateTo({
          url: "/pages/HistoryOrder/HistoryOrder",
        })
        util.codetest(res.data.code)
        if (res.data.code == 200) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    //qcloud.Session.clear()
    var that = this;
    console.log(options)
    that.setData({
      options:options,
      lotteryType: options.type,
    })
    /*util.showBusy("loading")
    if (that.data.lotteryType==2){//轮盘
      qcloud.request(
        {
          url: config.service.roundDetailsUrl +'/'+ options.id,
          method: "GET",
          login:true,
          success: function (res) {
            console.log(res)
            var stime = new Date(res.data.info.start_time * 1000)
            var etime = new Date(res.data.info.end_time * 1000)
            that.setData({
              lotteryinfo: res.data.info,
              id: res.data.info.id,
              isRoll:false,
              stime: stime.getFullYear() + "-" + (stime.getMonth() + 1) + "-" + stime.getDate() + " " + stime.getHours() + ":" + stime.getMinutes() + ":" + stime.getSeconds(),
              etime: etime.getFullYear() + "-" + (etime.getMonth() + 1) + "-" + etime.getDate() + " " + etime.getHours() + ":" + etime.getMinutes() + ":" + etime.getSeconds(),
            });
            util.codetest(res.data.code)
            util.showSuccess("")
            if (stime > new Date()) {
              that.setData({
                pre: false,
              })
            }
            if (res.data.info.logged==0){
              wx.showModal({
                title: "提示",
                content: "请先登录",
                showCancel: false,
              }),
                wx.switchTab({
                  url: '/pages/User/User',
                })
              return
            }
            if (that.data.lotteryinfo.rewards.length <= 0) {
              wx.showModal({
                title: "提示",
                content: "该活动奖品已送完",
                showCancel: false,
              })
            }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        }
      )
    } else if (that.data.lotteryType == 3) {//砍价
      qcloud.request(
        {
          url: config.service.bargainDetailsUrl +'/' + options.id,
          method: "GET",
          login: true,
          success: function (res) {
            console.log(res)
            var stime = new Date(res.data.info.start_time * 1000)
            var etime = new Date(res.data.info.end_time * 1000)
            that.setData({   
              lotteryinfo:res.data.info,
              id: res.data.info.id,
              stime: stime.getFullYear() + "-" + (stime.getMonth()+1) + "-" + stime.getDate() + " " +stime.getHours() + ":"+stime.getMinutes()+":"+stime.getSeconds(),
              etime: etime.getFullYear() + "-" + (etime.getMonth()+1) + "-" + etime.getDate() + " " + etime.getHours() + ":" + etime.getMinutes() + ":" + etime.getSeconds(),
            });
            util.codetest(res.data.code)
            util.showSuccess("")
            if (stime>new Date()){
              that.setData({
                pre:false,
              })
            }
            if (that.data.lotteryinfo.books_left <= 0){
              wx.showModal({
                title: "提示",
                content: "该活动奖品已送完",
                showCancel: false,
              })
            }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        }
      )
    } else if (that.data.lotteryType == 1) {//抽奖
      qcloud.request(
        {
          url: config.service.LotteryUrl + '/' + options.id,
          method: "GET",
          login: true,
          success: function (res) {
            console.log(res)
            var stime = new Date(res.data.info.start_time * 1000)
            var etime = new Date(res.data.info.end_time * 1000)
            that.setData({
              lotteryinfo: res.data.info,
              id: res.data.info.id,
              stime: stime.getFullYear() + "-" + (stime.getMonth() + 1) + "-" + stime.getDate() + " " + stime.getHours() + ":" + stime.getMinutes() + ":" + stime.getSeconds(),
              etime: etime.getFullYear() + "-" + (etime.getMonth() + 1) + "-" + etime.getDate() + " " + etime.getHours() + ":" + etime.getMinutes() + ":" + etime.getSeconds(),
            });
              util.codetest(res.data.code)
              util.showSuccess("")
              if (stime > new Date()) {
                that.setData({
                  pre: false,
                })
              }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        }
      )
    }*/
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
    var that = this;
    console.log(that.data.options)
    util.showBusy("loading")
    if (that.data.lotteryType == 2) {//轮盘
      qcloud.request(
        {
          url: config.service.roundDetailsUrl + '/' + that.data.options.id,
          method: "GET",
          login: true,
          success: function (res) {
            console.log(res)
            var stime = new Date(res.data.info.start_time * 1000)
            var etime = new Date(res.data.info.end_time * 1000)
            that.setData({
              lotteryinfo: res.data.info,
              id: res.data.info.id,
              isRoll: false,
              stime: stime.getFullYear() + "-" + (stime.getMonth() + 1) + "-" + stime.getDate() + " " + stime.getHours() + ":" + stime.getMinutes() + ":" + stime.getSeconds(),
              etime: etime.getFullYear() + "-" + (etime.getMonth() + 1) + "-" + etime.getDate() + " " + etime.getHours() + ":" + etime.getMinutes() + ":" + etime.getSeconds(),
            });
            util.codetest(res.data.code)
            util.showSuccess("")
            if (stime > new Date()) {
              that.setData({
                pre: false,
              })
            } else if (etime < new Date() || res.data.info.state==3) {
              wx.switchTab({
                url: '/pages/Home/Home',
              }),
              wx.showModal({
                title: "提示",
                content: "活动已过期",
                showCancel: false,
              })
              return
            }
            if (res.data.info.logged == 0) {
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
            if (that.data.lotteryinfo.rewards.length <= 0) {
              wx.showModal({
                title: "提示",
                content: "该活动奖品已送完",
                showCancel: false,
              })
            }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        }
      )
    } else if (that.data.lotteryType == 3) {//砍价
      qcloud.request(
        {
          url: config.service.bargainDetailsUrl + '/' + that.data.options.id,
          method: "GET",
          login: true,
          success: function (res) {
            console.log(res)
            var stime = new Date(res.data.info.start_time * 1000)
            var etime = new Date(res.data.info.end_time * 1000)
            that.setData({
              lotteryinfo: res.data.info,
              id: res.data.info.id,
              stime: stime.getFullYear() + "-" + (stime.getMonth() + 1) + "-" + stime.getDate() + " " + stime.getHours() + ":" + stime.getMinutes() + ":" + stime.getSeconds(),
              etime: etime.getFullYear() + "-" + (etime.getMonth() + 1) + "-" + etime.getDate() + " " + etime.getHours() + ":" + etime.getMinutes() + ":" + etime.getSeconds(),
            });
            util.codetest(res.data.code)
            util.showSuccess("")
            if (stime > new Date()) {
              that.setData({
                pre: false,
              })
            } else if (etime < new Date() || res.data.info.state == 3) {
              wx.switchTab({
                url: '/pages/Home/Home',
              }),
                wx.showModal({
                  title: "提示",
                  content: "活动已过期",
                  showCancel: false,
                })
              return
            }
            if (res.data.info.logged == 0) {
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
            if (that.data.lotteryinfo.books_left <= 0) {
              wx.showModal({
                title: "提示",
                content: "该活动奖品已送完",
                showCancel: false,
              })
            }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        }
      )
    } else if (that.data.lotteryType == 1) {//抽奖
      qcloud.request(
        {
          url: config.service.LotteryUrl + '/' + that.data.options.id,
          method: "GET",
          login: true,
          success: function (res) {
            console.log(res)
            var stime = new Date(res.data.info.start_time * 1000)
            var etime = new Date(res.data.info.end_time * 1000)
            that.setData({
              lotteryinfo: res.data.info,
              id: res.data.info.id,
              stime: stime.getFullYear() + "-" + (stime.getMonth() + 1) + "-" + stime.getDate() + " " + stime.getHours() + ":" + stime.getMinutes() + ":" + stime.getSeconds(),
              etime: etime.getFullYear() + "-" + (etime.getMonth() + 1) + "-" + etime.getDate() + " " + etime.getHours() + ":" + etime.getMinutes() + ":" + etime.getSeconds(),
            });
            util.codetest(res.data.code)
            util.showSuccess("")
            if (stime > new Date()) {
              that.setData({
                pre: false,
              })
            } else if (etime < new Date() || res.data.info.state == 3) {
              wx.switchTab({
                url: '/pages/Home/Home',
              }),
                wx.showModal({
                  title: "提示",
                  content: "活动已过期",
                  showCancel: false,
                })
              return
            }
          },
          fail(error) {
            util.showModel('请求失败', error)
            console.log('request fail', error)
          }
        }
      )
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

  onPullDownRefresh: function () {
    this.onShow()
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})