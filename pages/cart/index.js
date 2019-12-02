/* 
1 获取用户的收货地址
  1 设置个人的收货地址
    1 用户可以在微信中 设置N个收货地址 
    2 其他的微信小程序 可以 获取到 用户设置好的收货地址
    3 其他的微信小程序 可以共享 相同的收货地址 
! 2 在小程序中来获取用户已经设置好的收货地址
  1 如果 按照 最简单的流程 该功能很容易
    1 在API中已经封装好了 
  2 但是 当用户点击了拒绝了  此时 开发者就无法再去获取用户的收货地址（体验是有问题的！！）

todo 3
  1  当用户第一次点击获取地址的时候 
      1 用户点击 授予获取地址 按钮  自己直接获取 返回值即可
  2  当用户第一次点击获取地址的时候 
      1 点击了 “拒绝”
      2 当用再次点击 “收货” 按钮的时候 无法去拿地址了
  3  应该要这么做
    1 弹出窗口- 授权设置页(button-open-type-openSetting) 
      用户自己选择 “允许该小程序 获取 我的收货地址”

? 4 正确的流程（看这个即可 ）
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

 */

Page({
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        console.log("成功");
        console.log(result);
      },
      fail: (err) => {
        console.log("失败");
        console.log(err);
      }
    });

  },
  // 获取用户的授权状态
  handleGetAuth() {
    wx.getSetting({
      success: (result) => {
        console.log(result);
      },
      fail: () => { },
      complete: () => { }
    });
  },
  // js的方式打开设置页面
  handleOpenSetting() {
    wx.openSetting({
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },
  handleFinalGet() {
    // const result1 = {
    //   0: "hellow",
    //   ")": 232323,
    //   "+": 343434
    // }
    //  当属性名 属于笔记 奇葩的时候  要这么拿 obj["属性名"]来获取

    // console.log(result1["0"]);
    // console.log(result1[")"]);
    // console.log(result1["+"]);
    // return;
    // 1 先获取用户的授权状态
    wx.getSetting({
      success: (result) => {
        // 属性名比较奇怪的时候 需要通过 []来获取
        const auth = result.authSetting['scope.address'];
        // 当auth=undefined 或者true 都可以直接获取游用户的收货地址
        if (auth === undefined || auth === true) {
          // 直接获取用户的收货地址
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1);
            }
          });
        } else {
          // 用户曾经点击了 "拒绝"
          wx.openSetting({
            success: (result2) => {
              // 直接获取收货地址
              wx.chooseAddress({
                success: (result1) => {
                  console.log(result1);
                }
              });
            }
          });

        }
      },
      fail: () => { },
      complete: () => { }
    });

  }
})