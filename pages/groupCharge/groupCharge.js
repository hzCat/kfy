let modal = require("../../utils/modal.js")
let http = require("../../utils/ajax.js")
let storage = require("../../utils/storage.js")
let pay = require("../../utils/pay.js")
let util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    orderNumber: "",
    money: "",
    otherInfo: "",
    phoneNumber: "",
    pushInfo: {},
    header: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    storage.gets("allInfo")
      .then((res) => {
        console.log(res.data)
        let obj = this.data.pushInfo;
        obj.contact = res.data.mobile;
        this.setData({
          phoneNumber: res.data.mobile,
          pushInfo: obj
        })
      })
    storage.gets("3rd_session")
      .then((res) => {
        console.log(res.data)
        this.setData({
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
  // 获取汇款单号
  getOrderNumber(e) {
    console.log("汇款单号", e.detail.value)
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{6,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.transferFlowNo = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "单号要求6~30位中文﹐英文或者数字")
    }
  },
  // 获取金额
  getMoney(e) {
    console.log("金额", e.detail.value)
    if (/^\d+(\.\d{2})+$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.rechargeAmt = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "请输入正确输入小数点后两位")
    }
  },
  // 获取备注
  getOtherInfo(e) {
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.note = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "备注要求1~30位中文﹐英文或者数字")
    }
  },
  // 获取手机号码
  getPhoneNumber(e) {
    console.log("手机号码", e.detail.value)
    if (/^1[3456789]\d{9}$/.test(e.detail.value)) {
      let obj = this.data.pushInfo;
      obj.contact = e.detail.value;
      this.setData({
        pushInfo: obj
      })
    } else {
      modal.modal("提示", "请输入11位手机号码")
    }
  },
  pushAllInfo() {
    let that = this;
    console.log(this.data.pushInfo)
    let data = this.data.pushInfo
    if (data.transferFlowNo && data.note && data.rechargeAmt && data.contact) {
      let header = this.data.header;
      pay.tvipcharge(data, header)
        .then(function (res) {
          let code = res.data.code;
          if (code == 200) {
            // util.jump("redirect", "/pages/vipBag/vipBag")
            util.jump("back")
          } else if (code == 7003) {
            modal.modal("提示", "团餐会员卡未开通")
          } else if (code == 612) {
            modal.modal("提示", "未绑定手机")
          }
          console.log(res.data)
        })
    } else {
      modal.modal("提示", "充值信息不完整")
    }
  }
})