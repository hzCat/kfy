// pages/userCenter/userCenter.js
let app = getApp();
let jump = require("../../utils/jump.js");
let http = require("../../utils/ajax.js");
let storage = require("../../utils/storage.js");
let modal = require("../../utils/modal");
let update = require("../../utils/update.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allInfo: {},
    userInfo: {},
    headDefault: "../../icon/default_head.png",
    getUserInfoCount: 0,
    hasUserInfo: false,
    modalOn: false,
    staticUrl: null,
    isPullDown: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getStatic();
  },
  getStatic() {
    if (app.globalData.staticUrl) {
      this.setData({
        staticUrl: app.globalData.staticUrl
      });
      console.log("userCenter拿到静态地址", this.data.staticUrl);
    } else {
      console.log("没找到static");
      setTimeout(() => {
        this.getStatic();
      }, 500);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // storage.gets("allInfo").then(res => {
    //   console.log("userCenter获取allInfo", res.data);
    //   this.setData({
    //     allInfo: res.data,
    //     getUserInfoCount: 0
    //   });
    // });
    this.getAllInfo();
    this.getUserInfo();
  },
  // 下拉刷新用户信息
  onPullDownRefresh() {
    this.setData(
      {
        isPullDown: true
      },
      () => {
        this.refreshUserInfo();
      }
    );
  },
  // 接口更新用户信息
  getAllInfo() {
    console.log("个人中心刷新用户all信息");
    wx.showNavigationBarLoading();
    let that = this;
    let url = "/vip/getCurrentVipUser";
    http
      .ajax(url, "GET", {}, app.globalData.header)
      .then(function(res) {
        console.log("获取所有用户信息", res);
        that.setData({
          allInfo: res.data.data
        });
        storage.sets("allInfo", res.data.data);
        setTimeout(() => {
          wx.hideNavigationBarLoading();
          if (that.data.isPullDown) {
            wx.stopPullDownRefresh();
            that.setData({
              isPullDown: false
            });
          }
        }, 1500);
      })
      .catch(err => {
        setTimeout(() => {
          wx.hideNavigationBarLoading();
          if (that.data.isPullDown) {
            wx.stopPullDownRefresh();
            that.setData({
              isPullDown: false
            });
          }
        }, 1500);
        modal.modal("提示", "网络差");
      });
  },
  // 缓存获取微信用户信息
  getUserInfo() {
    let that = this;
    // setTimeout(() => {
    storage
      .gets("userInfo")
      .then(res => {
        console.log("userInfo", res.data);
        this.setData({
          userInfo: res.data,
          hasUserInfo: true
        });
      })
      .catch(err => {
        if (this.data.getUserInfoCount < 5) {
          console.log(`获取${this.data.getUserInfoCount + 1}次`);
          setTimeout(() => {
            that.getUserInfo();
            let now = this.data.getUserInfoCount + 1;
            this.setData({
              getUserInfoCount: now,
              hasUserInfo: false
            });
          }, 500);
        }
      });
    // }, 700);
  },
  // 刷新
  refreshUserInfo() {
    let that = this;
    that.getUserInfo();
    that.getAllInfo();
  },
  getHead(e) {
    let jumpto = e.currentTarget.dataset.jump;
    if (this.data.hasUserInfo) {
      console.log("有userInfo");
      jump.jump("nav", jumpto);
    } else {
      console.log("无userInfo");
      this.setData(
        {
          modalOn: true
        },
        () => {
          app.again();
        }
      );
    }
  },
  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;

    this.setData(
      {
        modalOn: true
      },
      () => {
        if (jumpto == "/pages/vip/vip") {
          jump.jump("switch", jumpto);
        } else {
          jump.jump("nav", jumpto);
        }
      }
    );
  }
});
