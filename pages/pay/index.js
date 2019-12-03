
/* 
0 因为后续的功能都是发送请求的 做很多的嵌套 我们要使用 es7 async方式
1 创建订单
  1 post
  2 请求头中加入 数据  headers:{Authorization:token }    jwt => json web token 
  3 用户登录 
    1 单单指 执行一段代码 wx.login 返回的是 微信给你的 令牌 
    2 要我自己 调用一个自己的后台的登录 来返回自己后台给的数据 
      电商项目 -> 自己定义的 令牌
      外卖项目 ->  自己定义的 令牌 
2 先在自己的后台服务器上执行 登录 /users/wxlogin
  1 post
  2 执行小程序的登录 来获取 code字段
  3 借助 button的功能 来获取 用户的信息
      encryptedData
      rawData
      iv
      signature



 */



import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting, chooseAddress, openSetting, login, requestPayment } from "../../utils/wxAsync";
import request from "../../utils/request";
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
    // carts 应该要返回用户选择了的商品
    this.setData({
      address, carts: carts.filter(v => v.isChecked)
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
  },
  // 点击支付
  async handleGetUserInfo(e) {
    // 1 获取用户信息中  rawData。。。
    const { encryptedData, rawData, iv, signature } = e.detail;
    // 2 执行微信小程序的内置的登录 获取 code 
    const { code } = (await login());
    const loginParams = {
      encryptedData, rawData, iv, signature, code
    }
    //  3 获取用户的token
    // 可能因为后台的接口问题 我们自己再做测试的时候 要多点几次为准 
    // const res = await request().data.message.token
    const token = (await request({ url: "users/wxlogin", method: "post", data: loginParams })).data.message.token

    // 4 获取订单编号要 参数
    let orderParams = {
      // 订单的总价格
      order_price: this.data.totalPrice,
      // 收货地址(暂时只写省份)
      consignee_addr: this.data.address.provinceName,
      // 商品数组 具体的说明看接口文档
      goods: this.data.carts.map(v => (
        {
          goods_id: v.goods_id,
          // 购买的数量
          goods_number: v.nums,
          goods_price: v.goods_price
        }))
    }

    // 5 创建订单 获取订单编号 
    const order_number = (await request({ url: "my/orders/create", method: "post", data: orderParams, header: { Authorization: token } })).data.message.order_number;

    // 6 获取支付参数
    const pay = (await request({ url: "my/orders/req_unifiedorder", method: "post", data: { order_number }, header: { Authorization: token } })).data.message.pay;

    // 7 调起微信支付   手机会出现支付的画面 
    const res = (await requestPayment(pay));

    // 8 还需要查看一下 我们自己的后台的订单状态
    const res1 = (await request({ url: "my/orders/chkOrder", method: "post", data: { order_number }, header: { Authorization: token } }));

    // 9 支付成功了 
    // 1 把缓存中的已经支付了的商品 删除掉 
    // 2 弹出窗口 提示用户 支付成功
    // 3 跳转到 订单页面即可


    // 9.1 获取缓存中的完整的购物车数据
    let carts = wx.getStorageSync("carts");
    // 留下未选中的商品即可
    carts = carts.filter(v => !v.isChecked);
    wx.setStorageSync("carts", carts);
    // 9.2 弹出窗口 提示用户 
    wx.showToast({
      title: '支付成功',
      duration: 1500,
      mask: true,
      success: (result) => {
        // 9.3  跳转到 订单页面即可
        wx.navigateTo({
          url: '/pages/order/index'
        });
      }
    });
  }
})


