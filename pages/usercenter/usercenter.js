var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var util = require("../../utils/util.js");
var storage = require("../../utils/storage.js");
var modal = require("../../utils/modal.js");
var update = require("../../utils/update.js");
var app = getApp();
Page({
  /*** 页面的初始数据*/
  data: {
    userNickName: null,
    userAvatarUrl: null,
    showCard: "",
    personalQR: "",
    groupQR: "",
    allInfo: {},
    third: "",
    header: {},
    staticUrl: null,
    isVip: null,
    isTvip: null,
    opened: "未开通",
    tOpened: "未开通",
    modalOn: false,
    userscreenLight: null,
    bindPhone: true
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    that.get3rd();
    that.getUserInfo();
    that.getStaticUrl();
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    let that = this;
    // navbar.title("个人中心");
    this.setData({
      modalOn: false
    });
    // 判断后更新3rd
    if (that.data.header == {}) {
      that.get3rd();
    }
    // 更新用户所有信息
    that.getAllInfo();
    // 判断后更新微信用户信息
    if (that.data.userNickName == "") {
      that.getUserInfo();
    }
    // if(!that.data.staticUrl){
    //   that.getStaticUrl();
    // }
  },

  // 获取静态地址(正式版更换为static.kongfuy.cn)
  getStaticUrl() {
    let that = this;
    storage
      .gets("staticUrl")
      .then(function (res) {
        that.setData({
          staticUrl: res.data.url
        });
      })
      .catch(err => {
        http.ajax("/common/staticDomain").then(function (res) {
          console.log(res.data);
          var obj = {};
          obj.url = res.data;
          that.setData({
            staticUrl: res.data
          });
          storage.sets("staticUrl", obj);
        });
      });
  },

  // 后台时恢复亮度,返回,关闭操作
  onHide: function () {
    let that = this;
    if (this.data.userscreenLight) {
      wx.setScreenBrightness({
        value: that.data.userscreenLight
      });
    }
  },

  // 获取3rd_session
  get3rd() {
    let that = this;
    storage.gets("3rd_session").then(function (res) {
      that.setData({
        third: res.data,
        header: {
          _yzsaas_token: res.data,
          "content-type": "application/x-www-form-urlencoded"
        }
      });
    });
  },

  // 获取所有用户信息
  getAllInfo() {
    let that = this;
    // 更新allinfo
    storage.gets("allInfo").then(function (res) {
      console.log("获取所有用户信息成功", res.data);
      // 修改vipCardList
      let cardList = res.data.vipCardList
      let arr = []
      // VIP下标为0,TVIP下标为1
      if (cardList.length == 0) {
        arr = [];
      } else {
        for (let i = 0; i < cardList.length; i++) {
          let obj = cardList[i];
          if (obj.vipScope == "VIP") {
            arr[0] = obj;
          }
          if (obj.vipScope == "TVIP") {
            arr[1] = obj;
          }
        }
        console.log("修改后的", arr)
      }
      // 重新复制allInfo中的vipCardList
      let all = res.data;
      all.vipCardList = arr;
      that.setData({
        allInfo: all,
        bindPhone: res.data.bindMobile
      });
      // 是否是会员
      let isVip = null;
      let isTvip = null;
      if (that.data.allInfo.vipCardList[0]) {
        isVip = that.data.allInfo.vipCardList[0].enabled;
      }
      if (that.data.allInfo.vipCardList[1]) {
        isTvip = that.data.allInfo.vipCardList[1].enabled;
      }
      if (isVip == true) {
        that.setData({
          opened: "余￥0.00"
        });
      }
      if (isTvip == true) {
        that.setData({
          tOpened: "余￥0.00"
        });
      }
      that.setData({
        isVip: isVip,
        isTvip: isTvip
      });
    });
  },

  // 获取微信用户信息
  getUserInfo() {
    let that = this;
    // 微信用户信息
    storage
      .gets("userInfo")
      .then(res => {
        console.log("找到userInfo", res.data);
        that.setData({
          userNickName: res.data.nickName,
          userAvatarUrl: res.data.avatarUrl
        });
      })
      .catch(err => {
        console.log("未找到userInfo", err);
      });
  },

  // 下拉刷新用户信息
  onPullDownRefresh() {
    this.refreshUserInfo();
  },

  // 刷新
  refreshUserInfo() {
    let that = this;
    wx.showNavigationBarLoading();
    update.updateuser();
    // that.getUserInfo();
    setTimeout(function () {
      storage.gets("allInfo").then(res => {
        that.setData({
          allInfo: res.data,
          bindPhone: res.data.bindMobile
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      });
    }, 1500);
  },

  // 跳转
  jump(e) {
    this.setData({
      modalOn: true
    });
    wx.navigateTo({
      url: e.currentTarget.dataset.page
    });
  },

  // 打开二维码
  openQR(e) {
    console.log(e.currentTarget.dataset.card);
    var that = this;
    // 获取屏幕亮度
    wx.getScreenBrightness({
      success(res) {
        console.log("亮度", res.value);
        that.setData({
          userscreenLight: res.value,
          modalOn: true
        });
      },
      fail(err) {
        that.setData({
          modalOn: true
        });
      }
    });

    var method = "GET";
    var header = that.data.header;
    // 生成随机数
    var random = function () {
      return Math.random()
        .toString(10)
        .substr(7, 7);
    };
    var num = random();
    // 打开团餐会员卡
    if (e.currentTarget.dataset.card == "group") {
      // 如果会员卡余额有值
      if (that.data.isTvip) {
        // 最高亮度
        wx.setScreenBrightness({
          value: 1
        });
        var url = "/vipPayment/getVipCardQrcode";
        var data = {
          vipScope: "TVIP",
          random: num
        };
        http
          .ajax(url, method, data, header)
          .then(function (res) {
            // 关闭遮罩,添加二维码路径

            console.log(res);
            that.setData({
              groupQR: "data:image/png;base64," + res.data.data,
              modalOn: false
            });
          })
          .catch(err => {
            // 关闭遮罩
            that.setData({
              modalOn: false
            });
          });
        this.setData({
          showCard: "group"
        });
      } else {
        util.jump("nav", "/pages/getVip/getVip?userType=group");
      }
      // 打开个人会员卡
    } else if (e.currentTarget.dataset.card == "personal") {
      // 如果会员卡余额有值
      if (that.data.isVip) {
        // 最高亮度
        wx.setScreenBrightness({
          value: 1
        });

        var url = "/vipPayment/getVipCardQrcode";
        var data = {
          vipScope: "VIP",
          random: num
        };
        http
          .ajax(url, method, data, header)
          .then(function (res) {
            console.log(res);
            // 关闭遮罩,添加二维码路径
            that.setData({
              personalQR: "data:image/png;base64," + res.data.data,
              modalOn: false
            });
          })
          .catch(err => {
            // 关闭遮罩
            that.setData({
              modalOn: false
            });
          });
        this.setData({
          showCard: "personal"
        });
      } else {
        util.jump("nav", "/pages/getVip/getVip?userType=personal");
      }
    }
  },

  // 关闭二维码
  closeQR() {
    let that = this;
    wx.setScreenBrightness({
      value: that.data.userscreenLight
    });
    this.setData({
      showCard: "abcd",
      personalQR: "",
      groupQR: "",
      modalOn: false
    });
  },

  // 从微信获取手机号进行绑定
  getPhoneNumber: function (e) {
    var that = this;
    that.setData({
      modalOn: true
    });
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.showLoading({
        title: "绑定中"
      });
      that.setData({
        modalOn: false
      });
      var url = "/vipCenter/bindMobileWithWX";
      var method = "POST";
      var data = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      };
      var header = that.data.header;
      http
        .ajax(url, method, data, header)
        .then(function (res) {
          console.log(res.data);
          var url = "/vip/getCurrentVipUser";
          var data = {};
          var method = "GET";
          var header = that.data.header;
          http
            .ajax(url, method, data, header)
            .then(function (res) {
              console.log(res);
              wx.setStorage({
                key: "allInfo",
                data: res.data.data,
                success: function (res) {
                  // var pattern = "redirect";
                  // var jump = "/pages/usercenter/usercenter";
                  setTimeout(function () {
                    // util.jump(pattern, jump);
                    that.getAllInfo();
                    wx.hideLoading();
                  }, 1500);
                }
              });
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(function (err) {
          modal.modal("提示", "手机号绑定失败,请重试");
        });
    } else {
      util.jump("nav", "/pages/relatePhone/relatePhone");
    }
  },

  // 点击头像栏获取微信用户信息
  headerGet() {
    let that = this;
    storage
      .gets("userInfo")
      .then(res => {})
      .catch(err => {
        app.again();
        setTimeout(() => {
          that.getUserInfo();
        }, 2000);
      });
  }
});