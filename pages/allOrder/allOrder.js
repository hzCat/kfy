// pages/allOrder/allOrder.js
let jump = require("../../utils/jump.js");
let navbar = require("../../utils/navbar.js");
let http = require("../../utils/ajax.js");
let turnto = require("../../utils/turnto.js");
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 1,
    isMore: true,
    noOrder: true,
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 获取订单列表
    var url = "/vipOrder/findOrderPaging";
    var method = "GET";
    var data = {
      page: that.data.page,
      rows: 14
    };
    var header = app.globalData.header;
    http.ajax(url, method, data, header).then(function(res) {
      console.log(res.data);
      var arr = res.data.data.rows;
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        // var time = obj.createTime;
        var money = obj.payAmt;
        var money2 = turnto.tostr(money);
        // var time2 = turnto.cuttime(time);
        obj.payAmt = money2;
        // obj.createTime = time2;
        arr[i] = obj;
      }
      console.log(arr);
      that.setData({
        orderList: arr
      });
      if (arr.length == 14) {
        var p = that.data.page + 1;
        that.setData({
          page: p,
          isMore: true,
          noOrder: false
        });
      } else if (arr.length == 0) {
        that.setData({
          noOrder: true,
          isMore: false
        });
      } else if (arr.length != 14 || arr.length != 0) {
        that.setData({
          isMore: false,
          noOrder: false
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 上拉刷新
  onReachBottom() {
    var that = this;
    var url = "/vipOrder/findOrderPaging";
    var method = "GET";
    var data = {
      page: that.data.page,
      rows: 14
    };
    var header = app.globalData.header;
    if (that.data.isMore != false) {
      wx.showLoading({
        title: "加载中",
        mask: true,
        success: function() {
          http.ajax(url, method, data, header).then(function(res) {
            var arr = res.data.data.rows;
            console.log(arr)
            if (arr) {
              for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                // var time = obj.createTime;
                var money = obj.payAmt;
                var money2 = turnto.tostr(money);
                // var time2 = turnto.cuttime(time);
                obj.payAmt = money2;
                // obj.createTime = time2;
                arr[i] = obj;
              }
              var arr2 = that.data.orderList;
              var arr3 = arr2.concat(arr);
              setTimeout(function() {
                that.setData({
                  orderList: arr3
                });
                if (arr.length == 14) {
                  var p = that.data.page + 1;
                  that.setData({
                    page: p,
                    isMore: true
                  });
                } else if (arr.length != 14) {
                  that.setData({
                    isMore: false
                  });
                }
                wx.hideLoading();
              }, 2000);
            }
          });
          // 关闭加载框
          // setTimeout(function() {
          //   wx.hideLoading();
          // }, 1000);
        }
      });
    }
  },
  jump(e) {
    this.setData({
      modalOn:true
    })
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});
