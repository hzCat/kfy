// pages/out/outIndex/outIndex.js
let app = getApp();
let http = require("../../../utils/ajax");
let modal = require("../../../utils/modal");
let jump = require("../../../utils/jump");
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMyLocation();
    // this.againMyLocation();
  },
  getMyLocation() {
    let that = this;
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
      },
      fail() {
        that.againMyLocation();
      }
    });
  },
  againMyLocation() {
    let that = this;
    wx.getSetting({
      success: res => {
        console.log(res);
        if (!res.authSetting["scope.userLocation"]) {
          var title = "提示";
          var content = "外卖功能需要获取您当前位置";
          var showCancel = false;
          var success = function(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function(res) {
                  if (res.authSetting["scope.userLocation"]) {
                    console.log(res);
                    // that.getMyLocation();
                  }
                }
              });
            }
          }; //success结束
          modal.modal(title, content, true, success);
        }
      },
      fail() {}
    });
  },
  getDistance(lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;
    return (
      r *
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
        )
      )
    );
  }
});
