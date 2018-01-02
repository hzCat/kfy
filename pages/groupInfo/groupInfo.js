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
    pushInfo:{}
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

  getCompanyName(e) {
    console.log("company", e.detail.value)
  },
  getPhoneNumber(e) {
    console.log("phonenumber", e.detail.value)
  },
  getPeopleName(e) {
    console.log("peopleName", e.detail.value)
  },
  getAddress(e) {
    console.log("address", e.detail.value)
  },
  getOrderNumber(e) {
    console.log("orderNumber", e.detail.value)
  },
  pushAllInfo(){
    console.log(this.data.pushInfo)
  }
})