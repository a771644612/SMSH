// pages/Book/Book.js


var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')


Page({
  data: {
    id: 0,
    isLike: true,
    onSale: true,
    isCollection: false,
    inComment: false,
    borderStatus: "border-bottom: 1px solid  #f44336; color:#f44336",
    innull: "",
    bookdetail:[],

    zanidlist: "",
    liststatus: 0,
    listselected: "color:red;background-color: rgba(255,0,0,0.1);",

    showcomment: [],
    isloading: false,
    nomore: false,
    newcommentnum: 5,
    commentpage: 1,

    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    bookinfo:{},
    options:{},
  },

  binderrorimg: function (e) {
    var errorImgIndex = e.target.dataset.errorimg 
    console.log(errorImgIndex)
    var imgObject = "bookdetail[" + errorImgIndex + "].url" 
    console.log(imgObject)
    var errorImg = {}
    errorImg[imgObject] = "/images/default_nogift.png"
    this.setData(errorImg)
  },

  LoadMore: function (event) {
    var that = this;
    if (that.data.newcommentnum < 5) {
      that.setData({
        nomore: true,
      })
    }
    if (that.data.nomore) return
    if (!that.data.inComment)return
    that.setData({
      isloading: true,
    })
    console.log("/" + this.data.liststatus + "/" + this.data.id + "/" + this.data.commentpage)
    qcloud.request({
      url: config.service.commentBookUrl + "/" + this.data.liststatus + "/" + this.data.bookinfo.id + "/" + this.data.commentpage + "/5",
      login: true,
      method: "GET",
      success: function (temp) {
        console.log(temp);
        that.setData({
          showcomment: that.data.showcomment.concat(temp.data.info),
          isloading: false,
          commentpage: that.data.commentpage + 1,
          newcommentnum: temp.data.info.length,
        }),
        util.codetest(temp.data.code)
        if (that.data.newcommentnum < 5) {
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
    if (that.data.newcommentnum < 5) {
      that.setData({
        nomore: true,
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toBuy:function(){
    if(this.data.bookinfo.left<=0)return
    console.log(this.data.id)
    wx.navigateTo({
      url: '/pages/Order/Order?type=0&id='+this.data.id,
    })
  },

  toItemStatus: function () {
    if (!this.data.inComment) return
    var that = this;
    that.setData({
      inComment: false,
    })
  },

  toCommentStatus: function () {
    if (this.data.inComment)return
    var that = this;
    that.setData({
      inComment: true,
    }),
    this.LoadMore()
  },

  addcollection: function () {
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
    //此处添加收藏函数
    util.showBusy('loading')
    qcloud.request({
      url: config.service.favoritesUrl,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        book_id:this.data.id,
      },
      success: function (res) {
        console.log("收藏获取信息", res),
        util.codetest(res.data.code)
        that.onLoad(that.data.options)
        util.showSuccess("")
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  uncollection: function () {
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
    //此处取消收藏函数
    util.showBusy('loading')
    qcloud.request({
      url: config.service.favoritesUrl + "/" + this.data.id,
      method: "DELETE",
      login: true,

      success: function (res) {
        console.log("收藏获取信息", res),
        util.codetest(res.data.code)
        that.onLoad(that.data.options)
        util.showSuccess("");
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
  },

  addzan: function (e) {
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
    console.log(e.currentTarget.dataset.cid)
    qcloud.request({
      url: config.service.likeCommentUrl + "/" + e.currentTarget.dataset.cid,
      method: "POST",
      login: true,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("点赞", res),
        util.codetest(res.data.code)
        that.setData({
          showcomment: [],
          isloading: false,
          nomore: false,
          newcommentnum: 5,
          commentpage: 1,
        })
        that.LoadMore()
        wx.showModal({
          title: "提示",
          content: "点赞成功",
          showCancel: false,
        })
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    })
    //点赞函数
  },

  list1: function () {
    //时间倒序
    var that = this;
    if (this.data.liststatus == 0) return
    that.setData({
      liststatus: 0,
      showcomment: [],
      isloading: false,
      nomore: false,
      newcommentnum: 5,
      commentpage: 1,
    })
    that.LoadMore()
  },

  list2: function () {
    //点赞数量
    var that = this;
    if (this.data.liststatus == 1) return
    that.setData({
      liststatus: 1,
      showcomment: [],
      isloading: false,
      nomore: false,
      newcommentnum: 5,
      commentpage: 1,
    })
    that.LoadMore()
  },

  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh();
  },

  onLoad: function (options) {
    //qcloud.Session.clear()
    var that = this;
    that.setData({
      options:options,
    })
    qcloud.request({
      url: config.service.bookUrl + '/' + options.bookid,
      login:true,
      method: "GET",
      success: function (res) {
        console.log("书籍获取信息", res),
          that.setData({
            id: res.data.info.id,
            code:res.data.code,
            bookinfo: res.data.info,
            bookdetail:  JSON.parse(res.data.info.details),
          }),
          util.codetest(res.data.code)
      },
      fail(error) {
        util.showModel('请求失败', error)
        console.log('request fail', error)
      }
    });
    console.log(this.data.bookdetail)
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