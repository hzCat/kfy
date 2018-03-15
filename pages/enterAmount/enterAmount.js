// pages/enterAmount/enterAmount.js
let app = getApp();
let http = require("../../utils/ajax");
let jump = require("../../utils/jump");
let modal = require("../../utils/modal");
let turn = require("../../utils/turnto");
let storage = require("../../utils/storage");
let cardturn = require("../../utils/cardTurn");
let update = require("../../utils/update");
let pay = require("../../utils/pay");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeCode: null,
    isLogin: false,
    storeAll: null,
    nowStore: null,
    money: null,
    second_step: false,
    select_card: "WECHART",
    json_header: null,
    calc_money: null,
    calc_all: null,
    orderId: null,
    cardList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let storeCode = options.storeCode;
    let n = 0;

    wx.showLoading({
      title: "获取当前门店中",
      mask: true
    });

    var timer = setInterval(() => {
      if (app.globalData.header) {
        clearInterval(timer);
        timer = null;
        this.setData({
          storeCode: storeCode,
          isLogin: true
        });
        this.jsonHeader();
        this.getStore(storeCode);
      } else if (n == 20) {
        clearInterval(timer);
        timer = null;
        this.setData({
          storeCode: storeCode
        });
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        modal.modal("提示", "获取失败,请重新扫码");
      }
      n++;
      console.log(`第${n}次`);
    }, 500);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  jsonHeader() {
    storage.gets("3rd_session").then(res => {
      console.log(res.data);
      let header = {
        "X-Requested-With": "XMLHttpRequest",
        "content-type": "application/json",
        _yzsaas_token: res.data
      };
      this.setData({
        json_header: header
      });
    });
  },
  // 获取门店选项
  getStore(storeCode) {
    http
      .ajax("/vipCommon/storeItem", "GET", {}, app.globalData.header)
      .then(res => {
        console.log(res.data);
        let obj = res.data.data;
        this.getNowStore(obj, storeCode);
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
      })
      .catch(err => {
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        modal.modal("提示", "门店获取失败,请重新扫码");
      });
  },
  // 获取当前门店
  getNowStore(obj, storeCode) {
    let code = storeCode;
    let store = obj;
    let length = store.length;
    let thisStore = null;
    for (let i = 0; i < length; i++) {
      let one = store[i];
      if (one.codeNo == code) {
        thisStore = one;
      }
    }
    console.log(thisStore);
    this.setData({
      nowStore: thisStore
    });
    if (!thisStore) {
      modal.modal("提示", "门店ID错误", false, () => {
        jump.jump("back");
      });
    }
  },
  // 获取输入金额
  inputMoney(e) {
    wx.showLoading({
      title: "计算结算金额中",
      mask: true
    });
    let that = this;
    let money = turn.tostr(e.detail.value);
    let json = JSON.stringify({
      storeId: that.data.nowStore.codeId,
      orderAmt: e.detail.value
    });
    console.log(json);
    http
      .ajax("/wxaCodeOrder/payPre", "POST", json, that.data.json_header)
      .then(res => {
        console.log(res.data.data);
        let payAmt = turn.tostr(res.data.data.payAmt);
        // 如果有优惠,优惠列表设置缓存
        if (res.data.data.totalOfferAmt > 0) {
          let list = { offerList: res.data.data.offerList };
          storage.sets("enterAmountOfferList", list).then(res => {});
        }
        setTimeout(() => {
          that.setData(
            {
              calc_money: payAmt,
              calc_all: res.data.data
            },
            () => {
              wx.hideLoading();
            }
          );
        }, 1000);
      })
      .catch(err => {
        console.log(err);
      });
    this.setData({
      money: money
    });
  },
  // 清空金额
  clearMoney() {
    this.setData({
      calc_money: null
    });
  },
  // 提交
  submit() {
    let that = this;
    if (this.data.calc_money) {
      http
        .ajax(
          "/wxaCodeOrder/create",
          "POST",
          {
            storeId: that.data.nowStore.codeId,
            orderAmt: that.data.calc_all.orderAmt
          },
          app.globalData.header
        )
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            let orderId = res.data.data;
            this.getUserCard(orderId);
            let second_step = true;
            this.setData({
              second_step: second_step,
              orderId: orderId
            });
          } else {
            modal.modal("提示", res.data.message);
          }
        });
    }
  },
  // 切换卡片
  chooseCard(e) {
    let option = e.currentTarget.dataset.card;
    if (this.data.select_card != option) {
      console.log(option);
      this.setData({
        select_card: option
      });
    }
  },
  // 获取订单选项
  getCardOptions(orderId) {
    http
      .ajax(
        "/vipPayment/getCardInfoList",
        "GET",
        { orderId: orderId },
        app.globalData.header
      )
      .then(res => {
        console.log(res.data);
      });
  },
  // 获取可用卡
  getUserCard(orderId) {
    let that = this;
    let url = "/vipPayment/getCardInfoList";
    let method = "GET";
    let data = {
      orderId: orderId
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      console.log("可用卡", res.data);
      // 命名不同,判断一下
      // if (res.data.data.defaultPayChannel != "WECHART") {
      let arr = cardturn.turn(res.data.data.settlementInfoList);
      console.log("转换之后的可用卡", arr);
      that.setData({
        cardList: arr,
        select_card: res.data.data.defaultPayChannel
      });
    });
  },
  offerDetail() {
    jump.jump("nav", "/pages/enterAmountOffer/enterAmountOffer");
  },
  // 支付按钮
  payClick() {
    let that = this;
    // 遮罩
    that.setData({
      modalOn: true
    });

    // 微信
    if (this.data.select_card == "WECHART") {
      let url = "/vipPayment/wxaPrePay";
      let method = "GET";
      let data = {
        orderId: that.data.orderId
      };
      console.log("支付按钮获取订单id", that.data.orderId);
      http
        .ajax(url, method, data, app.globalData.header)
        .then(function(res) {
          console.log(res);
          let code = res.data.code;
          let result = res.data.result;
          let json = res.data.data;
          console.log(json);
          // 调用微信支付
          if (code == 200 && result == true) {
            if (json.sendRequest == true) {
              pay
                .wpay(json)
                .then(function(res) {
                  console.log(res);
                  // 遮罩关闭
                  // that.setData({
                  //   modalOn: false
                  // });
                  // 查询提示框,在跳转前结束
                  wx.showLoading({
                    title: "查询中",
                    mask: true
                  });
                  // 支付结果查询,第一次查询,4s
                  setTimeout(function() {
                    // 查询支付结果
                    pay
                      .payback(json.settlementId, app.globalData.header)
                      .then(function(res) {
                        console.log("微信支付结果", res.data);
                        let obj = res.data;
                        let money = obj.tradeResponse.payAmt;
                        let orderNo = obj.tradeResponse.orderList[0].orderNo;
                        // SUCCESS订单(by,isSucc,money,orderId)
                        if (obj.tradeStatus == "SUCCESS") {
                          update.updateuser(app.globalData.header);
                          wx.hideLoading();
                          jump.jump(
                            "redirect",
                            `/pages/afterPay/afterPay?by=wechat&isSucc=true&money=${money}&orderId=${orderNo}&type=${
                              that.data.type
                            }&enter=${that.data.enter}`
                          );
                          // FAIL ERROR订单(by,isSucc,orderId)
                        } else if (
                          obj.tradeStatus == "FAILED" ||
                          obj.tradeStatus == "ERROR"
                        ) {
                          wx.hideLoading();
                          jump.jump(
                            "nav",
                            `/pages/afterPay/afterPay?by=wechat&isSucc=false&orderId=${orderNo}&enter=${
                              that.data.enter
                            }`
                          );
                          //UNKNOWN状态订单
                        } else if (obj.tradeStatus == "UNKNOWN") {
                          // 二次查询,3s
                          setTimeout(function() {
                            // 查询订单支付结果
                            pay
                              .payback(json.settlementId, app.globalData.header)
                              .then(function(res) {
                                console.log("微信支付结果");
                                console.log(res.data);
                                let obj = res.data;
                                let money = obj.tradeResponse.payAmt;
                                let orderNo =
                                  obj.tradeResponse.orderList[0].orderNo;
                                // SUCCESS订单(by,isSucc,money,orderId)
                                if (obj.tradeStatus == "SUCCESS") {
                                  update.updateuser(app.globalData.header);
                                  wx.hideLoading();
                                  jump.jump(
                                    "redirect",
                                    `/pages/afterPay/afterPay?by=wechat&money=${money}&orderId=${orderNo}&type=${
                                      that.data.type
                                    }&enter=${that.data.enter}`
                                  );
                                  // FAIL ERROR订单(by,isSucc,orderId)
                                } else {
                                  wx.hideLoading();
                                  jump.jump(
                                    "nav",
                                    `/pages/afterPay/afterPay?by=wechat&isSucc=false&orderId=${orderNo}&enter=${
                                      that.data.enter
                                    }`
                                  );
                                }
                              })
                              .catch(err => {
                                console.log(err);
                              });
                          }, 3000); //二次查询
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }, 2000); //一次查询
                })
                .catch(function(err) {
                  // 遮罩关闭
                  that.setData({
                    modalOn: false
                  });
                  // modal.modal("提示", "调用微信支付失败");
                });
            } else if (json.sendRequest == false) {
              // 查询提示框,在跳转前结束
              wx.showLoading({
                title: "查询中",
                mask: true
              });
              setTimeout(function() {
                // 查询支付结果
                pay
                  .payback(json.settlementId, app.globalData.header)
                  .then(function(res) {
                    console.log("微信支付结果", res.data);
                    let obj = res.data;
                    let money = null;
                    let orderNo = null;
                    if (obj.tradeResponse) {
                      money = obj.tradeResponse.payAmt;
                      orderNo = obj.tradeResponse.orderList[0].orderNo;
                    }
                    // SUCCESS订单(by,isSucc,money,orderId)
                    if (obj.tradeStatus == "SUCCESS") {
                      update.updateuser(app.globalData.header);
                      wx.hideLoading();
                      jump.jump(
                        "redirect",
                        `/pages/afterPay/afterPay?by=wechat&isSucc=true&money=${money}&orderId=${orderNo}&type=${
                          that.data.type
                        }&enter=${that.data.enter}`
                      );
                      // FAIL ERROR订单(by,isSucc,orderId)
                    } else if (
                      obj.tradeStatus == "FAILED" ||
                      obj.tradeStatus == "ERROR"
                    ) {
                      wx.hideLoading();
                      jump.jump(
                        "nav",
                        `/pages/afterPay/afterPay?by=wechat&isSucc=false&orderId=${orderNo}&enter=${
                          that.data.enter
                        }`
                      );
                      //UNKNOWN状态订单
                    } else if (obj.tradeStatus == "UNKNOWN") {
                      // 二次查询,3s
                      setTimeout(function() {
                        // 查询订单支付结果
                        pay
                          .payback(json.settlementId, app.globalData.header)
                          .then(function(res) {
                            console.log("微信支付结果", res.data);
                            let obj = res.data;
                            let money = obj.tradeResponse.payAmt;
                            let orderNo =
                              obj.tradeResponse.orderList[0].orderNo;
                            // SUCCESS订单(by,isSucc,money,orderId)
                            if (obj.tradeStatus == "SUCCESS") {
                              update.updateuser(app.globalData.header);
                              wx.hideLoading();
                              jump.jump(
                                "redirect",
                                `/pages/afterPay/afterPay?by=wechat&money=${money}&orderId=${orderNo}&type=${
                                  that.data.type
                                }&enter=${that.data.enter}`
                              );
                              // FAIL ERROR订单(by,isSucc,orderId)
                            } else {
                              wx.hideLoading();
                              jump.jump(
                                "nav",
                                `/pages/afterPay/afterPay?by=wechat&isSucc=false&orderId=${orderNo}&enter=${
                                  that.data.enter
                                }`
                              );
                            }
                          })
                          .catch(err => {
                            console.log(err);
                          });
                      }, 3000); //二次查询
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }, 2000); //一次查询
            }
          } else if (code == 400) {
            modal.modal("提示", "订单不存在");
          } else if (code == 402) {
            modal.modal("提示", "登录过期,请重启应用");
          } else if (code == 5012) {
            modal.modal("提示", "订单已过期");
          } else {
            modal.modal("提示", "系统异常");
          }
        })
        .catch(function(err) {
          // 遮罩关闭
          that.setData({
            modalOn: false
          });
        });

      // 个人vip
    } else if (this.data.select_card == "VIP_CARD") {
      var data = {
        orderId: that.data.orderId,
        payChannel: "VIP_CARD"
      };
      var header = app.globalData.header;
      // 个人卡支付
      pay
        .vpay(data, header)
        .then(function(res) {
          console.log("会员卡支付回调", res.data);
          // 遮罩
          that.setData({
            modalOn: false
          });
          let result = res.data.result;
          let code = res.data.code;
          let orderNo = null;
          let money = null;
          if (res.data.data) {
            orderNo = res.data.data.orderList[0].orderNo;
            money = res.data.data.payAmt;
          }
          if (result == true && code == 200 && orderNo != null) {
            update.updateuser(app.globalData.header);
            jump.jump(
              "redirect",
              `/pages/afterPay/afterPay?by=card&isSucc=true&money=${money}&orderId=${orderNo}&type=${
                that.data.type
              }&enter=${that.data.enter}`
            );
          } else {
            jump.jump(
              "nav",
              `/pages/afterPay/afterPay?by=card&isSucc=false&code=${code}&orderId=${orderNo}&enter=${
                that.data.enter
              }`
            );
          }
        })
        .catch(function(err) {
          console.log(err);
          // 遮罩
          that.setData({
            modalOn: false
          });
          modal.modal("提示", "请检查网络状况");
        });
    }
  }
});
