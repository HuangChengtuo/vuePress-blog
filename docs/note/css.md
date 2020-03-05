# CSS
## position

| 属性值 | 描述 |
|---|---|
| absolute | 绝对定位，脱离文档流，与外部元素影响，相对于 static 以外第一个父元素 |
| fixed | 绝对定位，脱离文档流与外部元素影响，相对于浏览器窗口 |
| relative | 相对定位，相对于正常位置 |
| static | 默认 |
| inherit | 继承 |

## 选择器优先级
!important
内联样式  
选中器中给定的ID属性值  
选择器中给定的类属性值，属性选择或伪类  
选择器中给定的元素选择器和伪元素  
结合符和通配符选择器对优先级没有任何贡献  

## BFC
块级格式化上下文，BFC 内部的元素与外部元素互不影响

### BFC 创建方法
* 根元素或其它包含它的元素；
* 浮动 (元素的float不为none)；
* 行内块inline-blocks(元素的 display: inline-block)；
* 表格单元格(元素的display: table-cell，HTML表格单元格默认属性)；
* overflow的值不为visible的元素；
* 弹性盒 flex boxes (元素的display: flex或inline-flex)；

### BFC 作用
避免 margin 重叠  
避免 margin 坍缩  
清除浮动，防止父元素高度坍缩  
不会与其他 float 重叠，（BFC 内部仍会重叠）  
[学习 BFC (Block Formatting Context) - 掘金](https://juejin.im/post/59b73d5bf265da064618731d)
