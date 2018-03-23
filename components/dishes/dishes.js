// components/dishes/dishes.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Object
    },
    groupId: {
      type: Number
    },
    changeList: {
      type: Array,
      observer(newVal, oldVal) {
        if (newVal.length > 0) {
          this.findThis(newVal);
        } else {
          this.setData({
            push: {}
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    push: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    add() {
      console.log(this.data.groupId);
      let push = this.data.push;
      // let disheId=list.disheId;
      let groupId = this.data.groupId;
      let list = this.data.list;
      let send = null;
      if (push.groupId) {
        let count = push.count + 1;
        // 限制不大于999
        if (count > 999) {
          count = 999;
        }
        push.count = count;
        send = push;
        this.setData({
          push: push
        });
      } else {
        let data = {
          groupId: groupId,
          detailList: list,
          count: 1
        };
        send = data;
        this.setData({
          push: data
        });
        console.log(list);
        console.log(this.data.push);
      }
      this.triggerEvent("sendAdd", send);
    },
    cut() {
      let push = this.data.push;
      // let disheId=list.disheId;
      let groupId = this.data.groupId;
      let list = this.data.list;
      let send = null;
      if (push.groupId) {
        let count = push.count - 1;
        push.count = count;
        send = push;
        this.setData({
          push: push
        });
      }
      this.triggerEvent("sendCut", send);
    },
    // 找到对应的
    findThis(list) {
      let length = list.length;
      let obj = this.data.push;
      if (obj.groupId) {
        let groupId = obj.groupId;
        let disheId = obj.detailList.disheId;
        for (let i = 0; i < length; i++) {
          for (let j = 0; j < length; j++) {
            var one = list[j];

            if (one.groupId == groupId && one.detailList.disheId == disheId) {
              this.setData({
                push: one
              });
              return;
            } else {
              if (i == length - 1 && j == length - 1) {
                this.setData({
                  push: {}
                });
              }
            }
          }
        }
      }
    }
  }
});
