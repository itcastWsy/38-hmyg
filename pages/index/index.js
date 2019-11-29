
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

//  引入统一发送异步请求的函数
import request from "../../utils/request";



Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航
    navs: [],
    // 楼层数组
    floorList: []
  },
  onLoad() {
    request({ url: "home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        })
      })

    request({ url: "home/catitems" })
      .then(result => {
        this.setData({
          navs: result.data.message
        })
      })

    request({ url: "home/floordata" })
      .then(result => {
        this.setData({
          floorList: result.data.message
        })
      })

  }
})
