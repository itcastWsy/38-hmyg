
/* 
* 1 轮播图 
    0 在页面的onLoad事件中来发送异步请求 
    1 发送异步请求或者数据 ？
    2 把数据动态渲染出来
      1 利用 swiper标签
      2 利用 image标签 
! 2 
? 3 

 */
Page({
  data:{
    // 轮播图数组
    swiperList:[]
  },
  onLoad() {
    // 1 发送异步请求  https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html

    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success: (result) => {
        // 特别小心 箭头函数 和 this的关系 
        // console.log(result.data.message);
        this.setData({
          swiperList:result.data.message
        })
      }
    });


  }
})
