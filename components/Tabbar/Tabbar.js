// components/Tabbar/Tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题数组
    titles: {
      type: Array,
      value: []
    },
    // 要激活选中  索引
    currentIndex: {
      type: Number,
      value: 0
    }
  },



  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e) {
      const index = e.currentTarget.dataset.index;
      this.triggerEvent("titleChange", { index });
    }
  }
})
