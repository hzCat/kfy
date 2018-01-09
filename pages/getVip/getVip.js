var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var modal = require("../../utils/modal.js");
var util = require("../../utils/util.js");
var pay = require("../../utils/pay.js");
var update = require("../../utils/update.js");

Page({
  /*** 页面的初始数据*/
  data: {
    userType: "personal",
    third: "",
    header: {},
    allInfo: {},
    vipCardList: {},
    tvipCardList: {},
    checkbox: true,
    allDisable: false,
    movex: 0,
    isVip: false,
    isTvip: false,
    openedLevel: null,
    tOpenedLevel: null,
    modalOn: false,
    getNumber: false,
    webview: false,
    hasTvip:false
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    var that = this;
    console.log(options);
    if (options.userType) {
      that.setData({
        userType: options.userType
      });
    }

    wx.getStorage({
      key: "3rd_session",
      success: function(res) {
        that.setData({
          third: res.data,
          header: {
            _yzsaas_token: res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        });
        var url = "/vip/getVipLevelList";
        var method = "GET";
        var data = {
          vipScope: "VIP"
        };
        var data2 = {
          vipScope: "TVIP"
        };
        var header = that.data.header;
        // 获取个卡信息
        http
          .ajax(url, method, data, header)
          .then(function(res) {
            console.log("个人会员列表信息", res.data.data);
            let list = res.data.data;
            let isVip = null;
            let openedLevel = null;
            // 是否是VIP,且是多少的VIP等级
            for (let i = 0; i < list.length; i++) {
              if (list[i].opened == true) {
                isVip = true;
                openedLevel = i;
                break;
              }
            }
            console.log("个人会员开通等级", openedLevel);
            that.setData({
              isVip: isVip,
              openedLevel: openedLevel,
              vipCardList: res.data.data
            });
          })
          .catch(function(err) {
            let success = () => {
              util.jump("redirect", "/pages/vipBag/vipBag");
            };
            modal.modal("提示", "未获取到会员信息", false, success);
          });

        // 获取团卡信息
        http.ajax(url, method, data2, header).then(function(res) {
          console.log("团餐会员列表信息", res.data.data);
          let list = res.data.data;
          let isTvip = null;
          let tOpenedLevel = null;
          // 是否是VIP,且是多少的VIP等级
          for (let i = 0; i < list.length; i++) {
            if (list[i].opened == true) {
              isTvip = true;
              tOpenedLevel = i;
              break;
            }
          }
          console.log("团餐会员开通等级", tOpenedLevel);
          that.setData({
            isTvip: isTvip,
            tOpenedLevel: tOpenedLevel,
            tvipCardList: res.data.data
          });
        });
      }
    });
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function() {
    let that = this;
    if (that.data.userType == "personal") {
      navbar.title("个人会员卡办理");
    } else {
      navbar.title("团餐会员卡办理");
    }
    this.setData({
      modalOn: false,
      getNumber: false,
      webview: false
    });
    // 获取用户信息
    wx.getStorage({
      key: "allInfo",
      success: function(res) {
        console.log("用户信息", res.data);
        console.log("用户拥有卡列表", res.data.vipCardList);
        let list=res.data.vipCardList;
        let length=list.length;
        let hasTvip=false;
        for(let i=0;i<length;i++){
          let obj=list[i];
          if(obj.vipScope=="TVIP"){
            hasTvip=true;
          }
        }
        that.setData({
          allInfo: res.data,
          hasTvip:hasTvip
        });
      }
    });
  },

  // 横滑切换
  //     触摸开始
  tstart(e) {
    this.setData({
      movex: e.changedTouches[0].clientX
    });
  },

  //     触摸结束
  tend(e) {
    let end = e.changedTouches[0].clientX;
    let start = this.data.movex;
    if (end - start < -150 && this.data.userType == "personal") {
      navbar.title("团餐会员卡办理");
      this.setData({
        userType: "group"
      });
    } else if (end - start > 150 && this.data.userType == "group") {
      navbar.title("个人会员卡办理");
      this.setData({
        userType: "personal"
      });
    }
  },

  // 用户协议
  checkbox(e) {
    console.log(e.detail.value[0]);
    if (e.detail.value[0] != undefined) {
      this.setData({
        allDisable: false
      });
    } else {
      this.setData({
        allDisable: true
      });
    }
  },

  // 切换页
  switchPage(e) {
    var name = e.currentTarget.dataset.usertype;
    if (name == "personal") {
      navbar.title("个人会员卡办理");
    } else {
      navbar.title("团餐会员卡办理");
    }
    this.setData({
      userType: name
    });
  },

  //跳转
  jump(e) {
    this.setData({
      modalOn: true
    });
    wx.redirectTo({
      url: e.currentTarget.dataset.jump
    });
  },

  //获取协议文档
  getDoc() {
    wx.downloadFile({
      url:
        "http://192.168.1.146:11811/group1/M00/00/01/wKgBkloeYFyAdaptAABP-yHX5mA65_big.docx",
      success: function(res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function(res) {
            console.log("打开文档成功");
          }
        });
      }
    });
  },

  //购买vip服务
  buyVip(e) {
    let that = this;
    that.setData({
      modalOn: true
    });
    let level = e.currentTarget.dataset.level;
    let levelName = e.currentTarget.dataset.lname;
    let data = {
      vipLevelId: level
    };
    let url = "/recharge/rechargeBuyVip";
    let header = that.data.header;
    let method = "GET";
    http
      .ajax(url, method, data, header)
      .then(function(res) {
        console.log(res);
        let orderId = null;
        if (res.data.data) {
          orderId = res.data.data.orderId;
        }
        let code = res.data.code;
        let result = res.data.result;
        if (res.data.code == 612 && res.data.result == false) {
          //未绑定手机号码提示绑定
          console.log("未绑定手机号码");
          that.setData({
            modalOn: false,
            getNumber: true
          });
        } else if (res.data.code == 200 && res.data.result == true) {
          let json = res.data.data;
          // 微信支付接口
          pay
            .wpay(json)
            .then(function(res) {
              console.log(res);
              // 提示
              wx.showLoading({
                title: "查询中",
                mask: true,
                success() {
                  that.setData({
                    modalOn: false
                  });
                }
              });
              // 定时器,4s
              setTimeout(function() {
                pay.chargeback(orderId, header).then(function(res) {
                  let obj = res.data;
                  let orderNo = obj.tradeResponse.orderNo;
                  if (obj.tradeStatus == "SUCCESS") {
                    update.updateuser(header);
                    wx.hideLoading();
                    util.jump(
                      "redirect",
                      `/pages/afterBuyVip/afterBuyVip?isBuy=true&isSucc=true&name=${levelName}&orderNo=${orderNo}`
                    );
                  } else if (
                    obj.tradeStatus == "FAILED" ||
                    obj.tradeStatus == "ERROR"
                  ) {
                    wx.hideLoading();
                    util.jump(
                      "nav",
                      `/pages/afterBuyVip/afterBuyVip?isBuy=true&isSucc=false&orderNo=${orderNo}`
                    );
                  } else if (obj.tradeStatus == "UNKNOWN") {
                    // 第二次查询,3s
                    setTimeout(function() {
                      pay
                        .chargeback(orderId, header)
                        .then(function(res) {
                          let obj = res.data;
                          let orderNo = obj.tradeResponse.orderNo;
                          // 成功
                          if (obj.tradeStatus == "SUCCESS") {
                            update.updateuser(header);
                            wx.hideLoading();
                            util.jump(
                              "redirect",
                              `/pages/afterBuyVip/afterBuyVip?isBuy=true&isSucc=true&name=${levelName}&orderNo=${orderNo}`
                            );
                            // FAIL ERROR订单(isSucc,orderId)
                          } else {
                            wx.hideLoading();
                            util.jump(
                              "nav",
                              `/pages/afterBuyVip/afterBuyVip?isBuy=true&isSucc=false&orderNo=${orderNo}`
                            );
                          }
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    }, 3000);
                  }
                });
              }, 2000);
            })
            .catch(err => {
              // 未支付离开,关闭遮罩
              that.setData({
                modalOn: false
              });
            });
        } else if (res.data.code == 500) {
          that.setData({
            modalOn: false
          });
          modal.modal("提示", "购买失败");
        }
      })
      .catch(err => {
        that.setData({
          modalOn: false
        });
      });
  },

  // 获取手机号（微信）
  getPhoneNumber: function(e) {
    var that = this;
    that.setData({
      modalOn: true
    });
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      var url = "/vipCenter/bindMobileWithWX";
      var method = "POST";
      var data = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      };
      var header = that.data.header;
      http
        .ajax(url, method, data, header)
        .then(function(res) {
          that.setData({
            modalOn: false,
            getNumber: false
          });
          console.log(res.data);
          var url = "/vip/getCurrentVipUser";
          var data = {};
          var method = "GET";
          var header = that.data.header;
          http
            .ajax(url, method, data, header)
            .then(function(res) {
              console.log(res);
              wx.setStorage({
                key: "allInfo",
                data: res.data.data,
                success: function(res) {
                  var pattern = "redirect";
                  var jump = "/pages/getVip/getVip";
                  setTimeout(function() {
                    util.jump(pattern, jump);
                  }, 500);
                }
              });
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(function(err) {
          that.setData({
            modalOn: false
          });
          modal.modal("提示", "手机号绑定失败,请重试");
        });
    } else {
      that.setData({
        modalOn: false,
        getNumber: false
      });
    }
  },

  // 关闭弹窗
  closeGetNumber() {
    this.setData({
      modalOn: false,
      getNumber: false
    });
  },

  // 打开web-view,另一种实现用户协议的方法
  openweb() {
    this.setData({
      webview: true
    });
  }
});
