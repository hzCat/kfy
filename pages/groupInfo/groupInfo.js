let storage = require("../../utils/storage.js");
let http = require("../../utils/ajax.js");
let modal = require("../../utils/modal.js");
let util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    companyName: "",
    phoneNumber: "",
    peopleName: "",
    address: "",
    orderNumber: "",
    pushInfo: {},
    header: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    storage.gets("3rd_session").then(function (res) {
      that.setData({
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
  onShow: function () {},

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

  // 点击时清除
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
  
  // 提交
  pushAllInfo() {
    console.log(this.data.pushInfo);
    let data = this.data.pushInfo;
    if (data.contactMobile && data.corpName && data.contactName) {
      let url = "/tvip/apply";
      let header = this.data.header;
      http.ajax(url, "POST", data, header).then(function (res) {
        console.log(res.data);
        let code = res.data.code;
        if (code == 200) {
          // util.jump("redirect", "/pages/vipBag/vipBag")
          util.jump("back");
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