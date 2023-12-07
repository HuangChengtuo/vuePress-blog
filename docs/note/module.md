# 模块化

## ESModule 和 CommonJS 比较

动态导入：ES module 支持动态导入，也就是在代码运行时根据需要导入模块。而 CommonJS 不支持动态导入  
作用域：ES module 的模块作用域是静态的，在模块中定义的变量和函数不会污染全局作用域。而 CommonJS 的模块作用域是动态的，模块中定义的变量和函数会被添加到全局作用域中  
异步加载：ES module 可以异步加载模块，以提高性能和减少启动时间。而 CommonJS 只能同步加载模块，浏览器可以通过 webpack 打包来实现 CommonJS  
兼容性：CommonJS 好  
导入数量：CommonJS 只支持一个

[Webpack 中 Loader 与 Plugin](https://blog.csdn.net/liu19721018/article/details/125763634)

## webpack

### plugin 执行时机

plugin 是通过扩展 webpack 功能，加入自定义的构建行为，使得 webpack 可以执行更广泛的任务。webpack 在编译代码过程中，会触发一系列 Tapable 钩子事件，插件所做的，就是找到相应的钩子，往上面挂上自己的任务，也就是注册事件，这样，当 webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行了。

## loader 顺序

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
}
```

顺序为从后往前 `less-loader` -> `css-loader` -> `style-loader`  
可以通过配置每个 loader 的 `enforce` 属性来改变顺序 pre > normal > inline > post

![loader](https://s1.huangchengtuo.com/img/231207loader.jpg)

正常情况 normal 和 pitching 阶段顺序相反

![loader](https://s1.huangchengtuo.com/img/231207pitching.png)

在 Pitching 阶段，如果当前 Loader.pitch 有返回值，就直接结束当前 loader 的 Pitching 阶段，并直接跳到当前 Loader 执行 pitching 阶段时的 前一个 loader 的 normal 阶段，然后继续执行

[学习webpack loader，这一篇文章足够了。从原因、原理、用法、自定义loader等方面解析，讲的明明白白！](https://juejin.cn/post/7283768998777061435?searchId=202312072047534726FA4385062C2826FF)
