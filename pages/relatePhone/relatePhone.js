var util = require("../../utils/util.js");
var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var modal = require("../../utils/modal.js");
Page({

  /*** 页面的初始数据*/
  data: {
    phoneNumber: null,
    testNumber: null,
    isTest: true,
    isSixty: false,
    isSixtyTimer: "",
    timer60: null,
    textInfo: "发送验证码",
    third: "",
    header: {},
    modalOn: false,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
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
      },
    });
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    // navbar.title("绑定手机");
    this.setData({
      modalOn: false,
    })
  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {
    var that = this;
    clearInterval(that.data.timer60)
  },

  // 电话号码获取
  inputPhoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  //   发送验证码
  sendTestNumber() {
    var that = this;
    that.setData({
      modalOn: true,
    })
    if (/^1[3456789]\d{9}$/.test(this.data.phoneNumber)) {
      // 请求验证码
      var url = "/vipCenter/getBindCode";
      var method = 'GET';
      var data = {
        mobile: this.data.phoneNumber
      };
      var header = that.data.header;
      http.ajax(url, method, data, header)
        .then(function (res) {
          console.log(res);
          that.setData({
            modalOn: false,
          })
          var title = "提示";
          if (res.data.code == 200) {
            var content = "短信已发送,请注意接收";
          } else if (res.data.code == 650 || res.data.code == 414) {
            var content = "不支持的手机号";
          } else if (res.data.code == 610) {
            var content = "手机号已绑定";
          } else {
            var content = "暂时无法绑定,请稍后再试";
          }
          modal.modal(title, content);
        })
        .catch(err => {
          that.setData({
            modalOn: false,
          })
        })
      that.oneMinute()
      // var now = 60;
      // that.setData({
      //   isSixty: true,
      //   textInfo: "重新获取"
      // });
      // // 获取短信倒计时定时器
      // var timer = setInterval(function () {
      //   that.setData({
      //     isSixtyTimer: now + "s",
      //     timer60: timer
      //   })
      //   if (now == 0) {
      //     clearInterval(that.data.timer60)
      //     that.setData({
      //       timer60: null,
      //       textInfo: "发送验证码",
      //       isSixtyTimer: "",
      //       isSixty: false,
      //     })
      //   }
      //   now--;
      // }, 1000)
    } else { //  手机号正则不通过
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
      })
    }


  },

  // 获取验证码等待一分钟
  oneMinute() {
    let that = this;
    let now = 60;
    that.setData({
      isSixty: true,
      textInfo: "重新获取"
    });
    // 获取短信倒计时定时器
    let timer = setInterval(function () {
      that.setData({
        isSixtyTimer: now + "s",
        timer60: timer
      })
      if (now == 0) {
        clearInterval(that.data.timer60)
        that.setData({
          timer60: null,
          textInfo: "发送验证码",
          isSixtyTimer: "",
          isSixty: false,
        })
      }
      now--;
    }, 1000)
  },

  // 绑定按钮是否启用
  textTestInput(e) {
    this.setData({
      testNumber: e.detail.value,
    })
    if (this.data.phoneNumber && this.data.testNumber) {
      this.setData({
        isTest: false,
      })
    }
  },

  // 绑定手机按钮
  relate() {
    var that = this;

    // 绑定手机
    var url = "/vipCenter/bindMobile";
    var method = "POST";
    var data = {
      mobile: this.data.phoneNumber,
      code: this.data.testNumber
    };
    var header = that.data.header;

    http.ajax(url, method, data, header)
      .then(function (res) {
        console.log(res)
        if (res.data.code == 413) {
          modal.modal("提示", "验证码错误")
        } else if (res.data.code == 200) {
          var url = "/vip/getCurrentVipUser";
          var data = {};
          var method = "GET";
          http.ajax(url, method, data, header)
            .then(function (res) {
              console.log(res);
              wx.setStorage({
                key: 'allInfo',
                data: res.data.data,
                success: function () {
                  util.jump("rel", "/pages/usercenter/usercenter")
                }
              })
            })
            .catch(function (err) {
              console.log(err);
            })
        } else {
          modal.modal("提示", "绑定失败，请稍后重试")
        }
      })
  },

  // 跳转
  jump(e) {
    util.jump('switch', "/pages/usercenter/usercenter")
  }
})