let storage = require("../../utils/storage.js");
let http = require("../../utils/ajax.js");
let modal = require("../../utils/modal.js")
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
    storage.gets("3rd_session")
      .then(function (res) {
        that.setData({
          header: {
            '_yzsaas_token': res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        })
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getCompanyName(e) {
    console.log("company", e.detail.value)
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{6,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.corpName = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "公司名要求6~30位中文﹐英文或者数字")
    }
  },
  getPhoneNumber(e) {
    console.log("phonenumber", e.detail.value)
    if (/^1[3456789]\d{9}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.contactMobile = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "请输入11位手机号码")
    }
  },
  getPeopleName(e) {
    console.log("peopleName", e.detail.value)
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.contactName = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "姓名要求1~10位中文﹐英文或者数字")
    }
  },
  getAddress(e) {
    console.log("address", e.detail.value)
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.addrDetail = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    }
  },
  getOrderNumber(e) {
    console.log("orderNumber", e.detail.value)
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.transferFlowNo = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    }
  },
  pushAllInfo() {
    console.log(this.data.pushInfo)
    let data = this.data.pushInfo;
    let url = "/tvip/apply";
    let header = this.data.header;
    http.ajax(url, "POST", data, header)
      .then(function (res) {
        console.log(res.data);
      })
  }
})