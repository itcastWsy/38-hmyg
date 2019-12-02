


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