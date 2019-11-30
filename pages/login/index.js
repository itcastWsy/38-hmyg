// pages/login/index.js
Page({
  data: {
    titles: [
      "综合",
      "销量",
      "价格"
    ],
    // 要显示的索引
    currentIndex: 1
  },
  // 接收子组件传递过来的数据 索引
  titleChange(e){
    // console.log(e);
    const {index}=e.detail;
  
    this.setData({
      currentIndex:index
    })
  }
})