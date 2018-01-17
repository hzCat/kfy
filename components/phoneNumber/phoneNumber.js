// components/phoneNumber/phoneNumber.js
let http = require("../../utils/ajax.js");
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    open: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    phoneNumber: null,
    testNumber: null,
    numberError: false,
    tips: "获取验证码",
    errorTips: "请输入有效手机号码",
    time: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    phoneNumber(e) {
      console.log(e.detail.value);
      let num = e.detail.value;
      if (/^1[3456789]\d{9}$/.test(num)) {
        this.setData({
          phoneNumber: num,
          numberError: false
        });
      } else {
        this.setData({
          phoneNumber: null,
          numberError: true,
          errorTips: "请输入有效手机号码"
        });
      }
    },
    testNumber(e) {
      let text = e.detail.value;
      this.setData({
        testNumber: text,
        numberError: false
      });
    },
    getTest() {
      if (this.data.phoneNumber && this.data.tips == "获取验证码") {
        // 请求验证码
        let url = "/vipCenter/getBindCode";
        let data = {
          mobile: this.data.phoneNumber
        };
        http.ajax(url, "GET", data, app.globalData.header).then(res => {
          let content = "";
          if (res.data.code == 200) {
            content = "短信已发送,请注意接收";
          } else if (res.data.code == 650 || res.data.code == 414) {
            content = "不支持的手机号";
          } else if (res.data.code == 610) {
            content = "手机号已绑定";
          } else {
            content = "暂时无法绑定,请稍后再试";
          }
          this.oneMinute();
          this.setData({
            numberError: true,
            errorTips: content
          });
        });
      } else if (this.data.phoneNumber && this.data.tips == "重新发送") {
        this.setData({
          numberError: true,
          errorTips: "请勿频繁获取验证码"
        });
      } else {
        this.setData({
          numberError: true,
          errorTips: "请输入有效手机号码"
        });
      }
    },
    oneMinute() {
      let now = 60;
      this.setData({
        tips: "重新发送",
        time: `(${now}s)`
      });
      let timer = setInterval(() => {
        now--;
        this.setData({
          time: `(${now}s)`
        });
        if (now <= 0) {
          clearInterval(timer);
          timer = null;
          this.setData({
            tips: "获取验证码",
            time: null
          });
        }
      }, 1000);
    },
    relate() {
      let that = this;
      // 绑定手机
      if (this.data.phoneNumber && this.data.testNumber) {
        let url = "/vipCenter/bindMobile";
        let data = {
          mobile: this.data.phoneNumber,
          code: this.data.testNumber
        };
        http.ajax(url, "POST", data, app.globalData.header).then(res => {
          console.log(res);
          if (res.data.code == 413) {
            this.setData({
              numberError: true,
              errorTips: "验证码错误"
            });
          } else if (res.data.code == 200) {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 2000,
              success() {
                that.setData({
                  open: false
                });
              }
            });
          } else {
            this.setData({
              numberError: true,
              errorTips: "绑定失败，请稍后重试"
            });
          }
        });
      } else {
        let phone = this.data.phoneNumber;
        let test = this.data.testNumber;
        if (phone && !test) {
          this.setData({
            numberError: true,
            errorTips: "请输入验证码"
          });
        } else if (!phone && test) {
          this.setData({
            numberError: true,
            errorTips: "请输入正确手机号"
          });
        } else if (!phone && !test) {
          this.setData({
            numberError: true,
            errorTips: "请检查所有信息"
          });
        }
      }
    },
    // 关闭
    close() {
      this.setData({
        open: false
      });
    }
  }
});
