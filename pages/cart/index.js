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
4 计算商品的总价格
  1 获取缓存中的购物车数组
  2 循环 
    1 判断该商品的isChecked 是否为 true
    2 获取每个商品的单价 * 要购买的数量
    3 每个商品的总价 叠加计算 ++ 

5  复选框的选中功能
  1 绑定 change事件 给它的父元素 checkbox-group 添加！！ （和radio 一样  radio-group）
  2 把选中或者未选中的值 都写入到 data中 ， 缓存中 
  3 获取到当前的选中状态 （拿旧的选中状态 直接取反 ）

    给data赋值
    给缓存赋值 即可

6 编辑数量
  1 点击 "+" 或者 "-" 
  2 点击  "+" 执行数量 ++
  3 点击  "-" 执行数量 --
  4 其他情况 
    1 当数量 大于 等于 库存    提示用户即可
    2 当数量 小于 等于 1 的时候 提示用户 "是否要删除。。。"

7 全选
  1 数据的显示 - 把全选的显示功能 也放入到计算总价格和总数量中 函数 
  2 用户主动点击 “全选” 把 全选的状态 映射到 小商品的复选框中 
    1 对carts数组循环
      把每一个商品的选中状态 == 当前的全选状态即可 

8 点击 “结算”
  1 判断用户有没选择 收货地址 获取 选中的了商品
  2 验证是否通过
  3 直接跳转到结算页面！！ 
 */

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
    nums: 0,
    // 全选
    allChecked: false
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

  },
  // 计算总价格 -  计算购买的数量
  countAll(carts) {
    /* 
  1 获取缓存中的购物车数组
  2 循环 
    1 判断该商品的isChecked 是否为 true
    2 获取每个商品的单价 * 要购买的数量
    3 每个商品的总价 叠加计算 ++ 
     */
    let totalPrice = 0;
    let nums = 0;
    // 只要有一个商品没选中 它的值就是false
    let allChecked = true;
    carts.forEach(v => {
      if (v.isChecked) {
        totalPrice += v.nums * v.goods_price
        // 我们要的是总的数量 而不是要购买的种类！！
        nums += v.nums
      } else {
        // 未选中 
        allChecked = false;
      }
    })
    this.setData({
      totalPrice,
      nums,
      allChecked
    })
  },

  // 单个商品的选中事件
  checkboxChange(e) {
    /* 
    1 如何知道用户点击的是哪个 商品呢 （可以根据 id 或者索引来获取到该元素 ）
     */
    const { index } = e.currentTarget.dataset;
    let { carts } = this.data;
    // 对选中状态 做取反
    carts[index].isChecked = !carts[index].isChecked;

    // 2 把数组 设置回 data中 和 缓存中
    this.setData({
      carts
    })

    wx.setStorageSync("carts", carts);

    // 重新计算总价格   小程序中没有计算属性（页面中没有计算属性，组件中却是有计算属性！！！）
    this.countAll(carts);

  },
  // 数量的编辑 
  handleNumUpdate(e) {
    // unit = +1 || -1 
    // index 等于 要编辑的元素的索引 carts[index]
    const { unit, index } = e.currentTarget.dataset;
    // 获取到了 data中的购物车数组
    let { carts } = this.data;

    // 判断 数量是否超出界限 
    // 1 当数量大于等于库存 提示用户  unit也做判断 
    // 2 当数量等于1 unit也做判断 
    if (unit === 1 && carts[index].nums >= carts[index].goods_number) {
      wx.showToast({
        title: '库存不足了',
        icon: 'none',
        mask: true
      });
      return
    } else if (carts[index].nums === 1 && unit === -1) {
      // 提示用户 是否要删除商品
      wx.showModal({
        title: '警告',
        content: '您是否要删除该商品？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            /* 
            删除数组的一个元素而已！！
            */
            carts.splice(index, 1);
            this.setData({
              carts
            })
            wx.setStorageSync("carts", carts);
            this.countAll(carts);
          } else {
            console.log("取消");
          }
        }
      });
    } else {
      carts[index].nums += unit;

      this.setData({
        carts
      })
      wx.setStorageSync("carts", carts);

      this.countAll(carts);
    }

  },
  // 全选按钮
  handleItemAll() {
    //  1 获取自己的选中状态
    let { allChecked, carts } = this.data;
    allChecked = !allChecked;
    carts.forEach(v => v.isChecked = allChecked);
    this.setData({
      carts
    })

    wx.setStorageSync("carts", carts);
    this.countAll(carts);

  },
  // 结算事件
  goAccount() {
    // 1 获取收货地址
    // 2 获取用户 选中了 的商品的数组的长度  filter 
    // 也可通过 nums来做判断 都ok！！！

    const { address, carts } = this.data;
    if (!address.userName) {
      wx.showToast({
        title: '请选择您的收货地址',
        icon: 'none',
        mask: true
      });
      return
    } else if (carts.filter(v => v.isChecked).length === 0) {
      wx.showToast({
        title: '请选中要结算的商品',
        icon: 'none',
        mask: true
      });

      return
    }

    // 通过了验证的
    // console.log("跳转到结算页面了！");

    wx.navigateTo({
      url: '/pages/pay/index'
    });



  }
}) 