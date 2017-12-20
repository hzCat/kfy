var util = require("../../utils/util.js");
var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var storage = require("../../utils/storage.js");
var turnto = require("../../utils/turnto.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    pOrg: 'personal',
    third: "",
    header: {},
    page: 1,
    isMore: true,
    vipScope: "",
    noOrder: true,
    modalOn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    storage.gets("3rd_session")
      .then(function (res) {
        that.setData({
          vipScope: options.vipScope,
          third: res.data,
          header: {
            '_yzsaas_token': res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        var url = "/vip/getVipCardRecordPaging"
        var method = "GET"
        var data = {
          vipScope: options.vipScope,
          page: that.data.page,
          rows: 14
        }
        var header = that.data.header
        http.ajax(url, method, data, header)
          .then(function (res) {
            var arr = res.data.data.rows;
            for (var i = 0; i < arr.length; i++) {
              var obj = arr[i];
              var time = obj.createTime;
              var money = obj.amount;
              var time2 = turnto.cuttime(time);
              var money2 = turnto.tostr(money);
              obj.createTime = time2;
              obj.amount = money2;
              arr[i] = obj;
            }
            that.setData({
              orderData: arr
            })
            if (arr.length == 14) {
              var p = that.data.page + 1
              that.setData({
                page: p,
                isMore: true,
                noOrder: false,
              })
            } else if (arr.length == 0) {
              that.setData({
                isMore: false,
                noOrder: true,
              })
            } else if (arr.length != 14) {
              that.setData({
                isMore: false,
                noOrder: false
              })
            }
          })
      })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    navbar.title("个卡明细");
    this.setData({
      modalOn: false,
    })
  },

  jump(e) {
    this.setData({
      modalOn: true,
    });
    var jump = e.currentTarget.dataset.jump;
    var pattern = e.currentTarget.dataset.pattern;
    util.jump(pattern, jump);
  },
  // 上拉刷新
  onReachBottom() {
    var that = this;
    var url = "/vip/getVipCardRecordPaging";
    var method = "GET";
    var data = {
      vipScope: that.data.vipScope,
      page: that.data.page,
      rows: 14
    };
    var header = that.data.header;
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
                var money = obj.amount;
                var time2 = turnto.cuttime(time);
                var money2 = turnto.tostr(money);
                obj.createTime = time2;
                obj.amount = money2;
                arr[i] = obj;
              }
              var arr2 = that.data.orderData;
              var arr3 = arr2.concat(arr)
              setTimeout(function () {
                that.setData({
                  orderData: arr3
                });
                if (arr.length == 14) {
                  var p = that.data.page + 1
                  that.setData({
                    page: p,
                    isMore: true
                  });
                } else if (arr.length != 14) {
                  that.setData({
                    isMore: false
                  });
                };
              }, 1000);
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