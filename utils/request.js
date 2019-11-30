

/* 
1 假设同时发送了3个请求出去
  都显示 加载中 
2 第一个请求 很快就回来了
  把加载中 给关闭了！！
3 后两个请求 还在外面 还在加载数据
  这时候 界面上已经没有了加载中的效果了………………

  
3 等到三个请求都 回来了 
  只要最后一个请求回来了 执行关闭就可以了！！ 
  才把 加载中的效果 给关闭！！！ 

4 promiseAll  

 */


//  定义一个变量 记录同时发送请求的个数
let ajaxCount = 0;


function axios({ url, ...params }) {
  // console.log("发送请求");
  ajaxCount++;
  const baseURL = "https://api.zbztb.cn/api/public/v1/";
  return new Promise((resolve, reject) => {
    // 显示加载中 
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    wx.request({
      url: baseURL + url,
      ...params,
      success: (result) => {
        resolve(result);
      },
      complete() {
        ajaxCount--;
        if (ajaxCount === 0) {
          // 都回来了
          // console.log(ajaxCount);
          // console.log("最后一个请求回来了");
          // 不管请求是否成功 都会触发的回调函数
          wx.hideLoading();
        }
      }
    });



  })
}

export default axios;
