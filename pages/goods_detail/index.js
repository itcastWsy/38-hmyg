/* 
1 发送请求获取数据 页面渲染
2 点击轮播图 放大图片 https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
  1 先绑定点击事件
  2 获取一些参数  urls=["图片的路径], current="当前要预览的图片的路径"


 */




import request from "../../utils/request";

Page({
  data: {
    goodsInfo: {}
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
        goodsInfo: res.data.message
      })
    })

  },


  // 点击轮播图 放大预览
  handlePreviewImg(e) {
    // console.log("我最喜欢的女明星:摁住啦 baby");
    // console.log(e.currentTarget.dataset.src);
    // 当前被点击的大图片路径
    const current = e.currentTarget.dataset.src;
    // 要预览的整个图片列表
    const urls = this.data.goodsInfo.pics.map(v => v.pics_big);
    // 开始预览
    wx.previewImage({
      current,
      urls
    });
  }
})