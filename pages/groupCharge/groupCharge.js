let modal = require("../../utils/modal.js");
let http = require("../../utils/ajax.js");
let storage = require("../../utils/storage.js");
let pay = require("../../utils/pay.js");
let jump = require("../../utils/jump.js");
let update = require("../../utils/update.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    orderNumber: null,
    money: null,
    otherInfo: null,
    phoneNumber: null,
    pushInfo: {},
    header: {},
    serviceNumber: null,
    chargeInfo: null,
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    storage.gets("allInfo").then(res => {
      console.log(res.data);
      let obj = this.data.pushInfo;
      obj.contact = res.data.mobile;
      this.setData({
        phoneNumber: res.data.mobile,
        pushInfo: obj,
        serviceNumber: app.globalData.serviceNumber
      });
    });
    storage.gets("3rd_session").then(res => {
      console.log(res.data);
      this.setData({
        header: {
          _yzsaas_token: res.data,
          "content-type": "application/x-www-form-urlencoded"
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.chargeInfo();
  },

  // 获取充值信息
  chargeInfo() {
    let url = "/recharge/getApplyOrder";
    http.ajax(url, "GET", {}, app.globalData.header).then(res => {
      console.log("充值信息",res.data);
      if (res.data.data) {
        let getInfo = res.data.data;
        let obj = this.data.pushInfo;
        obj.transferFlowNo = getInfo.transferFlowNo;
        obj.rechargeAmt = getInfo.rechargeAmt;
        obj.note = getInfo.note;
        obj.contact = getInfo.contact;
        this.setData({
          chargeInfo: getInfo,
          pushInfo: obj
        });
      }
    });
  },
  // 获取汇款单号
  getOrderNumber(e) {
    console.log("汇款单号", e.detail.value);
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{6,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.transferFlowNo = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    // else {
    //   modal.modal("提示", "单号要求6~30位中文﹐英文或者数字");
    // }
  },
  // 获取金额
  getMoney(e) {
    console.log("金额", e.detail.value);
    if (/^\d+(\.\d{2})+$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.rechargeAmt = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    // else {
    //   modal.modal("提示", "请输入正确输入小数点后两位");
    // }
  },
  // 获取备注
  getNote(e) {
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.note = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    // else {
    //   modal.modal("提示", "备注要求1~30位中文﹐英文或者数字");
    // }
  },

  // 获取手机号码
  getPhoneNumber(e) {
    console.log("手机号码", e.detail.value);
    if (/^1[3456789]\d{9}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.contact = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    // else {
    //   modal.modal("提示", "请输入11位手机号码");
    // }
  },

  // 触摸清除pushInfo中的数据
  clear(e) {
    console.log("触摸的输入框", e.currentTarget.dataset.type);
    let type = e.currentTarget.dataset.type;
    let obj = this.data.pushInfo;
    if (type == "order") {
      obj.transferFlowNo = null;
    } else if (type == "money") {
      obj.rechargeAmt = null;
    } else if (type == "note") {
      obj.note = null;
    } else if (type == "phone") {
      obj.contact = null;
    }
    this.setData({
      pushInfo: obj
    });
  },
  // 提交信息
  pushAllInfo() {
    let that = this;
    console.log(this.data.pushInfo);
    let data = this.data.pushInfo;
    this.setData({
      modalOn: true
    });
    if (data.transferFlowNo && data.note && data.rechargeAmt && data.contact) {
      let header = this.data.header;
      pay.tvipcharge(data, header).then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          // util.jump("redirect", "/pages/vipBag/vipBag")
          update.updateuser(app.globalData.header);
          jump.jump("back");
        } else if (code == 7003) {
          modal.modal("提示", "团餐会员卡未开通");
        } else if (code == 612) {
          modal.modal("提示", "未绑定手机");
        } else if (code == 7008) {
          modal.modal("提示", "充值申请正在处理中，不能再次提交申请");
        }
        console.log(res.data);
      });
    } else {
      let str = "请检查以下信息的格式";
      if (!data.transferFlowNo) {
        let thisOrder = "\r\n* 单号要求6~30位中文﹐英文或者数字";
        str += thisOrder;
      }
      if (!data.note) {
        let thisNote = "\r\n* 备注要求1~30位中文﹐英文或者数字";
        str += thisNote;
      }
      if (!data.rechargeAmt) {
        let thisMoney = "\r\n* 充值金额保留两位小数";
        str += thisMoney;
      }
      if (!data.contact) {
        let thisPhone = "\r\n* 要求11位手机号";
        str += thisPhone;
      }
      modal.modal("提示", str);
    }
  },
  cancelFail() {
    this.setData({
      modalOn: true
    });
    let url = "/recharge/userCancelApply";
    http.ajax(url, "GET", {}, app.globalData.header).then(res => {
      if (res.data.code == 200 && res.data.result == true) {
        update.updateuser(app.globalData.header);
        wx.showToast({
          title: "取消成功",
          icon: "success",
          duration: 2000,
          success() {
            setTimeout(() => {
              jump.jump("rel", "/pages/vip/vip");
            }, 2000);
          }
        });
      }
    });
  },
  call() {
    let that = this;
    if (this.data.serviceNumber) {
      wx.makePhoneCall({
        phoneNumber: that.data.serviceNumber
      });
    }
  }
});
