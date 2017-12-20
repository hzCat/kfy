var util = require("../../utils/util.js");
var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var turnto = require("../../utils/turnto.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    third: "",
    header: {},
    page: 1,
    isMore: true,
    noOrder: true,
    modalOn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    var that = this;
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        that.setData({
          third: res.data,
          header: {
            '_yzsaas_token': res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        // 获取订单列表
        var url = "/vipOrder/findOrderPaging";
        var method = "GET";
        var data = {
          page: that.data.page,
          rows: 14
        }
        var header = that.data.header
        http.ajax(url, method, data, header)
          .then(function (res) {
            console.log(res.data);
            var arr = res.data.data.rows;
            for (var i = 0; i < arr.length; i++) {
              var obj = arr[i];
              var time = obj.createTime;
              var money = obj.payAmt;
              var money2 = turnto.tostr(money);
              var time2 = turnto.cuttime(time);
              obj.payAmt = money2;
              obj.createTime = time2
              arr[i] = obj;
            }
            that.setData({
              orderList: arr
            })
            if (arr.length == 14) {
              var p = that.data.page + 1
              that.setData({
                page: p,
                isMore: true,
                noOrder: false
              })
            } else if (arr.length == 0) {
              that.setData({
                noOrder: true,
                isMore: false,
              })
            } else if (arr.length != 14 || arr.length != 0) {
              that.setData({
                isMore: false,
                noOrder: false
              })
            }
          })
      },
    })
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    let that = this;
    // navbar.title("我的订单");
    that.setData({
      modalOn: false,
    })
  },

  //跳转
  jump(e) {
    let that = this;
    that.setData({
      modalOn: true,
    })
    var pattern = e.currentTarget.dataset.pattern;
    var jump = e.currentTarget.dataset.jump;
    util.jump(pattern, jump);
  },

  // 上拉刷新
  onReachBottom() {
    var that = this;
    var url = "/vipOrder/findOrderPaging";
    var method = "GET";
    var data = {
      page: that.data.page,
      rows: 14
    }
    var header = that.data.header
    if (that.data.isMore != false) {


      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          http.ajax(url, method, data, header)
            .then(function (res) {
              var arr = res.data.data.rows;
              for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                var time = obj.createTime;
                var money = obj.payAmt;
                var money2 = turnto.tostr(money);
                var time2 = turnto.cuttime(time);
                obj.payAmt = money2;
                obj.createTime = time2
                arr[i] = obj;
              }
              var arr2 = that.data.orderList;
              var arr3 = arr2.concat(arr)
              setTimeout(function () {
                that.setData({
                  orderList: arr3
                })
                if (arr.length == 14) {
                  var p = that.data.page + 1
                  that.setData({
                    page: p,
                    isMore: true
                  })
                } else if (arr.length != 14) {
                  that.setData({
                    isMore: false
                  })
                }
              }, 1000)
            })
          // 关闭加载框
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      })
    }
  }
})