/* 
1 在 分类页面 商品动态渲染的时候 加上 超链接 和 对应的分类id 
2 定义接口的参数 
  ! 为了方便修改 把参数变成全局变量 
3 发送请求 获取 商品列表数据

 */



import request from "../../utils/request";

Page({
  // 全局的接口参数
  Params: {
    // 查询关键字 "小米"
    query: "",
    // 分类id
    cid: -1,
    // 页码 第几页 
    pagenum: 1,
    // 页容量 -> 每一页可以放几条数据
    pagesize: 2
  },


  data:{
    // 要显示的商品列表
    goods:[]
  },



  onLoad(options) {
    this.Params.cid = options.cid;
    
    this.getList();
  },

  // 获取商品列表数据
  getList() {
    request({
      url: "goods/search",
      data: this.Params
    })
    .then(res=>{
      console.log(res);

      this.setData({
        goods:res.data.message.goods
      })

      // console.table(res.data.message.goods)
    })



  }



})