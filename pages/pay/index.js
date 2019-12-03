
import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting, chooseAddress, openSetting } from "../../utils/wxAsync";
Page({
  data: {
    // 用户的收货地址
    address: {},
    // 购物车数组
    carts: [],
    // 商品的总价格
    totalPrice: 0,
    // 结算的数量
    nums: 0
  },

  onShow() {
    const carts = wx.getStorageSync("carts") || [];
    // address = { 对象 } || 空字符串
    const address = wx.getStorageSync("address") || {};
    this.setData({
      address, carts
    })

    this.countAll(carts);
  },
  // 计算总价格 -  计算购买的数量
  countAll(carts) {
    let totalPrice = 0;
    let nums = 0;
    carts.forEach(v => {
      if (v.isChecked) {
        totalPrice += v.nums * v.goods_price

        nums += v.nums
      }
    })
    this.setData({
      totalPrice,
      nums
    })
  }

})




