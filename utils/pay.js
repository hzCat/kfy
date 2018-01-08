var http = require("./ajax.js");

// 微信支付
var wpay = function (payJson) {
  var json = payJson;
  return new Promise(function (res, rej) {
    wx.requestPayment({
      timeStamp: json.timeStamp,
      nonceStr: json.nonceStr,
      package: json.prePaypackage,
      signType: json.signType,
      paySign: json.paySign,
      success: res,
      fail: rej
    });
  });
};

// 会员卡支付
var vpay = function (data, header) {
  var url = "/vipPayment/vipCardPay";
  var method = "GET";
  return new Promise(function (res, rej) {
    http.ajax(url, method, data, header)
      .then(res)
      .catch(rej)
  });
};

// 微信支付结果查询
var payback = function (oId, head) {
  var url = "/vipPayment/afterOrderPayQuery";
  var method = "GET";
  var data = {
    settlementId: oId
  };
  var header = head;
  return new Promise(function (res, rej) {
    http.ajax(url, method, data, header)
      .then(res)
      .catch(rej)
  })
};


// 会员卡充值结果查询
var chargeback = function (oId, head) {
  var url = "/recharge/afterRechargeQuery";
  var data = {
    orderId: oId
  };
  var method = "GET";
  var header = head;
  return new Promise(function (res, rej) {
    http.ajax(url, method, data, header)
      .then(res)
      .catch(rej)
  });
}

// 团餐卡充值

var tvipcharge = function (data, head) {
  let url = '/recharge/tvipApply'
  let method = "POST";
  let header = head;
  return new Promise(function (res, rej) {
    http.ajax(url, method, data, header)
      .then(res)
      .catch(rej)
  })

}

module.exports = {
  wpay: wpay,
  vpay: vpay,
  payback: payback,
  chargeback: chargeback,
  tvipcharge:tvipcharge
}