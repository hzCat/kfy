let app = getApp();
let http = require("../../utils/ajax.js");
let jump = require("../../utils/jump.js");
let offColor = require("../../utils/offColor.js");
let cardturn = require("../../utils/cardTurn.js");
let pay = require("../../utils/pay.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    foodMore: 4,
    discountMore: false,
    payOption: "WECHART",
    by: null,
    orderData: null,
    offMoney: {},
    offDetail: [],
    cardList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("待支付获取App.js中的header", app.globalData.header);
    console.log(options);
    let by = options.by;
    let plateNo = options.plateNo;
    let id = options.id;
    if (by == "scan") {
      this.getOrder(by, plateNo);
    } else if (by == "orderlist") {
      this.getOrder(by, id);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 拉取订单数据
  getOrder(by, myData) {
    let that = this;
    let header = app.globalData.header;
    let scanUrl = "/vipOrder/findOrder";
    let listUrl = "/vipOrder/getOrderDetail";
    if (by == "scan") {
      if (myData != "undefined") {
        let data = { plateNo: myData };
        http.ajax(scanUrl, "GET", data, header).then(res => {
          console.log("获取扫码订单数据", res.data);
          if (res.data.code == 200 && res.data.data != null) {
            that.setData({
              orderData: res.data.data,
              offMoney: res.data.data
            });
            // 获取可用卡
            that.getUserCard(res.data.data.storeId, true);
          } else {
            that.noOrder(by);
          }
        });
      } else {
        this.noOrder(by);
      }
    } else if (by == "orderlist") {
      let data = {
        orderId: myData
      };
      http.ajax(listUrl, "GET", data, header).then(res => {
        console.log("订单进入拉取数据", res.data);
        if (res.data.code == 200 && res.data.data != null) {
          that.setData({
            orderData: res.data.data,
            offMoney: res.data.data
          });
          that.getUserCard(res.data.data.storeId, false);
        } else {
          that.noOrder(by);
        }
      });
    } else {
      that.noOrder();
    }
  },
  // 获取可用卡
  getUserCard(storeId, offmoney) {
    let that = this;
    let url = "/vipPayment/getCardInfoList";
    let method = "GET";
    let data = {
      storeId: storeId
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      console.log("可用卡", res.data);
      // 命名不同,判断一下
      // if (res.data.data.defaultPayChannel != "WECHART") {
      let arr = cardturn.turn(res.data.data.settlementInfoList);
      console.log("转换之后的可用卡", arr);
      that.setData({
        cardList: arr,
        payOption: res.data.data.defaultPayChannel
      });
      // } else if (res.data.data.defaultPayChannel == "WECHART") {
      //   that.setData({
      //     cardList: res.data.data,
      //     payOption: "wechat"
      //   });
      // }
      //是否获取优惠
      if (offmoney) {
        that.getDiscount(
          that.data.orderData.id,
          res.data.data.defaultPayChannel
        );
      }
    });
  },
  // 获取优惠
  getDiscount(id, payChannel) {
    let that = this;
    let url = "/vipPayment/quickPayPre";
    let method = "GET";
    let data = {
      id: id,
      payChannel: payChannel
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      console.log("优惠信息", res.data);
      // 如果存在
      if (res.data.data) {
        let offlist = res.data.data.offerList;
        let arr = offColor.turn(offlist);
        that.setData({
          orderData: res.data.data.orderResponseList[0],
          offMoney: res.data.data,
          offDetail: arr
        });
      }
    });
  },
  // 查不到订单
  noOrder(by) {
    jump.jump("redirect", `/pages/hasNoOrder/hasNoOrder?by=${by}`);
  },
  // //扫描进入查询订单
  // orderByScan(plateNo) {
  //   let url = "/vipOrder/findOrder";
  //   let data = { plateNo: plateNo };
  //   http.ajax(url, "GET", data, app.globalData.header).then(res => {
  //     console.log("扫码查询订单", res.data);
  //   });
  // },
  // //订单页进入查询订单
  // orderByList(id) {
  //   let url = "/vipOrder/getOrderDetail";
  //   let data = { orderId: id };
  //   http.ajax(url, "GET", data, app.globalData.header).then(res => {
  //     console.log("订单页查询订单", res.data);
  //   });
  // },

  // 切换支付频道
  payOption(e) {
    let that = this;
    let option = e.currentTarget.dataset.option;
    let id = this.data.orderData.id;
    this.setData({
      payOption: option
    });
    console.log("当前支付频道", this.data.payOption);
    let url = "/vipPayment/quickPayPre";
    let data = {
      id: id,
      payChannel: option
    };
    http.ajax(url, "GET", data, app.globalData.header).then(res => {
      console.log(`${option}下的优惠信息`, res.data);
      that.setData({
        offMoney: res.data.data
      });
    });
  },
  // 显示更多
  showMore(e) {
    let type = e.currentTarget.dataset.type;
    // let food = !this.data.foodMore;
    let discount = !this.data.discountMore;
    let length = this.data.orderData.detailList.length;
    if (type == "food") {
      if (this.data.foodMore == 4) {
        this.setData({
          foodMore: length
        });
      } else {
        this.setData({
          foodMore: 4
        });
      }
    } else if (type == "discount") {
      this.setData({
        discountMore: discount
      });
    }
  },
  // 支付按钮
  payClick() {
    let that = this;
    // 遮罩
    // that.setData({
    //   modalOn: true,
    // });

    // 微信
    if (this.data.payOption == "WECHART") {
      let url = "/vipPayment/wxaPrePay";
      let method = "GET";
      let data = {
        orderId: that.data.orderData.id
      };
      console.log("支付按钮获取订单id", that.data.orderData.id);
      http
        .ajax(url, method, data, app.globalData.header)
        .then(function(res) {
          console.log(res);
          let code = res.data.code;
          let result = res.data.result;
          let json = res.data.data;
          console.log(json);
          // 调用微信支付
          if (json.sendRequest == true) {
            if (code == 200 && result == true) {
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
                          wx.hideLoading();
                          jump.jump(
                            "redirect",
                            `/pages/paysuccess/paysuccess?by=wechat&isSucc=true&money=${money}&orderId=${orderNo}`
                          );
                          // FAIL ERROR订单(by,isSucc,orderId)
                        } else if (
                          obj.tradeStatus == "FAILED" ||
                          obj.tradeStatus == "ERROR"
                        ) {
                          wx.hideLoading();
                          jump.jump(
                            "nav",
                            `/pages/paysuccess/paysuccess?by=wechat&isSucc=false&orderId=${orderNo}`
                          );
                          //UNKNOWN状态订单
                        } else if (obj.tradeStatus == "UNKNOWN") {
                          // 二次查询,3s
                          setTimeout(function() {
                            // 查询订单支付结果
                            pay
                              .payback(that.data.orderData.id, app.globalData.header)
                              .then(function(res) {
                                console.log("微信支付结果");
                                console.log(res.data);
                                let obj = res.data;
                                let money = obj.tradeResponse.payAmt;
                                let orderNo = obj.tradeResponse.orderNo;
                                // SUCCESS订单(by,isSucc,money,orderId)
                                if (obj.tradeStatus == "SUCCESS") {
                                  wx.hideLoading();
                                  jump.jump(
                                    "redirect",
                                    `/pages/paysuccess/paysuccess?by=wechat&money=${money}&orderId=${orderNo}`
                                  );
                                  // FAIL ERROR订单(by,isSucc,orderId)
                                } else {
                                  wx.hideLoading();
                                  jump.jump(
                                    "nav",
                                    `/pages/paysuccess/paysuccess?by=wechat&isSucc=false&orderId=${orderNo}`
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
            } else if (code == 400) {
              modal.modal("提示", "订单不存在");
            } else if (code == 402) {
              modal.modal("提示", "登录过期,请重启应用");
            } else if (code == 5012) {
              modal.modal("提示", "订单已过期");
            } else {
              modal.modal("提示", "系统异常");
            }
          } else if (json.sendRequest == false) {
            // 查询提示框,在跳转前结束
            wx.showLoading({
              title: "查询中",
              mask: true
            });
            setTimeout(function() {
              // 查询支付结果
              pay
                .payback(that.data.orderData.id, app.globalData.header)
                .then(function(res) {
                  console.log("微信支付结果", res.data);
                  let obj = res.data;
                  let money = obj.tradeResponse.payAmt;
                  let orderNo = obj.tradeResponse.orderNo;
                  // SUCCESS订单(by,isSucc,money,orderId)
                  if (obj.tradeStatus == "SUCCESS") {
                    wx.hideLoading();
                    jump.jump(
                      "redirect",
                      `/pages/paysuccess/paysuccess?by=wechat&isSucc=true&money=${money}&orderId=${orderNo}`
                    );
                    // FAIL ERROR订单(by,isSucc,orderId)
                  } else if (
                    obj.tradeStatus == "FAILED" ||
                    obj.tradeStatus == "ERROR"
                  ) {
                    wx.hideLoading();
                    jump.jump(
                      "nav",
                      `/pages/paysuccess/paysuccess?by=wechat&isSucc=false&orderId=${orderNo}`
                    );
                    //UNKNOWN状态订单
                  } else if (obj.tradeStatus == "UNKNOWN") {
                    // 二次查询,3s
                    setTimeout(function() {
                      // 查询订单支付结果
                      pay
                        .payback(that.data.orderData.id, app.globalData.header)
                        .then(function(res) {
                          console.log("微信支付结果", res.data);
                          let obj = res.data;
                          let money = obj.tradeResponse.payAmt;
                          let orderNo = obj.tradeResponse.orderNo;
                          // SUCCESS订单(by,isSucc,money,orderId)
                          if (obj.tradeStatus == "SUCCESS") {
                            wx.hideLoading();
                            jump.jump(
                              "redirect",
                              `/pages/paysuccess/paysuccess?by=wechat&money=${money}&orderId=${orderNo}`
                            );
                            // FAIL ERROR订单(by,isSucc,orderId)
                          } else {
                            wx.hideLoading();
                            jump.jump(
                              "nav",
                              `/pages/paysuccess/paysuccess?by=wechat&isSucc=false&orderId=${orderNo}`
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
        })
        .catch(function(err) {
          // 遮罩关闭
          that.setData({
            modalOn: false
          });
        });

      // 个人vip
    } else if (this.data.payOption == "VIP_CARD") {
      var data = {
        orderId: that.data.orderData.id,
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
            orderNo = res.data.data.orderNo;
            money = res.data.data.payAmt;
          }
          if (result == true && code == 200 && orderNo != null) {
            update.updateuser(app.globalData.header);
            jump.jump(
              "redirect",
              `/pages/paysuccess/paysuccess?by=card&isSucc=true&money=${money}&orderId=${orderNo}`
            );
          } else {
            jump.jump(
              "nav",
              `/pages/paysuccess/paysuccess?by=card&isSucc=false&code=${code}&orderId=${orderNo}`
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

      // 团餐vip
    } else if (this.data.payOption == "TVIP_CARD") {
      var data = {
        orderId: that.data.orderData.id,
        payChannel: "TVIP_CARD"
      };
      var header = app.globalData.header;
      pay
        .vpay(data, header)
        .then(function(res) {
          console.log(res);
          // 遮罩
          that.setData({
            modalOn: false
          });
          let result = res.data.result;
          let code = res.data.code;
          let orderNo = res.data.data;
          if (result == true && code == 200 && orderNo != null) {
            jump.jump(
              "redirect",
              `/pages/paysuccess/paysuccess?by=card&isSucc=true&money=${money}&orderId=${orderNo}`
            );
          } else {
            jump.jump(
              "nav",
              `/pages/paysuccess/paysuccess?by=card&isSucc=false&code=${code}`
            );
          }
        })
        .catch(function(err) {
          // 遮罩
          that.setData({
            modalOn: false
          });
          modal.modal("提示", "请检查网络状况");
        });
    }
  }
});
