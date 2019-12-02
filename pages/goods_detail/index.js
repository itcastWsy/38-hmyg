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
  },
  // 点击 “加入购物车”
  handleGoodsAdd() {
    /* 
    1 先获取缓存中的旧的购物车的数据  [{}] || []
    2 先判断当前的商品是否存在于 缓存中了
      1 没有 数组添加元素即可！
      2 已经添加过 
          获取到 数组的中的元素 对它的属性-购买数量 执行 ++ 即可
    3 把数组 重新添加到缓存中 ！！ 
     */

    //  1 获取购物车的数组 在缓存中
    let carts = wx.getStorageSync("carts") || [];
    // 2 判断 当前的商品是否已经存在了
    const index = carts.findIndex(v => v.goods_id === this.data.goodsInfo.goods_id);
    // 3 判断 当前的商品是否已经存在了
    if (index === -1) {
      // 不存在  顺便添加一个 购买数量 属性！！
      carts.unshift({
        ...this.data.goodsInfo,
        nums: 1
      });
    } else {
      // 已经存在了  执行数量 ++ 
      carts[index].nums++;
    }

    // 4 重新添加到缓存中
    wx.setStorageSync("carts", carts);

    wx.showToast({
      title: '添加成功',
      mask: true
    });








  }
})