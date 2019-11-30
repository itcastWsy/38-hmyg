/* 
1 发送请求获取数据 页面渲染
 */




import request from "../../utils/request";

Page({
  data: {
    goodsInfo:{}
  },

  onLoad: function (options) {
    this.getDetail(options.goods_id);
  },

  // 获取商品的详情数据
  getDetail(goods_id) {
    request({
      url: "goods/detail",
      data: {
        goods_id
      }
    }).then(res => {
      console.log(res);
      this.setData({
        goodsInfo:res.data.message
      })
    })

  }
})