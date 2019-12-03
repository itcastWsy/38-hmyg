


/**
 * 获取微信的授权信息
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: () => { },
      complete: () => { }
    });
  })
}

/**
 * 获取收货地址
 */
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: () => { },
      complete: () => { }
    });
  })
}
/**
 *  打开授权设置页面
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: () => { },
      complete: () => { }
    });
  })
}



/**
 * 执行登录
 */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result);
      }
    });
  })
}
// /**
//  * 根据高度和名称来执行登录
//  * @param {Number} num 高度
//  * @param {String} str 名称
//  */
// export const login = (num,str) => {
//   return new Promise((resolve, reject) => {
//     wx.login({
//       timeout: 10000,
//       success: (result) => {
//         resolve(result);
//       }
//     });
//   })
// }


