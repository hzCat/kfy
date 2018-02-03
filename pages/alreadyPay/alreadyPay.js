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
    offDetail: null,
    type: "personal",
    groupDetail: null,
    status: null
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    var that = this;
    console.log(options);
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    if (options.type == "group") {
      this.setData({
        type: options.type
      });
    }
    var url = "/vipOrder/getOrderDetail";
    var method = "GET";
    var data = {
      orderId: options.id
    };
    var header = app.globalData.header;
    // 获取详情
    http.ajax(url, method, data, header).then(function(res) {
      // console.log(res.data.data);
      console.log(res.data.data.offerDetailList);
      if (res.data.data.offerDetailList) {
        let off = res.data.data.offerDetailList;
        console.log(res.data.data);
        // 优惠信息转换
        let arr = offColor.turn(off);

        if (res.data.data.deliveryInfoResponse) {
          that.setData({
            orderDetail: res.data.data,
            offDetail: arr,
            groupDetail: res.data.data.deliveryInfoResponse,
            status: res.data.data.orderStatus
          });
        } else {
          that.setData({
            orderDetail: res.data.data,
            offDetail: arr,
            status: res.data.data.orderStatus
          });
        }
        // 设置顶部title
        navbar.title(res.data.data.orderStatusDisplayName);
      } else {
        console.log(res.data.data);
        if (res.data.data.deliveryInfoResponse) {
          that.setData({
            orderDetail: res.data.data,
            groupDetail: res.data.data.deliveryInfoResponse,
            status: res.data.data.orderStatus
          });
        } else {
          that.setData({
            orderDetail: res.data.data,
            status: res.data.data.orderStatus
          });
        }
        // 设置顶部title
        navbar.title(res.data.data.orderStatusDisplayName);
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
