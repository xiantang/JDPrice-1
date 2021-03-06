//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getSession()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          
          // wx.request({
          //   url: 'http://127.0.0.1:8080/user/sentVerifyEmail',
          //   data: {
              
          //   },
          // })
        }
      })
    }
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var rawData = e.detail.rawData
    var encryptedData = e.detail.encryptedData
    var iv = e.detail.iv
    wx.request({
      url: 'http://127.0.0.1:8080/user/decodeUserInfo',
      data:{
        encryptedData:encryptedData,
        iv :iv,
        sessionId: wx.getStorageSync("sessionId")
      }, 
      success: function (res) {
        console.log(res)
      }
    })
  },
  goEmail: function() {
    wx.navigateTo({
      url: '../email/email'
    })
  },
  getSession:function(){
    var that = this;
    wx.login({
      success:function(res){
        // console.log(res.code)
        if(res.code){
          wx.request({
            url: 'http://127.0.0.1:8080/user/login',
            data:{
              code:res.code
            },
            success:function(res){
              if(res.data.data){
                console.log(res.data.data)
                  wx.setStorageSync("sessionId", res.data.data)
              }
            }
          })
        }

      }
    })
  }

})
