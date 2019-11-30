/* 
1 在 分类页面 商品动态渲染的时候 加上 超链接 和 对应的分类id 
2 定义接口的参数 
  ! 为了方便修改 把参数变成全局变量 
3 发送请求 获取 商品列表数据
4 上拉加载下一页
  1 触发上拉事件 -  滚动条 触底事件 ？？？   onReachBottom
  2 判断有没有下一页的数据
    0 如何判断 
      1 前端分页  发送请求的时候 后台一次性返回所有数据 
  !   2  后端分页  前端只要把 页码 等参数发送到后台，后台 根据前端的参数 来返回数据
      3 获取当前的页码  和 总的页码比较即可  
        总条数 = 21  页容量 = 10
        总页数 = Math.ceil(总条数 / 页容量 )
    1 没有 提示用户
!  2 有数据 
   1  当前页码 ++ 
   2 再调用 获取接口数据的函数 
5 下拉刷新数据
  0 先触发下拉刷新事件  onPullDownRefresh
  1 当用户触发下拉刷新的时候 体验  ===  用户第一次打开 商品列表页面 
  2 思考
    1 先打开页面
    2 不断的加载下一页数据 加载第10页数据
      1 pagenum =10 
      2 页面的商品数据 很多  goods
    3 开始触发下拉刷新了 
      1 其实也是触发了一个事件
        1 数据重置 ！！ 
        2 goods =  第一页的10条数据即可
        3 pagenum=1
          goods=[]
          this.getList()


6 给商品列表添加默认图片
  1 在商品列表循环的时候 判断一下  goods_small_logo 是否为空即可

7 添加全局的加载中的效果
  1 在发送请求之前 显示 “加载中”
  2 在请求回来之后 隐藏 “加载中”
  
 */
import request from "../../utils/request";
Page(
  {
    // 全局的接口参数
    Params: {
      // 查询关键字 "小米"
      query: "",
      // 分类id
      cid: -1,
      // 页码 第几页 
      pagenum: 1,
      // 页容量 -> 每一页可以放几条数据
      pagesize: 10
    },

    // 总页数
    TotalPages: 1,
    data: {
      // 要显示的商品列表
      goods: []
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
        .then(res => {
          // 旧的数组
          const { goods } = this.data;
          this.setData({
            // 当我们做分页了  总的数据 应该是不断 追加的！！！ 
            goods: [...goods, ...res.data.message.goods]
          })

          // 计算总页数
          this.TotalPages = Math.ceil(res.data.message.total / this.Params.pagesize);
        })
    },

    // 滚动条 触底事件
    onReachBottom() {
      // 1 判断还有没有下一页数据
      if (this.Params.pagenum >= this.TotalPages) {
        // 没有下一页数据
        console.log("没有下一页数据");
      } else {
        // 有下一页数据
        this.Params.pagenum++;
        // 发送请求获取下一页的数据
        this.getList();
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      // console.log("狗丢了怎么办？？？  搜狗搜索！！！");
      this.Params.pagenum = 1;
      this.setData({
        goods: []
      })
      this.getList();
    }
  })