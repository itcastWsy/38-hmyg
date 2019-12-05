/* 
1 给输入框绑定一个值 的输入事件  input事件 
2 在事件中 获取到 用户输入的值 “华为”
3 拿到输入的值 再拼接成参数 发送到后台
4 后台返回 数组
5 拿到数组 循环显示即可 

6  解决页面抖动的问题
  1 希望当用户的输入 “稳定” 之后 才发送异步请求 
  2 当用户在短时间内 1s内 连续的输入 我们不管它
    但是 当用户 输入 停止了 1s后 我们发现 没有新的输入 
    我们才发送异步请求！！


 */


import request from "../../utils/request";



//  定时器的id的默认值
let timeId = -1;


Page({
  data: {
    list: []
  },
  // 输入框的输入事件  小米
  handleInput(e) {
    /* 
    
    1 当用户第一次输入的时候 开始一个定时器    id= 0  1s后执行 
    2 当用户 在 1s 之内 有了第二次的输入   
      先执行 clearTimeout(timeId); 
      也开启了一个新的定时器 id=1 
    3 重复 步骤2 
      。。。。。
    
    */
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      const value = e.detail.value;

      request({ url: "goods/qsearch", data: { query: value } }).then(res => { this.setData({ list: res.data.message }) })
    }, 1000);


  }
})