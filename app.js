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
    staticUrl: null,
    header: {},
    serviceNumber: "",
    timer: 0,
    test: 1
  },
  // 全局加载一次
  onLaunch: function() {
    var that = this;
    that.globalData.canCheck = true;
    console.log("当前版本,v2.0");
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

    this.getServiceNum();
  },
  // 获取服务号码
  getServiceNum() {
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
            that.getStaticUrl();
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
    // 检查登陆状态
    wx.checkSession({
      success: function() {
        console.log("checksession_success");
        // 获取第三方token
        storage
          .gets("3rd_session")
          .then(function(res) {
            console.log("3rd_session获取成功");
            // 更新数据,如果登陆过期code402,则重新登陆
            var url = "/vip/getCurrentVipUser";
            console.log(res.data);
            var header = {
              // _yzsaas_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIzIiwiZXhwaXJlVGltZSI6MTUxODE1Njc2MjEwMiwic2Vzc2lvbktleSI6IkprYVhna0xYVXVGWU5KbElqUjhPQVE9PSIsInN1YlBsYXRmb3JtIjoiV0VDSEFSVCIsImNyZWF0ZVRpbWUiOjE1MTc1NTE5NjIxMDIsInRoaXJkSWQiOiJvSl8ySDBZUlRLeEcyU2k2YjlFODY3ZDRtQ1BBIiwib3BlbklkIjoib1ZjMFIwUmgtLVlvSE1FMzN1bXctZVJVSFVtUSIsIm1vYmlsZSI6bnVsbCwibG9naW5TY29wZSI6IlZJUCJ9.lQz1veJ_X3URsBwp30w0z6ebB2LvT0UYWRBxkBrGAP8",
              _yzsaas_token: res.data,
              "content-type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest"
            };
            // 设置全局header
            that.globalData.header = header;
            console.log(that.globalData.header);
            http
              .ajax(url, "GET", {}, header)
              .then(function(res) {
                console.log("登录获取用户信息", res.data);
                // if (res.data.code == 402) {
                //   console.log("登陆过期");
                //   that.login();
                // } else
                if (res.data.code == 200) {
                  console.log("成功获取allInfo");
                  storage.sets("allInfo", res.data.data);
                }
              })
              .catch(function(err) {
                console.log(err.errMsg);
                modal.modal("提示", "有点小问题，请重启小程序");
              });
          })
          .catch(function(err) {
            let timer = that.globalData.timer;
            if (timer < 5) {
              setTimeout(() => {
                that.login();
                that.globalData.timer = timer + 1;
              }, 500);
            } else {
              modal.modal("提示", "网络差");
            }
          });
      },
      fail: function() {
        console.log("checksession_fail");
        //登录态过期
        that.login(); //重新登录
      }
    });
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
                  "content-type": "application/x-www-form-urlencoded",
                  "X-Requested-With": "XMLHttpRequest"
                };
              }
            });
            // 在这儿更新会员信息,更新缓存,allInfo
            var header = {
              _yzsaas_token: res.data.data.token,
              "content-type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest"
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
        modal.modal("提示", "网络差,登录失败");
      }
    });
  },

  // 获取用户信息
  getInfo() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        var nick = res.userInfo.nickName;
        var avatar = "" + res.userInfo.avatarUrl;
        var gender = "" + res.userInfo.gender;
        wx.setStorage({
          key: "userInfo",
          data: res.userInfo
        });
        storage.gets("3rd_session").then(function(res) {
          var header = {
            _yzsaas_token: res.data,
            "content-type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
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
  },
  // 获取静态地址(正式版更换为static.kongfuy.cn)
  getStaticUrl() {
    let that = this;
    storage
      .gets("staticUrl")
      .then(function(res) {
        that.globalData.staticUrl = res.data.url;
      })
      .catch(err => {
        http.ajax("/common/staticDomain").then(function(res) {
          console.log(res.data);
          var obj = {};
          obj.url = res.data;
          that.globalData.staticUrl = res.data;
          storage.sets("staticUrl", obj);
        });
      });
  }
});
