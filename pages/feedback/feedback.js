// pages/feedback/feedback.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    questions: [
      "门店服务",
      "菜品口味&质量",
      "功夫会员",
      "功夫团餐",
      "小程序体验",
      "支付问题",
      "账号问题",
      "其他"
    ],
    store: ["香年店", "福年店", "峰会店"],
    sex: ["男", "女"],
    QSindex: null,
    storeIndex: null,
    sexIndex: null,
    showStore: false,
    wordLength: 0,
    imageArr: [],
    imageNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 问题
  QSchoose(e) {
    let choose = this.data.questions[e.detail.value];
    let showStore = false;
    if (
      choose == "门店服务" ||
      choose == "菜品口味&质量" ||
      choose == "功夫团餐"
    ) {
      showStore = true;
    }
    this.setData({
      QSindex: e.detail.value,
      showStore: showStore
    });
  },
  // 门店
  storeChoose(e) {
    this.setData({
      storeIndex: e.detail.value
    });
  },
  // 计数
  wordNum(e) {
    let str = e.detail.value;
    let arr = str.split("");
    this.setData({
      wordLength: arr.length
    });
  },
  getImage() {
    let that = this;
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let arr = that.data.imageArr;
        arr.push(tempFilePaths[0]);
        let imgNum = arr.length;
        that.setData({
          imageNum: imgNum,
          imageArr: arr
        });
      }
    });
  },
  deleteImage(e) {
    let idx = e.currentTarget.dataset.idx;
    console.log(idx);
    let arr = this.data.imageArr;
    arr.splice(idx, 1);
    let num = arr.length;
    this.setData({
      imageArr: arr,
      imageNum: num
    });
  },
  chooseSex(e) {
    this.setData({
      sexIndex: e.detail.value
    });
  },
  submitAll() {
    let arr = this.data.imageArr;
    let length = arr.length;
    for (let i = 0; i < length; i++) {
      wx.uploadFile({
        url: "https://example.weixin.qq.com/upload",
        filePath: arr[i],
        name: "attachFile",
        header: app.globalData.header,
        success: function(res) {
          var data = res.data;
          //do something
          console.log(res);
          if (i == length - 1) {
            console.log("开始传其他数据");
          }
        },
        fail(err) {
          console.log(err);
        }
      });
    }
  }
});
