// components/dishesCard/dishesCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mealList: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pushInfo: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取+数据
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
      this.triggerEvent("sendAll", push);
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
      this.triggerEvent("sendAll", push);
    },
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
    // hasThisGroup(groupId) {
    //   let list = this.data.pushInfo;
    //   let length = list.length;
    //   let arr = [];
    //   for (let i = 0; i < length; i++) {
    //     if (list[i].groupId == groupId) {
    //       arr.push(list[i]);
    //     }
    //   }
    //   return arr;
    // },
    // hasThisDetail(list, idx) {
    //   let list_d = list;
    //   // console.log(list_d);
    //   let length = list_d.length;
    //   for (let i = 0; i < length; i++) {
    //     // console.log(list_d[i].detailList);
    //     if (list_d[i].detailList.disheId == idx) {
    //       return list_d[i];
    //     }
    //   }
    //   return false;
    // },
    // findNewGroup(groupId) {
    //   let list = this.data.mealList;
    //   let length = list.length;
    //   for (let i = 0; i < length; i++) {
    //     if (list[i].groupId == groupId) {
    //       return list[i];
    //     }
    //   }
    // },
    // findNewDetail(list, idx) {
    //   let list_d = list.detailList;
    //   let length = list_d.length;
    //   for (let i = 0; i < length; i++) {
    //     if (list_d[i].disheId == idx) {
    //       return list_d[i];
    //     }
    //   }
    // }
    // add(e) {
    //   console.log(e.currentTarget.dataset);
    //   // console.log(this.data.mealList);
    //   let group = e.currentTarget.dataset.group;
    //   let idx = e.currentTarget.dataset.idx;
    //   // 传输
    //   let push = this.data.pushInfo;
    //   // 菜单列表
    //   let list = this.data.mealList;
    //   // 已经添加如果有内容
    //   if (push.length > 0) {
    //     let list = this.hasThisGroup(group);
    //     // console.log("选出的list", list);
    //     if (list.length > 0) {
    //       let result = this.hasThisDetail(list, idx);
    //       // console.log("是否有id", result);
    //       if (result) {
    //         let count = result.count + 1;
    //         result.count = count;
    //         for (let i = 0; i < push.length; i++) {
    //           let one = push[i];
    //           if (one.groupId == group) {
    //             let length = one.detailList.length;
    //             for (let j = 0; j < length; j++) {
    //               if (one.detailList[i].disheId == idx) {
    //                 push[i] = result;
    //               }
    //             }
    //             this.setData({
    //               pushInfo: push
    //             });
    //           }
    //         }
    //       } else {
    //         let newList = this.findNewGroup(group);
    //         // console.log(newList);
    //         if (newList) {
    //           let list = this.findNewDetail(newList, idx);
    //           // console.log(list);
    //           let data = {
    //             groupId: group,
    //             detailList: list,
    //             count: 1
    //           };
    //           let arr = this.data.pushInfo;
    //           arr.push(data);
    //           this.setData({
    //             pushInfo: arr
    //           });
    //         }
    //       }
    //     } else {
    //       let newList = this.findNewGroup(group);
    //       // console.log(newList);
    //       if (newList) {
    //         let list = this.findNewDetail(newList, idx);
    //         // console.log(list);
    //         let data = {
    //           groupId: group,
    //           detailList: list,
    //           count: 1
    //         };
    //         let arr = this.data.pushInfo;
    //         arr.push(data);
    //         this.setData({
    //           pushInfo: arr
    //         });
    //       }
    //     }
    //   } else {
    //     //如果没有
    //     let newList = this.findNewGroup(group);
    //     // console.log(newList);
    //     if (newList) {
    //       let list = this.findNewDetail(newList, idx);
    //       // console.log(list);
    //       let data = {
    //         groupId: group,
    //         detailList: list,
    //         count: 1
    //       };
    //       let arr = [];
    //       arr.push(data);
    //       this.setData({
    //         pushInfo: arr
    //       });
    //     }
    //   }
    //   console.log(this.data.pushInfo);
    // },
    // cut(e) {
    //   console.log(e.currentTarget.dataset);
    //   let group = e.currentTarget.dataset.group;
    //   let idx = e.currentTarget.dataset.idx;
    // },
  }
});
