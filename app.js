var modal = require("./utils/modal.js");
var http = require("./utils/ajax.js");
var storage = require("./utils/storage.js");
var update = require("./utils/update.js");
//app.js
App({
  // 全局变量
  globalData: {
    userInfo: null,
    canCheck: true,
    staticUrl: "static.kongfuy.cn",
    header: {},
    serviceNumber: ""
  },
  // 全局加载一次
  onLaunch: function() {
    var that = this;
    that.globalData.canCheck = true;
    console.log("当前版本,v1.1-group");
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    });
    // 网络监控
    wx.onNetworkStatusChange(function(res) {
      if (res.networkType == "2g") {
        modal.modal("提示", "网络不稳定");
      } else if (res.networkType == "none") {
        modal.modal("提示", "无网络，请检查后重试");
      }
    });
    http.ajax("/common/getServiceContact").then(res => {
      console.log("客服电话", res.data);
      this.globalData.serviceNumber = res.data;
    });
  },

  // 打开小程序就执行
  onShow() {
    let that = this;
    // 检查网络,2g或者none直接退出
    wx.getNetworkType({
      success: function(res) {
        if (res.networkType != "2g" && res.networkType != "none") {
          // 网络正常再登陆
          if (that.globalData.canCheck) {
            that.check();
            that.globalData.canCheck = false;
            // 30s内onshow不会再次请求,离开界面再进入就会触发onShow,扫码,确认微信用户信息等
            setTimeout(function() {
              that.globalData.canCheck = true;
            }, 30000);
          }
        } else {
          let success = function() {
            wx.navigateBack({
              delta: 0
            });
          };
          modal.modal("提示", "无网络服务，请检查网络后重试", false, success);
        }
      }
    });
  },

  // 检查更新
  check() {
    var that = this;
    // 获取第三方token
    storage
      .gets("3rd_session")
      .then(function(res) {
        console.log("3rd_session获取成功");
        // 更新数据,如果登陆过期code402,则重新登陆
        var url = "/vip/getCurrentVipUser";
        var data = {};
        var method = "GET";
        var header = {
          _yzsaas_token: res.data,
          "content-type": "application/x-www-form-urlencoded"
        };
        // 设置全局header
        that.globalData.header = {
          _yzsaas_token: res.data,
          "content-type": "application/x-www-form-urlencoded"
        };
        console.log(that.globalData.header);
        http
          .ajax(url, method, data, header)
          .then(function(res) {
            console.log("登录获取用户信息", res.data);
            if (res.data.code == "402") {
              console.log("登陆过期");
              that.login();
            } else {
              wx.setStorage({
                key: "allInfo",
                data: res.data.data
              });
            }
          })
          .catch(function(err) {
            console.log(err.errMsg);
            modal.modal("提示", "有点小问题，请重启小程序");
          });
      })
      .catch(function(err) {
        that.login();
      });
    // 获取用户信息
    // storage.gets("userInfo")
    //   .then(function (res) {})
    //   .catch(function () {
    //     that.getInfo();
    //   })
  },

  // 登录
  login() {
    var that = this;
    wx.login({
      success: res => {
        console.log(res.code);
        var url = "/login/vipLogin.do";
        var method = "POST";
        var data = {
          code: res.code
        };
        var header = {
          "content-type": "application/x-www-form-urlencoded"
        };
        http
          .ajax(url, method, data, header)
          .then(function(res) {
            console.log("登录vipLogin.do", res);
            wx.setStorage({
              key: "3rd_session",
              data: res.data.data.token,
              success: function() {
                that.getInfo();
                // 设置全局header
                that.globalData.header = {
                  _yzsaas_token: res.data.data.token,
                  "content-type": "application/x-www-form-urlencoded"
                };
              }
            });
            // 在这儿更新会员信息,更新缓存,allInfo
            var header = {
              _yzsaas_token: res.data.data.token,
              "content-type": "application/x-www-form-urlencoded"
            };
            update.updateuser(header);
          })
          .catch(function(error) {
            console.log(error);
            modal.modal("提示", "有点小问题，请重启小程序");
          });
      },
      fail(err) {
        console.log(err);
      }
    });
  },

  // 获取用户信息
  getInfo() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        var nick = res.userInfo.nickName;
        var avatar = String(res.userInfo.avatarUrl);
        var gender = String(res.userInfo.gender);
        wx.setStorage({
          key: "userInfo",
          data: res.userInfo
        });
        storage.gets("3rd_session").then(function(res) {
          var header = {
            _yzsaas_token: res.data,
            "content-type": "application/x-www-form-urlencoded"
          };
          wxInfo(header);
        });
        // 提交用户信息
        var wxInfo = function(header) {
          var url = "/vip/supplementInfo";
          var method = "POST";
          var data = {
            nickName: nick,
            avatarUrl: avatar,
            gender: gender
          };
          http.ajax(url, method, data, header).then(function(res) {
            console.log("提交微信信息", res);
            update.updateuser(header);
          });
        };
      },
      fail(err) {
        // 再次获取
      }
    });
  },

  // 拒绝后再次获取
  again() {
    var that = this;
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          var title = "提示";
          var content = "需要用户昵称和头像，不涉及隐私";
          var showCancel = false;
          var success = function(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function(res) {
                  if (res.authSetting["scope.userInfo"]) {
                    that.getInfo();
                  }
                }
              });
            }
          }; //success结束
          modal.modal(title, content, true, success);
        }
      },
      fail() {}
    });
  }
});
