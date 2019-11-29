function axios({ url, ...params }) {
  const baseURL = "https://api.zbztb.cn/api/public/v1/";
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + url,
      ...params,
      success: (result) => {
        resolve(result);
      }
    });
  })
}


export default axios;
