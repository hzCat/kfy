var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var modal = require("../../utils/modal.js");
var jump = require("../../utils/jump.js");
var pay = require("../../utils/pay.js");
var update = require("../../utils/update.js");
Page({
  /*** 页面的初始数据*/
  data: {
    moneyArr: [],
    nowMoney: 100,
    isVip: "false",
    isFifty: null,
    third: "",
    header: {},
    vipScope: "",
    chargeInfo: {},
    // vipLevelId: null,
    allDisable: false,
    buy: false,
    modalOn: false,
    getNumber: false,
    currentLevel: null,
    nextGetLevel: null,
    nextNeed: null,
    willGetLevel: null
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    var that = this;
    console.log("充值页面得到参数", options);
    that.setData({
      nowMoney: options.money,
      isVip: options.isVip,
      vipScope: options.by,
      // vipLevelId: options.level,
      buy: options.buy
    });
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
        // 金额列表
        that.getMoneyList(options.by, that.data.header);
        // vip信息
        that.getVipInfo(options.by, options.money, that.data.header);
      }
    });
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function() {
    // navbar.title("充值");
    this.setData({
      modalOn: false,
      getNumber: false
    });
  },

  // 获取充值金额列表
  getMoneyList(vip, head) {
    let that = this;
    let url = "/recharge/getRechargeAmtList";
    let method = "GET";
    let data = {
      vipScope: vip
    };
    let header = head;
    http.ajax(url, method, data, header).then(res => {
      console.log(res.data);
      let arr = res.data.data;
      // 修改价格选项顺序
      function ab(a, b) {
        return a - b;
      }
      arr.sort(ab);
      that.setData({
        moneyArr: arr
      });
    });
  },

  // 获取充值金额相关的vip信息
  getVipInfo(vip, money, head) {
    let that = this;
    let url = "/recharge/getVipLevelByRechargeAmt";
    let method = "GET";
    let data = {
      vipScope: vip,
      rechargeAmt: that.data.nowMoney
    };
    let header = head;
    http.ajax(url, method, data, header).then(res => {
      console.log(res.data);
      if (res.data.code == 612) {
        that.setData({
          getNumber: true
        });
      } else if (res.data.code == 200) {
        that.setData({
          chargeInfo: res.data.data,
          nextGetLevel: res.data.data.nextGetVipLevel,
          nextNeed: res.data.data.nextLevelNeedAmt,
          willGetLevel: res.data.data.willGetVipLevel,
          currentLevel: res.data.data.currentVipLevel
        });
      }
    });
  },

  // 选择金额,修改充值金额相关信息
  chooseMoney(e) {
    var that = this;
    this.setData({
      nowMoney: e.target.dataset.money,
      isFifty: null
    });
    that.getVipInfo(
      that.data.vipScope,
      e.target.dataset.money,
      that.data.header
    );
  },

  // 输入框充值
  chooseMoneyInput(e) {
    var that = this;
    var money = e.detail.value;

    // 50的倍数
    // if (money % 50 == 0) {
      this.setData({
        nowMoney: money
      });
      that.getVipInfo(that.data.vipScope, e.detail.value, that.data.header);
    // } else {
    //   wx.showModal({
    //     title: "提示",
    //     content: "请输入50的倍数",
    //     showCancel: false,
    //     success: function(res) {
    //       if (res.confirm) {
    //         console.log("用户点击确定");
    //         that.setData({
    //           isFifty: null
    //         });
    //       }
    //     }
    //   });
    // }
  },

  // 同意协议按钮
  checkValue(e) {
    console.log("获取checkValue", e.detail.isCheck);
    let checked = e.detail.isCheck;
    if (checked) {
      this.setData({
        allDisable: false
      });
    } else {
      this.setData({
        allDisable: true
      });
    }
  },
  // 微信支付按钮
  wechatPay() {
    var that = this;
    var method = "GET";
    var header = that.data.header;

    that.setData({
      modalOn: true
    });
    // 是否是购买的,不是
    if (that.data.buy == "false") {
      console.log(this.data.nowMoney);
      var url = "/recharge/wxRecharge";
      var data = {
        vipScope: that.data.vipScope,
        rechargeAmt: that.data.nowMoney
      };
      http
        .ajax(url, method, data, header)
        .then(function(res) {
          console.log(res.data);
          if (res.data.data) {
            var orderId = res.data.data.orderId;
          }
          var json = res.data.data;
          // 微信支付接口
          if (res.data.code == 200 && res.data.result == true) {
            pay
              .wpay(json)
              .then(function(res) {
                // 查询提示框,在跳转前结束
                that.setData({
                  modalOn: false
                });
                wx.showLoading({
                  title: "查询中",
                  mask: true
                });
                // 定时查询结果,2s
                setTimeout(function() {
                  pay
                    .chargeback(orderId, header)
                    .then(function(res) {
                      console.log(res.data);
                      // 更新用户信息
                      let obj = res.data;
                      let money = obj.tradeResponse.rechargeAmt;
                      let orderNo = obj.tradeResponse.orderNo;
                      let gift = obj.tradeResponse.rechargeGiftAmt;
                      let after = obj.tradeResponse.currentBalance;
                      // SUCCESS订单(isSucc,money,orderId,gift,after)
                      if (obj.tradeStatus == "SUCCESS") {
                        update.updateuser(header);
                        // 关闭提示框
                        wx.hideLoading();
                        jump.jump(
                          "redirect",
                          `/pages/chargeSuccFail/chargeSuccFail?isBuy=false&isSucc=true&money=${money}&orderNo=${orderNo}&gift=${gift}&after=${after}`
                        );
                        // FAIL ERROR订单(isSucc,orderId)
                      } else if (
                        obj.tradeStatus == "FAILED" ||
                        obj.data.TradeStatus == "ERROR"
                      ) {
                        wx.hideLoading();
                        jump.jump(
                          "nav",
                          `/pages/chargeSuccFail/chargeSuccFail?isBuy=false&isSucc=false&orderNo=${orderNo}`
                        );
                        //UNKNOWN状态订单
                      } else if (obj.tradeStatus == "UNKNOWN") {
                        // 第二次查询,3s
                        setTimeout(function() {
                          pay
                            .chargeback(res.data.data.orderId, header)
                            .then(function(res) {
                              let obj = res.data;
                              let money = obj.tradeResponse.rechargeAmt;
                              let orderNo = obj.tradeResponse.orderNo;
                              let gift = obj.tradeResponse.rechargeGiftAmt;
                              let after = obj.tradeResponse.currentBalance;
                              // 成功
                              if (obj.tradeStatus == "SUCCESS") {
                                update.updateuser(header);
                                wx.hideLoading();
                                jump.jump(
                                  "redirect",
                                  `/pages/chargeSuccFail/chargeSuccFail?isBuy=false&isSucc=true&money=${money}&orderNo=${orderNo}&gift=${gift}&after=${after}`
                                );
                                // FAIL ERROR订单(isSucc,orderId)
                              } else {
                                wx.hideLoading();
                                jump.jump(
                                  "nav",
                                  `/pages/chargeSuccFail/chargeSuccFail?isBuy=false&isSucc=false&orderNo=${orderNo}`
                                );
                              }
                            })
                            .catch(err => {
                              // 第二次查询err
                              console.log(err);
                            });
                        }, 3000);
                      }
                    })
                    .catch(err => {
                      //第一次查询err
                      console.log(err);
                    });
                }, 2000);
              })
              .catch(err => {
                //微信支付err
                that.setData({
                  modalOn: false
                });
                console.log(err);
              });
          } else if (res.data.code == 612) {
            that.setData({
              getNumber: true
            });
          } else {
            that.setData({
              modalOn: false
            });
            modal.modal("提示", "充值失败");
          }
        })
        .catch(err => {
          that.setData({
            modalOn: false
          });
        });
    }
    // 是否是购买的,是
    // else if (that.data.buy == "true") {
    //   var data = {
    //     vipLevelId: that.data.vipLevelId
    //   };
    //   var url = "/recharge/rechargeBuyVip";
    //   http.ajax(url, method, data, header)
    //     .then(function (res) {
    //       console.log(res.data)
    //       let orderId=res.data.data.orderId;
    //       if (res.data.code == 200 && res.data.result == true) {
    //         var json = res.data.data;
    //         // 微信支付接口
    //         pay.wpay(json)
    //           .then(function (res) {
    //             console.log(res.data)
    //             wx.showLoading({
    //               title: '查询中',
    //               mask: true,
    //             })
    //             // 定时查询结果,4s
    //             setTimeout(function () {
    //               pay.chargeback(orderId, header)
    //                 .then(function (res) {
    //                   console.log(res.data)
    //                   // 更新用户信息
    //                   let obj = res.data;
    //                   let money = obj.tradeResponse.rechargeAmt;
    //                   let orderNo = obj.tradeResponse.orderNo;
    //                   let gift = obj.tradeResponse.rechargeGiftAmt;
    //                   let after = obj.tradeResponse.currentBalance;
    //                   // SUCCESS订单(isSucc,money,orderId,gift,after)
    //                   if (obj.tradeStatus == "SUCCESS") {
    //                     update.updateuser(header);
    //                     wx.hideLoading();
    //                     jump.jump("redirect", `/pages/chargeSuccFail/chargeSuccFail?isBuy=true&isSucc=true&money=${money}&orderNo=${orderNo}&gift=${gift}&after=${after}`)
    //                     // FAIL ERROR订单(isSucc,orderId)
    //                   } else if (obj.tradeStatus == "FAILED" || obj.tradeStatus == "ERROR") {
    //                     wx.hideLoading();
    //                     jump.jump("nav", `/pages/chargeSuccFail/chargeSuccFail?isBuy=true&isSucc=false&orderNo=${orderNo}`);
    //                     //UNKNOWN状态订单
    //                   } else if (obj.tradeStatus == "UNKNOWN") {
    //                     // 第二次查询,3s
    //                     setTimeout(function () {
    //                       pay.chargeback(orderId, header)
    //                         .then(function (res) {
    //                           let obj = res.data;
    //                           let money = obj.tradeResponse.rechargeAmt;
    //                           let orderNo = obj.tradeResponse.orderNo;
    //                           let gift = obj.tradeResponse.rechargeGiftAmt;
    //                           let after = obj.tradeResponse.currentBalance;
    //                           // 成功
    //                           if (obj.tradeStatus == "SUCCESS") {
    //                             update.updateuser(header);
    //                             wx.hideLoading();
    //                             jump.jump("redirect", `/pages/chargeSuccFail/chargeSuccFail?isBuy=true&isSucc=true&money=${money}&orderNo=${orderNo}&gift=${gift}&after=${after}`)
    //                             // FAIL ERROR订单(isSucc,orderId)
    //                           } else {
    //                             wx.hideLoading();
    //                             jump.jump("nav", `/pages/chargeSuccFail/chargeSuccFail?isBuy=true&isSucc=false&orderNo=${orderNo}`);
    //                           }
    //                         })
    //                         .catch(err => { // 第二次查询err
    //                           console.log(err);
    //                         })
    //                     }, 3000)
    //                   }
    //                 })
    //                 .catch(err => { //第一次查询err
    //                   console.log(err)
    //                 })
    //             }, 2000)
    //           })
    //           .catch(err => { //微信支付err
    //             console.log(err)
    //           })
    //       } else {
    //         modal.modal("提示", "购买失败")
    //       }

    //     })
    //     .catch(function (err) {
    //       console.log(err)
    //     })
    // }
  },



  // 获取手机号码（微信）
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
                  var jump = "/pages/chargeMoney/chargeMoney";
                  setTimeout(function() {
                    jump.jump(pattern, jump);
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

  // 关闭手机号模态框
  closeGetNumber() {
    this.setData({
      modalOn: false,
      getNumber: false
    });
  }
});
