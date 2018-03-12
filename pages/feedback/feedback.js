// pages/feedback/feedback.js
let app = getApp();
let storage = require("../../utils/storage");
let http = require("../../utils/ajax");
let modal = require("../../utils/modal");
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
    storeName: [],
    storeId: [],
    sex: ["男", "女"],
    QSindex: null,
    storeIndex: null,
    sexIndex: null,
    showStore: false,
    wordLength: 0,
    imageArr: [],
    imageNum: 0,
    pushInfo: {},
    allInfo: null,
    session: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    storage.gets("allInfo").then(res => {
      console.log("feedback获取用户信息缓存", res.data);
      let mobile = res.data.mobile;
      let sex = res.data.vipUserInfo.sex;
      let data = this.data.pushInfo;
      let realName = res.data.realName;
      console.log(realName);
      let arr = realName.split("");
      console.log(arr);
      if (realName) {
        data.surname = arr[0];
      }
      let sexIndex = null;
      data.contact = mobile;
      data.gender = sex;
      if (sex == "M") {
        sexIndex = 0;
      } else if (sex == "F") {
        sexIndex = 1;
      }
      this.setData({
        pushInfo: data,
        allInfo: res.data,
        sexIndex: sexIndex
      });
      console.log("加载后", this.data.pushInfo);
    });
    storage.gets("3rd_session").then(res => {
      this.setData({
        session: res.data
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(app.globalData.header);

    setTimeout(() => {
      http
        .ajax("/vipCommon/storeItem", "GET", {}, app.globalData.header)
        .then(res => {
          console.log(res);
          let length = res.data.data.length;
          let arrId = [];
          let arrName = [];
          for (let i = 0; i < length; i++) {
            let one = res.data.data[i];
            arrId.push(one.codeId);
            arrName.push(one.codeValue);
          }
          this.setData({
            storeName: arrName,
            storeId: arrId
          });
        });
    }, 1000);
  },
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
    let data = this.data.pushInfo;
    data.feedType = this.tranQStype(choose);
    console.log(data);
    this.setData({
      QSindex: e.detail.value,
      showStore: showStore,
      pushInfo: data
    });
  },
  // 转换问题类型
  tranQStype(str) {
    let type = null;
    if (str == "门店服务") {
      type = "STORE_SERVICE";
    } else if (str == "菜品口味&质量") {
      type = "DISHES_QUALITY";
    } else if (str == "功夫会员") {
      type = "KONGF_VIP";
    } else if (str == "功夫团餐") {
      type = "KONGF_TEAM";
    } else if (str == "小程序体验") {
      type = "WXA_EXPRIENCE";
    } else if (str == "支付问题") {
      type = "PAYMENT";
    } else if (str == "账号问题") {
      type = "ACCOUNT";
    }
    return type;
  },
  // 门店
  storeChoose(e) {
    console.log("storeID", this.data.storeId);
    let index = e.detail.value;
    let nowId = this.data.storeId[index];
    let data = this.data.pushInfo;
    data.storeId = nowId;
    this.setData({
      storeIndex: index,
      pushInfo: data
    });
  },
  getTextarea(e) {
    console.log(e.detail.value);
    let input = e.detail.value;
    let data = this.data.pushInfo;
    data.feedContent = input;
    this.setData({
      pushInfo: data
    });
    console.log(this.data.pushInfo);
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
    let length = this.data.imageArr.length;
    let that = this;
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      count: 3 - length,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let arr = that.data.imageArr;
        let length = tempFilePaths.length;
        for (let i = 0; i < length; i++) {
          arr.push(tempFilePaths[i]);
        }
        let imgNum = arr.length;
        console.log(res);
        console.log(arr);
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
  upLoadImg(arr, head, i) {
    return new Promise(function(res, rej) {
      let uploadTask = wx.uploadFile({
        url: `${http.baseUrl}/vipCommon/uploadImg`,
        filePath: arr[i],
        name: "attachFile",
        header: head,
        success: res,
        fail: rej
      });
    });
  },
  submitAll() {
    let that = this;
    let arr = this.data.imageArr;
    let length = arr.length;
    let push = this.data.pushInfo;
    let errInfo = "请检查以下项目";

    let submit = function() {
      wx.showLoading({
        title: "上传中"
      });
      if (length > 0) {
        //有图
        // let progressOne = 100 / length;
        // let progress = 0;
        let head = {
          _yzsaas_token: that.data.session,
          "content-type": "multipart/form-data",
          "X-Requested-With": "XMLHttpRequest"
        };

        let backImg = [];

        for (let i = 0; i < length; i++) {
          // if (i < length - 1) {
          //   that.upLoadImg(arr, head, i).then(res => {
          //     console.log(res);
          //   });
          // } else if (i == length - 1) {
          that.upLoadImg(arr, head, i).then(res => {
            let info = null;
            if (res.data && typeof res.data == "string") {
              info = JSON.parse(res.data);
            } else if (res.data) {
              info = res.data;
            }
            console.log(info);
            if (info.code == 200 && info.result == true) {
              console.log("上传完成");
              backImg.push(info.data);
              let push = that.data.pushInfo;
              if (i == 0) {
                push.feedImg1 = info.data;
              } else if (i == 1) {
                push.feedImg2 = info.data;
              } else if (i == 2) {
                push.feedImg3 = info.data;
              }
              if (backImg.length == length) {
                console.log(push);
                http
                  .ajax("/feedback/submit", "POST", push, app.globalData.header)
                  .then(res => {
                    console.log(res);
                    let code = res.data.code;
                    let result = res.data.result;
                    if (code == 200 && result == true) {
                      setTimeout(function() {
                        wx.hideLoading();
                      }, 1000);
                    }
                  });
              }
            }
          });
          // }
        }
      } else {
        //无图
        http
          .ajax("/feedback/submit", "POST", push, app.globalData.header)
          .then(res => {
            console.log(res);
            let code = res.data.code;
            let result = res.data.result;
            if (code == 200 && result == true) {
              setTimeout(function() {
                wx.hideLoading();
              }, 1000);
            }
          });
      }
    };
    // 判断数据
    if (push.feedType && push.gender && push.contact) {
      // 必须要store
      if (
        (push.feedType == "STORE_SERVICE" ||
          push.feedType == "DISHES_QUALITY" ||
          push.feedType == "KONGF_TEAM") &&
        push.storeId
      ) {
        submit();
        // 非必须store
      } else if (
        !(
          push.feedType == "STORE_SERVICE" ||
          push.feedType == "DISHES_QUALITY" ||
          push.feedType == "KONGF_TEAM"
        )
      ) {
        submit();
      } else {
        modal.modal("提示", "门店选项是必须的");
      }
      // 少信息
    } else {
      if (!push.feedType) {
        errInfo += "\r\n* 问题类型是必须的";
      }
      if (!push.gender) {
        errInfo += "\r\n* 性别是必须的";
      }
      if (!push.contact) {
        errInfo += "\r\n* 联系方式是必须的";
      }
      modal.modal("提示", errInfo);
    }
  }
});
