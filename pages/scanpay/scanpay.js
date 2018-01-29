var http = require("../../utils/ajax.js");
var navbar = require("../../utils/navbar.js");
var util = require("../../utils/util.js");
var pay = require("../../utils/pay.js");
var update = require("../../utils/update.js");
var modal = require("../../utils/modal.js");
Page({
  /*** 页面的初始数据*/
  data: {
    payTime: "",
    third: "",
    header: {},
    orderData: {},
    showNum: 4,
    choosePay: "wechat",
    fourHour: false,
    orderTime: 0,
    cardList: [],
    offMoney: {},
    modalOn: false
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    var that = this;
    console.log(options);
    //无法识别跳转无订单页
    var noOrder = function(by) {
      var pattern = "redirect";
      var jump = "/pages/hasNoOrder/hasNoOrder?by=" + by;
      util.jump(pattern, jump);
    };
    // 获取可用卡,offMoney为TRUE或者FALSE
    var getUserCard = function(storeId, head, offmoney) {
      var url = "/vipPayment/getCardInfoList";
      var method = "GET";
      var data = {
        storeId: storeId
      };
      var header = head;
      http.ajax(url, method, data, header).then(function(res) {
        console.log(res.data.data);
        // 命名不同,判断一下
        if (res.data.data.defaultPayChannel != "WECHART") {
          that.setData({
            cardList: res.data.data,
            choosePay: res.data.data.defaultPayChannel
          });
        } else if (res.data.data.defaultPayChannel == "WECHART") {
          that.setData({
            cardList: res.data.data,
            choosePay: "wechat"
          });
        }
        // 获取优惠
        if (offmoney) {
          var url = "/vipPayment/quickPayPre"; //new
          var method = "GET";
          var header = that.data.header;
          var data = {
            id: that.data.orderData.id,
            payChannel: res.data.data.defaultPayChannel
          };
          http.ajax(url, method, data, header).then(function(res) {
            console.log("首次结算预览", res.data.data);
            if (res.data.data) {
              that.setData({
                orderData: res.data.data.orderResponseList[0],
                offMoney: res.data.data
              });
            }
          });
        }
      });
    };
    // 从缓存获的session
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
        // 请求公用
        var method = "GET";
        var header = that.data.header;
        // 判断订单来源
        if (options.by == "scan") {
          //扫描进入
          if (options.plateNo != "undefined") {
            var url = "/vipOrder/findOrder";
            var data = {
              plateNo: options.plateNo
            };
            http
              .ajax(url, method, data, header)
              .then(function(res) {
                console.log(res.data);
                // 请求正常且有data值
                if (res.data.code == 200 && res.data.data != null) {
                  that.setData({
                    orderData: res.data.data
                  });
                  getUserCard(res.data.data.storeId, header, true);
                } else {
                  noOrder(options.by);
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          } else {
            noOrder();
          }
        } else if (options.by == "orderlist") {
          //订单页面进入
          var url = "/vipOrder/getOrderDetail";
          var data = {
            orderId: options.id
          };
          http.ajax(url, method, data, header).then(function(res) {
            console.log(res.data.data);
            // 请求正常且有data值
            if (res.data.code == 200 && res.data.data != null) {
              that.setData({
                orderData: res.data.data,
                offMoney: res.data.data
              });
              getUserCard(res.data.data.storeId, header, false);
            } else {
              noOrder(options.by);
            }
          });
        } else {
          noOrder();
        }
      }
    });
  },

  /** 生命周期函数--监听页面显示*/
  onShow: function() {
    // navbar.title("支付");
    this.setData({
      modalOn: false
    });
  },

  // 显示更多
  showMore() {
    var length = this.data.orderData.detailList.length;
    console.log(length);
    if (this.data.showNum == 4) {
      this.setData({
        showNum: length
      });
    } else {
      this.setData({
        showNum: 4
      });
    }
  },

  // 支付选项
  choosePay(e) {
    var that = this;
    var choose = e.currentTarget.dataset.payment;
    this.setData({
      choosePay: choose,
      modalOn: true
    });
    // 调整优惠
    // var url = "/vipPayment/calcOrderOffer";
    var url = "/vipPayment/quickPayPre"; //new
    var method = "GET";
    var header = this.data.header;
    // vip
    if (choose == "VIP_CARD") {
      var data = {
        id: this.data.orderData.id,
        payChannel: "VIP_CARD"
      };
      http
        .ajax(url, method, data, header)
        .then(function(res) {
          console.log(res.data);
          that.setData({
            offMoney: res.data.data,
            modalOn: false
          });
        })
        .catch(err => {
          that.setData({
            modalOn: false
          });
        });
      // tvip
    } else if (choose == "TVIP_CARD") {
      var data = {
        id: this.data.orderData.id,
        payChannel: "TVIP_CARD"
      };
      http
        .ajax(url, method, data, header)
        .then(function(res) {
          console.log(res.data);
          that.setData({
            offMoney: res.data.data,
            modalOn: false
          });
        })
        .catch(err => {
          that.setData({
            modalOn: false
          });
        });
      // 微信
    } else if (choose == "wechat") {
      var data = {
        id: this.data.orderData.id,
        payChannel: "WECHART"
      };
      http
        .ajax(url, method, data, header)
        .then(function(res) {
          console.log(res.data);
          that.setData({
            offMoney: res.data.data,
            modalOn: false
          });
        })
        .catch(err => {
          that.setData({
            modalOn: false
          });
        });
    }
  },

  // 支付按钮
  payClick() {
    var that = this;
    // 遮罩
    that.setData({
      modalOn: true
    });

    // 微信
    if (this.data.choosePay == "wechat") {
      let url = "/vipPayment/wxaPrePay";
      let method = "GET";
      let data = {
        orderId: that.data.orderData.id
      };
      console.log(that.data.orderData.id);
      let header = that.data.header;
      http
        .ajax(url, method, data, header)
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
                  that.setData({
                    modalOn: false
                  });
                  // 查询提示框,在跳转前结束
                  wx.showLoading({
                    title: "查询中",
                    mask: true
                  });
                  // 支付结果查询,第一次查询,4s
                  setTimeout(function() {
                    // 查询支付结果
                    pay
                      .payback(json.settlementId, that.data.header)
                      .then(function(res) {
                        console.log("微信支付结果");
                        console.log(res.data);
                        let obj = res.data;
                        let money = obj.tradeResponse.payAmt;
                        let orderNo = obj.tradeResponse.orderList[0].orderNo;
                        // SUCCESS订单(by,isSucc,money,orderId)
                        if (obj.tradeStatus == "SUCCESS") {
                          wx.hideLoading();
                          util.jump(
                            "redirect",
                            `/pages/paysuccess/paysuccess?by=wechat&isSucc=true&money=${money}&orderId=${orderNo}`
                          );
                          // FAIL ERROR订单(by,isSucc,orderId)
                        } else if (
                          obj.tradeStatus == "FAILED" ||
                          obj.tradeStatus == "ERROR"
                        ) {
                          wx.hideLoading();
                          util.jump(
                            "nav",
                            `/pages/paysuccess/paysuccess?by=wechat&isSucc=false&orderId=${orderNo}`
                          );
                          //UNKNOWN状态订单
                        } else if (obj.tradeStatus == "UNKNOWN") {
                          // 二次查询,3s
                          setTimeout(function() {
                            // 查询订单支付结果
                            pay
                              .payback(that.data.orderData.id, that.data.header)
                              .then(function(res) {
                                console.log("微信支付结果");
                                console.log(res.data);
                                let obj = res.data;
                                let money = obj.tradeResponse.payAmt;
                                let orderNo = obj.tradeResponse.orderNo;
                                // SUCCESS订单(by,isSucc,money,orderId)
                                if (obj.tradeStatus == "SUCCESS") {
                                  wx.hideLoading();
                                  util.jump(
                                    "redirect",
                                    `/pages/paysuccess/paysuccess?by=wechat&money=${money}&orderId=${orderNo}`
                                  );
                                  // FAIL ERROR订单(by,isSucc,orderId)
                                } else {
                                  wx.hideLoading();
                                  util.jump(
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
                .payback(that.data.orderData.id, that.data.header)
                .then(function(res) {
                  console.log("微信支付结果");
                  console.log(res.data);
                  let obj = res.data;
                  let money = obj.tradeResponse.payAmt;
                  let orderNo = obj.tradeResponse.orderNo;
                  // SUCCESS订单(by,isSucc,money,orderId)
                  if (obj.tradeStatus == "SUCCESS") {
                    wx.hideLoading();
                    util.jump(
                      "redirect",
                      `/pages/paysuccess/paysuccess?by=wechat&isSucc=true&money=${money}&orderId=${orderNo}`
                    );
                    // FAIL ERROR订单(by,isSucc,orderId)
                  } else if (
                    obj.tradeStatus == "FAILED" ||
                    obj.tradeStatus == "ERROR"
                  ) {
                    wx.hideLoading();
                    util.jump(
                      "nav",
                      `/pages/paysuccess/paysuccess?by=wechat&isSucc=false&orderId=${orderNo}`
                    );
                    //UNKNOWN状态订单
                  } else if (obj.tradeStatus == "UNKNOWN") {
                    // 二次查询,3s
                    setTimeout(function() {
                      // 查询订单支付结果
                      pay
                        .payback(that.data.orderData.id, that.data.header)
                        .then(function(res) {
                          console.log("微信支付结果");
                          console.log(res.data);
                          let obj = res.data;
                          let money = obj.tradeResponse.payAmt;
                          let orderNo = obj.tradeResponse.orderNo;
                          // SUCCESS订单(by,isSucc,money,orderId)
                          if (obj.tradeStatus == "SUCCESS") {
                            wx.hideLoading();
                            util.jump(
                              "redirect",
                              `/pages/paysuccess/paysuccess?by=wechat&money=${money}&orderId=${orderNo}`
                            );
                            // FAIL ERROR订单(by,isSucc,orderId)
                          } else {
                            wx.hideLoading();
                            util.jump(
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
    } else if (this.data.choosePay == "VIP_CARD") {
      var data = {
        orderId: that.data.orderData.id,
        payChannel: "VIP_CARD"
      };
      var header = that.data.header;
      // 个人卡支付
      pay
        .vpay(data, header)
        .then(function(res) {
          console.log("会员卡支付回调", res);
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
            update.updateuser(that.data.header);
            util.jump(
              "redirect",
              `/pages/paysuccess/paysuccess?by=card&isSucc=true&money=${money}&orderId=${orderNo}`
            );
          } else {
            util.jump(
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
    } else if (this.data.choosePay == "TVIP_CARD") {
      var data = {
        orderId: that.data.orderData.id,
        payChannel: "TVIP_CARD"
      };
      var header = that.data.header;
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
            util.jump(
              "redirect",
              `/pages/paysuccess/paysuccess?by=card&isSucc=true&money=${money}&orderId=${orderNo}`
            );
          } else {
            util.jump(
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
