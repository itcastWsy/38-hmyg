/* 


1 正确的流程（看这个即可 ）
    1 当用户点击获取收货地址的时候 先判断 用户有没有授予权限-收货  其实就是一个变量 auth
      1 当 auth = undefined  表示 用户是第一次点击 获取收货-按钮 
      2 当 auth = true  表示 用户已经给与 权限 已经允许
      3 当 auth =  false 表示 用户 曾经拒绝过！！
    2 当  auth = undefined 或者  true 的时候
      我们都可以直接获取用户的 收货地址
    3 当 auth =  false
      1 先打开 用户授权设置页面  -- 两种的方式来打开用户权限设置页面（1 api提供，直接打开即可 ）
      2 用户自己 打开 获取收货的授权
      3 再获取用户的 收货地址

    4 修改成 async的方式 

2 打开页面的时候
  1 判断一下有没有收货地址的信息 （通过本地存储来判断）
    1 没有 就显示收货地址的按钮 
    2 有信息 把收货地址 显示到页面上即可  

3 购物
  1 数据在哪里 ？ 
    1 在商品的详情页面 点击 “加入购物车” 
      1 把购物车相关的数据 发送到后台 ！！！ 
  !   2 自己在小程序的缓存中 来存储 商品数据  数组格式 
      
  2 页面一打开 获取缓存中的购物车数据 循环显示即可 
        
 */

import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting, chooseAddress, openSetting } from "../../utils/wxAsync";


Page({

  data: {
    // 用户的收货地址
    address: {},
    // 购物车数组
    carts: []
  },


  // 页面启动完毕就加载 
  onLoad() {
    // address ={对象}  || 空字符串
    // const address = wx.getStorageSync("address") || {};
    // this.setData({
    //   address
    // })
    console.log("onLoad");

    const carts = wx.getStorageSync("carts") || [];
    this.setData({
      carts
    })


  },
  onShow() {
    // address = { 对象 } || 空字符串
    const address = wx.getStorageSync("address") || {};
    this.setData({
      address
    })
  },


  // 点击按钮 获取收货地址
  async handleFinalGet() {
    // 1 获取用户的授权状态
    const auth = (await getSetting()).authSetting["scope.address"];
    if (auth === false) {
      // auth===false
      await openSetting();
    }
    const res = await chooseAddress();
    // 把数据存到缓存中
    wx.setStorageSync("address", res);


  }
})