var http = require("../../utils/ajax.js");
var navbar = require("../../utils/navbar.js");
var offColor = require("../../utils/offColor.js");
let app = getApp();
Page({
  /*** 页面的初始数据*/
  data: {
    orderDetail: {},
    showNum: 4,
    third: "",
    header: {},
    offDetail: []
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    var that = this;
    console.log(options);
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    var url = "/vipOrder/getOrderDetail";
    var method = "GET";
    var data = {
      orderId: options.id
    };
    var header = app.globalData.header;
    http.ajax(url, method, data, header).then(function(res) {
      // console.log(res.data.data);
      if (res.data.data.offerDetailList) {
        let off = res.data.data.offerDetailList;
        console.log(res.data.data);
        // 优惠信息转换
        let arr = offColor.turn(off);
        that.setData({
          orderDetail: res.data.data,
          offDetail: arr
        });
      } else {
        that.setData({
          orderDetail: res.data.data
        });
      }
      // 关闭加载中
      wx.hideLoading();
    });
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function() {
    // navbar.title("订单详情")
  },

  showMore() {
    var length = this.data.orderDetail.detailList.length;
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
  }
});
