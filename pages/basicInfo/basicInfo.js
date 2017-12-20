var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var util = require("../../utils/util.js");
var modal = require("../../utils/modal.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushInfo: {},
    allInfo: {},
    userInfo: {},
    nickName: "",
    yourName: "",
    userSex: ["女", "男"],
    userHeight: [],
    userWeight: [],
    height: "",
    weight: "",
    bir: "",
    sIndex: "",
    hIndex: "",
    kgIndex: "",
    birth: "",
    modify: {},
    header: {},
    third: "",
    nowdays: null,
    uSexIdx: null,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    // 需要从内存中获取会员基础信息用来做比对
    wx.getStorage({
      key: 'allInfo',
      success: function (res) {
        let str = res.data.vipUserInfo.birthday;
        let userSex = res.data.vipUserInfo.sex;
        if (userSex == "M") {
          that.setData({
            uSexIdx: 1
          })
        } else if (userSex == "F") {
          that.setData({
            uSexIdx: 0
          })
        }
        if (str) {
          var s1 = str.substring(0, 4);
          var s2 = str.substring(4, 6);
          var s3 = str.substring(6, 8);
          var sss = s1 + "-" + s2 + "-" + s3;
          that.setData({
            bir: sss,
          })
        }
        // 应该是访问不到服务器产生的height为undefined
        that.setData({
          allInfo: res.data,
          height: res.data.vipUserInfo.height,
          weight: res.data.vipUserInfo.weight
        })
      },
    })
    // 获取userInfo(微信的)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
        })
      },
    });
    // 获取3rd_session
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        that.setData({
          third: res.data,
          header: {
            '_yzsaas_token': res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        // 获取可更改项目
        var url = "/vipCenter/getChangeableList"
        var method = "GET";
        var data = {};
        var header = that.data.header
        http.ajax(url, method, data, header)
          .then(function (res) {
            console.log("可修改项目", res.data.data)
            var arr = res.data.data
            var obj = that.data.modify
            // 对可更改项目进行遍历,添加到可更改modify对象中
            for (let i = 0, x = arr.length; i < x; i++) {
              if (arr[i] == "NICKNAME_MODULE") {
                obj.nickname = true;
                // that.setData({
                //   modify: obj
                // })
              }
              if (arr[i] == "REALNAME_MODULE") {
                // var obj = that.data.modify
                obj.realname = true;
                // that.setData({
                //   modify: obj
                // })
              }
              if (arr[i] == "GENDER_MODULE") {
                // var obj = that.data.modify
                obj.gender = true;
                // that.setData({
                //   modify: obj
                // })
              }
              if (arr[i] == "BIRTHDAY_MODULE") {
                // var obj = that.data.modify
                obj.birth = true;
                // that.setData({
                //   modify: obj
                // })
              }
              if (arr[i] == "HEIGHT_MODULE") {
                // var obj = that.data.modify
                obj.height = true;
                // that.setData({
                //   modify: obj
                // })
              }
              if (arr[i] == "WEIGHT_MODULE") {
                // var obj = that.data.modify
                obj.weight = true;
              }
            }
            that.setData({
              modify: obj
            })
            console.log('转换后的可修改项目', that.data.modify)
          })
      },
    })

    // 获取当前日期，身高，体重
    let ymd = this.getNowDate();
    let hArr = this.createHeight(140, 80);
    let kgArr = this.createWeight(40, 60)

    that.setData({
      userHeight: hArr,
      userWeight: kgArr,
      nowdays: ymd
    });
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    navbar.title("基础信息")
    // 提示可修改项目
    var title = "重要提示";
    var content = "* 姓名、生日、性别只能修改一次\r\n* 身高、体重每周可以修改一次";
    var confirmText = "知道了";
    modal.modal(title, content, false, {}, {}, confirmText);
  },

  // 生成身高
  createHeight(start, length) {
    let h = start;
    let hArr = [];
    for (let i = 0; i < length; i++) {
      hArr.push(h + 'cm');
      h++;
    };
    return hArr
  },

  //生成体重
  createWeight(start, length) {
    let kg = start;
    let kgArr = [];
    for (let n = 0; n < length; n++) {
      kgArr.push(kg + 'kg');
      kg++;
    };
    return kgArr
  },

  // 获取当前年月日
  getNowDate() {
    // 获取当前年月日
    var Nowtime = new Date();
    var year = Nowtime.getFullYear();
    var month = Nowtime.getMonth() + 1;
    var day = null;
    if (Nowtime.getDate() < 10) {
      day = "0" + Nowtime.getDate();
    } else {
      day = Nowtime.getDate();
    }
    var ymd = year + "-" + month + "-" + day;
    return ymd
    // this.setData({
    //   nowdays: ymd
    // })
  },

  // 修改昵称
  nickNameChange(e) {
    var that = this;
    console.log('输入的昵称',e.detail.value)

    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{4,16}$/.test(e.detail.value)) {
      var obj = that.data.pushInfo;
      obj.nickName = e.detail.value;
      that.setData({
        nickName: e.detail.value,
        pushInfo: obj
      })
    } else {
      var content = "昵称要求4~16位中文﹐英文或者数字";
      modal.modal("提示", content, false);
    }
  },

  // 性别
  bindSexChange: function (e) {
    console.log('性别index', e.detail.value)
    var that = this;
    that.setData({
      sIndex: e.detail.value
    });
    var sex = "";
    if (that.data.sIndex == 0) {
      sex = "女"
    } else if (that.data.sIndex == 1) {
      sex = "男"
    }
    // 屏蔽未修改
    if (this.data.allInfo.vipUserInfo.sex != sex) {
      var obj = that.data.pushInfo;
      if (that.data.sIndex == 0) {
        obj.sex = "F";

      } else if (that.data.sIndex == 1) {
        obj.sex = "M"
      }
      that.setData({
        pushInfo: obj
      })
    }
  },

  // 身高
  bindHeightChange: function (e) {
    var that = this;
    console.log('身高index', e.detail.value)
    this.setData({
      hIndex: e.detail.value
    })
    // 屏蔽未修改
    if (this.data.allInfo.vipUserInfo.height != parseInt(that.data.userHeight[this.data.hIndex])) {
      var obj = that.data.pushInfo;
      obj.height = parseInt(that.data.userHeight[this.data.hIndex]);
      that.setData({
        pushInfo: obj
      })
    }
  },

  // 体重
  bindWeightChange: function (e) {
    console.log('体重index', e.detail.value)
    var that = this;
    this.setData({
      kgIndex: e.detail.value
    })
    // 屏蔽未修改
    if (this.data.allInfo.vipUserInfo.weight != parseInt(that.data.userWeight[this.data.kgIndex])) {
      var obj = that.data.pushInfo;
      obj.weight = parseInt(that.data.userWeight[this.data.kgIndex]);
      that.setData({
        pushInfo: obj
      })
    }
  },

  // 生日
  bindBirthChange: function (e) {
    var that = this;
    console.log('生日是', e.detail.value)
    // 超过现在时间屏蔽
    if (e.detail.value.replace(/-/g, "") <= that.data.nowdays.replace(/-/g, "")) {
      that.setData({
        birth: e.detail.value
      })
      // 屏蔽未修改
      if (this.data.allInfo.vipUserInfo.birthday != e.detail.value.replace(/-/g, "")) {
        var obj = that.data.pushInfo;
        obj.birthday = e.detail.value.replace(/-/g, "");
        that.setData({
          pushInfo: obj
        })
      }
    } else {
      modal.modal("提示", "日期超过今天了，请重新输入");
    }
  },

  // 姓名
  realNameChange(e) {
    console.log(e.detail.value);
    var that = this;
    var title = "提示";
    var showCancel = false;
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{2,16}$/.test(e.detail.value)) {
      that.setData({
        yourName: e.detail.value
      })
      // 屏蔽未修改
      if (that.data.allInfo.realName != e.detail.value) {
        var obj = that.data.pushInfo;
        obj.realName = e.detail.value;
        that.setData({
          pushInfo: obj
        })
      }
    } else {
      var content = "姓名要求2~16位中文﹐英文或者数字";
      modal.modal(title, content, showCancel);
    }
    console.log('姓名是',that.data.yourName);
  },

  // 提交所有信息
  submitClick() {
    var that = this;
    // 信息完整时
    if (
      (this.data.nickName || this.data.userInfo.nickName || this.data.allInfo.nickName) &&
      (this.data.yourName || this.data.allInfo.realName) &&
      (this.data.userSex[(this.data.sIndex || this.data.userInfo.gender)] || this.data.allInfo.vipUserInfo.sex) &&
      (this.data.birth || this.data.bir) &&
      (this.data.userHeight[this.data.hIndex] || this.data.height) &&
      (this.data.userWeight[this.data.kgIndex] || this.data.weight)
    ) {
      // 提交修改项目
      console.log('要提交的修改项目',this.data.pushInfo)
      var url = "/vipCenter/modifyVipInfo";
      var method = "POST";
      var data = that.data.pushInfo;
      var header = that.data.header;
      // pushInfo不为空时,json转string比较
      if (JSON.stringify(data) != "{}") {
        http.ajax(url, method, data, header)
          .then(function (res) {
            console.log(res.data)
            // 请求会员信息
            var url = "/vip/getCurrentVipUser";
            var method = "GET";
            var data = {};
            http.ajax(url, method, data, header)
              .then(function (res) {
                // 更新会员信息缓存
                wx.setStorage({
                  key: 'allInfo',
                  data: res.data.data,
                  success: function () {
                    // 返回个人中心
                    util.jump("rel", "/pages/usercenter/usercenter")
                  }
                })
              })
          })
      } else {
        // 没有更新操作
        util.jump("rel", "/pages/usercenter/usercenter")
      }
      // 如果信息有残缺
    } else {
      modal.modal("提示", "需要完整的信息", false, {}, {}, "知道了");
    }
  }
})