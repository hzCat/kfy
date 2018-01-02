Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:0,
    orderNumber: "",
    money: "",
    otherInfo: "",
    phoneNumber: "",
    pushInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 获取汇款单号
  getOrderNumber(e) {
    console.log("汇款单号", e.detail.value)
  },
  // 获取金额
  getMoney(e) {
    console.log("金额", e.detail.value)
  },
  // 获取备注
  getOtherInfo(e) {
    console.log("备注", e.detail.value)
  },
  // 获取手机号码
  getPhoneNumber(e) {
    console.log("手机号码", e.detail.value)
  },
  pushAllInfo() {
    console.log(this.data.pushInfo)
  }
})