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
5 缓存。。 
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
    rightGoods: []
  },
  // 全局的内部的数据  wxml中找不到   Cates
  // js内部要使用的全局数据 
  Cates: [],
  onLoad() {  

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
          rightGoods:this.Cates[0].children
        })

        // 右侧要实现的 商品数组 
        // console.log(this.Cates[0].children);

      })
    // console.log(mockData);
  }
})