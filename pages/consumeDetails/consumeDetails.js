var util = require("../../utils/util.js");
var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var storage = require("../../utils/storage.js");
var modal = require("../../utils/modal.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    third: "",
    header: {},
    pattern: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    storage.gets("3rd_session")
      .then(function (res) {
        that.setData({
          pattern: options.type,
          third: res.data,
          header: {
            '_yzsaas_token': res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        var url = "/vip/getVipCardRecordDetail";
        var method = "GET";
        var data = {
          recordType: options.type,
          recordId: options.id
        }
        var header = that.data.header
        http.ajax(url, method, data, header)
          .then(function (res) {
            console.log(res.data.data)
            if (res.data.data.consumeRecordDetail) {
              that.setData({
                detail: res.data.data.consumeRecordDetail
              })
            }
            else if (res.data.data.rechargeRecordDetail) {
              that.setData({
                detail: res.data.data.rechargeRecordDetail
              })
            }
          })
          .catch((err) => {
            modal.modal("提示", "未能获取详情,请返回重试")
          })
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    navbar.title("消费明细")
  },

  jump(e) {
    console.log(e)
    var pattern = e.currentTarget.dataset.pattern;
    var jump = e.currentTarget.dataset.jump;
    util.jump(pattern, jump)
  }
})