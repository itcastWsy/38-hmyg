/* 
0 自己做个大概的分析
  1 静态页面 
  2 接口 数据 和 页面的映射关系 （复杂要做的 画图分析 - 当数据量很多的时候 把数据放入到vs code 中来分析）
1 静态页面布局
! 1 数据都回来了，但是不是要全部都渲染
!   只把看到的渲染  当用户点击左侧不同菜单的时候 才去显示被点击的菜单下的内容
2 左侧菜单动态渲染
3 右侧内容的动态渲染
4 点击左侧菜单 右侧内容动态渲染
  ? 使用css变量把主题色存下来  -  不是less中的变量 用的原生的css的变量
  * 1 左侧菜单的激活选中 
  ! 2 右侧的内容 跟着切换显示
todo 3 右侧列表 在被点击切换后，滚动条 都重新置顶！！！  
5 缓存。。 
  1 小程序中的本地存储 类似h5里面（有区别）
    1  h5的本地存储
      1 存普通的字符串！！
      2 存复杂数据（数组，对象） 要转成json字符串再存储 
      3 容量多少 20M或者5M 具体看浏览器版本 
      4 和cookie？？ 
        1 cookie 可以设置过期时间  自动失效 
        2 cookie 存多少 4KB
        3 cookie  浏览器的每次请求 都会自动带上 cookie到后台   
        4 本地存储 比 cookie 更加安全 
    2 localStorage vs sessionStorage 
      1 localStorage  永久存在 除非用户手动删除
      2 sessionStorage （会话存储 ）

  2  小程序中的本地存储 大体用法和  h5的类似 会更加的方便
      1 存入任意的数据类型，它都不会导致数据丢失
! 3 
  1 打开了分类页面的时候 先做一个判断 
    看本地存储里面有没有旧的数据
    1 假设没有旧数据 
      1 直接发送请求获取新的数据
      2 要新数据存到缓存中 
    2 假设有旧数据 但是 判断这个数据有没有过期  
      1 数据过期 
        1 直接发送请求获取新的数据
        2 要新数据存到缓存中 
      2 数据没有过期 才使用旧的缓存的数据 

 */

import request from "../../utils/request";

// 引入一个假数据
// import  mockData from "./mock";

Page({
  // wxml中 只能找到 data中的变量的数据 
  // data 中应该只存放 视图渲染 要用到的数据  
  // data中的数据越多 页面越卡！！！
  // 视图要使用的全局数据
  data: {
    // 分类数据
    // 左侧的标题数组
    // leftMenus:["大家电","海外购"....],
    leftMenus: [],
    // 右侧的内容 列表
    rightGoods: [],
    // 被激活的索引
    currentIndex: 0,
    // 右侧滚动条的高度
    scrollTop: 0
  },
  // 全局的内部的数据  wxml中找不到   Cates
  // js内部要使用的全局数据 
  Cates: [],
  onLoad() {
    // 假设缓存 这样存数据 list 格式 = this.Cates
    //  set("cates",{list:[],time:"1575017617705"})

    // this.getCates();

    // ! 获取缓存中的数据  默认值 是空字符串 
    const cates = wx.getStorageSync('cates');
    if (!cates) {
      console.log("没数据 发送请求");
      this.getCates();
    } else {
      // console.log("有数据");
      // 判断数据有没有过期 10s
      if (Date.now() - cates.time > 10 * 1000) {
        // 数据过期了
        console.log("数据过期了");
        console.log("重新发送请求获取数据和存储数据");
        this.getCates();
      } else {
        // 没有过期
        console.log("没有过期");
        this.Cates = cates.list;
        this.setData({
          leftMenus: this.Cates.map(v => v.cat_name),
          // 右侧的内容
          rightGoods: this.Cates[this.data.currentIndex].children
        })
      }
    }
  },


  // 发送异步请求
  getCates() {
    request({ url: "categories" })
      .then(res => {
        // console.log(res.data.message);
        // this.setData({
        //   cates:res.data.message
        // })
        this.Cates = res.data.message;
        // console.log(this.Cates.map(v=>v.cat_name));
        // 给左侧菜单数组赋值
        this.setData({
          leftMenus: this.Cates.map(v => v.cat_name),
          // 右侧的内容
          rightGoods: this.Cates[this.data.currentIndex].children
        })
        // 右侧要实现的 商品数组 
        // console.log(this.Cates[0].children);

        // 把数据存到缓存中 
        wx.setStorageSync("cates", { list: this.Cates, time: Date.now() });

      })
  }
  ,

  // 左侧菜单的点击事件
  handleMenuTap(e) {
    const currentIndex = e.currentTarget.dataset.index;
    this.setData({
      currentIndex,
      // 右侧的内容
      rightGoods: this.Cates[currentIndex].children,
      // 控制右侧列表的滚动条的 距离的！！
      scrollTop: 0
    })
  }
})