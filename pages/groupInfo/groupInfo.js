let storage = require("../../utils/storage.js");
let http = require("../../utils/ajax.js");
let modal = require("../../utils/modal.js");
let jump = require("../../utils/jump.js");
let update = require("../../utils/update");
let turn = require("../../utils/turnto");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    companyName: null,
    phoneNumber: null,
    peopleName: null,
    address: null,
    orderNumber: null,
    money: null,
    pushInfo: {},
    header: {},
    applyInfo: {},
    modalOn: false,
    serviceNumber: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    storage.gets("3rd_session").then(function(res) {
      that.setData({
        header: {
          _yzsaas_token: res.data,
          "content-type": "application/x-www-form-urlencoded"
        },
        serviceNumber: app.globalData.serviceNumber
      });
    });
    this.applyInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    storage.gets("allInfo").then(res => {
      console.log(res.data);
      let obj = this.data.pushInfo;
      obj.contactMobile = res.data.mobile;
      this.setData({
        pushInfo: obj,
        phoneNumber: res.data.mobile
      });
    });
  },
  // 获取申请信息
  applyInfo() {
    let that = this;
    let url = "/tvip/getApplyOrderInfo";
    http.ajax(url, "GET", {}, app.globalData.header).then(res => {
      if (res.data.data) {
        console.log("获取申请信息", res.data);
        let obj = that.data.pushInfo;
        let getInfo = res.data.data;
        obj.corpName = res.data.data.corpName;
        obj.contactMobile = res.data.data.contactMobile;
        obj.contactName = res.data.data.contactName;
        if (getInfo.addrDetail) {
          obj.addrDetail = res.data.data.addrDetail;
        }
        if (getInfo.transferFlowNo) {
          obj.transferFlowNo = res.data.data.transferFlowNo;
        }
        if (getInfo.transferAmt) {
          obj.transferAmt = res.data.data.transferAmt;
        }
        this.setData({
          pushInfo: obj,
          applyInfo: res.data.data
        });
      }
    });
  },
  // 公司名字
  getCompanyName(e) {
    console.log("company", e.detail.value);
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{6,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.corpName = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    // else {
    //   modal.modal("提示", "公司名要求6~30位中文﹐英文或者数字");
    // }
  },

  // 手机号
  getPhoneNumber(e) {
    console.log("phonenumber", e.detail.value);
    if (/^1[3456789]\d{9}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.contactMobile = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    // else {
    //   modal.modal("提示", "请输入11位手机号码");
    // }
  },

  // 联系人
  getPeopleName(e) {
    console.log("peopleName", e.detail.value);
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.contactName = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
    //  else {
    //   modal.modal("提示", "姓名要求1~10位中文﹐英文或者数字");
    // }
  },

  // 地址
  getAddress(e) {
    console.log("address", e.detail.value);
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.addrDetail = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
  },

  // 订单号
  getOrderNumber(e) {
    console.log("orderNumber", e.detail.value);
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.transferFlowNo = e.detail.value;
      this.setData({
        pushInfo: obj
      });
    }
  },

  // 汇款金额
  getMoney(e) {
    let num = e.detail.value;
    let turnNum = turn.tostr(num);
    if (/^[123456789]\d{0,4}(\.\d{2}){1}$/.test(turnNum)) {
      console.log("Money", e.detail.value);
      let obj = this.data.pushInfo;
      obj.transferAmt = turnNum;
      this.setData({
        pushInfo: obj,
        money: turnNum
      });
    } else if (/^[123456789]\d{5,}(\.\d{2}){1}$/.test(turnNum)) {
      modal.modal("提示", "请输入10万元以内汇款金额");
      this.setData({
        money: null
      });
    }
  },
  // 点击时清除输入框数据
  clear(e) {
    let type = e.currentTarget.dataset.type;
    let obj = this.data.pushInfo;
    if (type == "corp") {
      obj.corpName = null;
    } else if (type == "contact") {
      obj.contactName = null;
    } else if (type == "phone") {
      obj.contactMobile = null;
    }
  },
  cancelApply() {
    this.setData({
      modalOn: true
    });
    let url = "/tvip/userCancelApply";
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
  // 提交
  pushAllInfo() {
    this.setData({
      modalOn: true
    });
    console.log(this.data.pushInfo);
    let data = this.data.pushInfo;
    if (data.contactMobile && data.corpName && data.contactName) {
      let url = "/tvip/apply";
      let header = this.data.header;
      http.ajax(url, "POST", data, header).then(function(res) {
        console.log(res.data);
        let code = res.data.code;
        if (code == 200) {
          update.updateuser(app.globalData.header);
          // util.jump("redirect", "/pages/vipBag/vipBag")
          jump.jump("back");
        }
      });
    } else {
      let str = "请检查以下信息的格式";
      if (!data.contactMobile) {
        let thisMobile = "\r\n* 要求11位手机号码";
        str += thisMobile;
      }
      if (!data.corpName) {
        let thisCorp = "\r\n* 公司名要求6~30位中文﹐英文或者数字";
        str += thisCorp;
      }
      if (!data.contactName) {
        let thisName = "\r\n* 姓名要求1~10位中文﹐英文或者数字";
        str += thisName;
      }
      modal.modal("提示", str);
    }
  }
});
