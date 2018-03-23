// pages/out/chooseMeal/chooseMeal.js
let app = getApp();
let http = require("../../../utils/ajax");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        groupId: 1,
        groupName: "热荤菜",
        detailList: [
          {
            id: 9,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 1,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 1,
            disheCateName: "热荤菜",
            disheNo: null,
            disheName: "家常豆腐",
            salePrice: 11.0,
            disheCopiesCount: 110,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 9,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 2,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 1,
            disheCateName: "热荤菜",
            disheNo: null,
            disheName: "家常豆腐",
            salePrice: 15.0,
            disheCopiesCount: 110,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 9,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 3,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 1,
            disheCateName: "热荤菜",
            disheNo: null,
            disheName: "家常豆腐",
            salePrice: 1.0,
            disheCopiesCount: 110,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 9,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 4,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 1,
            disheCateName: "热荤菜",
            disheNo: null,
            disheName: "家常豆腐",
            salePrice: 112.0,
            disheCopiesCount: 110,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          }
        ]
      },
      {
        groupId: 2,
        groupName: "凉荤菜",
        detailList: [
          {
            id: 10,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 3,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 3,
            disheCateName: "凉荤菜",
            disheNo: null,
            disheName: "蒜泥白2肉",
            salePrice: 25.0,
            disheCopiesCount: 40,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 10,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 1,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 3,
            disheCateName: "凉荤菜",
            disheNo: null,
            disheName: "蒜2泥2白肉",
            salePrice: 35.0,
            disheCopiesCount: 40,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 10,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 2,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 3,
            disheCateName: "凉荤菜",
            disheNo: null,
            disheName: "蒜泥2白肉",
            salePrice: 45.0,
            disheCopiesCount: 40,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          }
        ]
      },
      {
        groupId: 3,
        groupName: "凉荤菜",
        detailList: [
          {
            id: 10,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 3,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 3,
            disheCateName: "凉荤菜",
            disheNo: null,
            disheName: "蒜泥白肉",
            salePrice: 25.0,
            disheCopiesCount: 40,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 10,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 1,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 3,
            disheCateName: "凉荤菜",
            disheNo: null,
            disheName: "蒜泥白肉",
            salePrice: 35.0,
            disheCopiesCount: 40,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          },
          {
            id: 10,
            mainId: 6,
            storeId: null,
            storeName: null,
            disheId: 2,
            disheTasteId: 1,
            disheTasteName: "麻辣",
            disheCateId: 3,
            disheCateName: "凉荤菜",
            disheNo: null,
            disheName: "蒜泥白肉",
            salePrice: 45.0,
            disheCopiesCount: 40,
            lunchBoxCount: null,
            createTime: null,
            updateTime: null,
            lunchBoxEnoughStatus: "不足"
          }
        ]
      }
    ],
    pushInfo: [],
    scrollId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  getAdd(e) {
    console.log(e.detail);
    let msg = e.detail;
    let push = this.data.pushInfo;
    let groupId = msg.groupId;
    let idx = msg.detailList.disheId;
    let result = this.change(groupId, idx);

    console.log(result);
    if (result >= 0) {
      push.splice(result, 1, msg);
      console.log(push);
      this.setData({
        pushInfo: push
      });
    } else {
      push.push(msg);
      this.setData({
        pushInfo: push
      });
    }
    console.log("当前数据", this.data.pushInfo);
    // this.triggerEvent("sendAll", push);
  },
  // 获取-数据
  getCut(e) {
    console.log(e.detail);
    let msg = e.detail;
    let push = this.data.pushInfo;
    let groupId = msg.groupId;
    let idx = msg.detailList.disheId;
    let count = msg.count;
    let result = this.change(groupId, idx);
    console.log(result);
    if (result >= 0) {
      if (count > 0) {
        push.splice(result, 1, msg);
        console.log(push);
        this.setData({
          pushInfo: push
        });
      } else {
        push.splice(result, 1);
        console.log(push);
        this.setData({
          pushInfo: push
        });
      }
    }
    console.log("当前数据", this.data.pushInfo);
    // this.triggerEvent("sendAll", push);
  },
  getCartList(e) {
    console.log("购物车出来的数据", e.detail);
    this.setData({
      pushInfo: e.detail
    });
  },
  // 确认下单
  confirmOrder(e) {
    console.log(e);
  },
  // 判断是否改变
  change(groupId, idx) {
    let push = this.data.pushInfo;
    let length = push.length;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (push[j].groupId == groupId && push[j].detailList.disheId == idx) {
          return j;
        }
      }
    }
  },
  //  打开地图
  openMap() {
    let lat = 30.548231;
    let lng = 104.064866;
    wx.openLocation({
      name: "福年",
      address: "福年广场",
      latitude: lat,
      longitude: lng,
      scale: 28
    });
  },
  // 标签跳
  changeScroll(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    this.setData({
      scrollId: id
    });
  },
  getHeight(e) {
    var query = wx.createSelectorQuery();
    query.selectAll(".card_container").boundingClientRect();

    query.exec(function(res) {
      console.log(res);
    });
  }
});
