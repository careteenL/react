# React

## React

- 发展历程
  - 0.3 - 0.14（2013 - 2016）
    - jsx
    - 函数组件，但无状态
    - 提供 propTypes 做组件属性类型检查
  - react15（2016 - ）
    - 提供 dangerousSetInnerHtml 插入原始 dom，类似于 vue 的 v-html
    - 提供 createPortal 支持组件可以渲染到父组件以外的 dom 节点
  - react16（2017 重要）
    - 引入异步渲染和 fiber 架构
  - react16.3（2018.3）
    - 引入 context api，更好管理状态和数据共享
  - react16.6（2018.11）
    - 引入 memo、lazy 做性能优化
  - react16.8（2019.2）
    - 引入 hooks，函数组件支持生命周期和使用状态
  - react17（2020）
    - 解决了现有问题
  - react18（2022）
    - 引入并发模式 concurrent mode
    - setState 自动批处理
    - 并发模式相关新 hook：useTransition、useDeferredValue
- react 类组件
- react 函数组件
- jsx 虚拟 dom
- fiber 架构
  - 诞生的原因：react15 前有性能瓶颈，一次性收集和更新所有的改动，屏幕的刷新率是 1s60 次，也就是一帧渲染是 16.6ms，如果一帧渲染时间超过这个值，用户就会感知到页面的卡顿，所以需要对改动做拆分成一个个很小的任务，分布在每一帧里，也就是做时间切片。
  - 实现：利用一帧在渲染时是有 样式的计算、布局、绘制，然后还有一个空闲阶段，使用 window.requestIdleCallback 则可以利用这部分时间。
  - 双缓冲机制：复用前一个节点，节省空间
- hook
- 合成事件
  - 事件流：事件捕获、目标阶段、事件冒泡
  - 事件代理：利用事件冒泡特性
  - react16 是委托到 document 上，但当多个 react 实例存在时，一个地方阻止时间默认行为时，另一个也会生效，所以在 react17 是委托到 render 时绑定的节点
- diff
  - 同级元素比较，不同级不比较
  - 不同类型不比较
  - 同级同类型根据 key 来标识
  - 三轮遍历
    - 第一轮：标记出 oldFiber 哪些需要删除，哪些可以复用
    - 第二轮：newFiber 新增，删除老 fiber
    - 第三轮：移动复用的节点
- 调度 scheduler
  - 优先级
  - 处理超时时间
    - 超时的先执行，再执行优先级高的
    - 超时的会一气呵成执行，不能中断
  - 高优先级打断低优先级
  - 使用过期时间来解决饥饿问题（低优先级任务多次被高优先任务中断，而得不到执行）
    - 每个优先级都有一个过期时间，如果在过期时间内没得到执行，则会将优先级提升为同步，即马上执行
- 数据结构和算法
  - 链表
    - 构建 fiber 类似于二叉树的先序遍历
    - fiber 的完成收集 类似于二叉树的后续遍历，需要保证子节点先完成，再创建父节点
    - 构建 hook
  - 循环链表
    - 实现 this.setState 批量更新
  - dfs
    - 根据真实 dom 构建虚拟 dom
    - 构建 fiber
  - 最小堆
    - 实现根据 lane 调度优先级
    - lane 使用二进制表示，值越小，优先级越高
  - 位运算
    - 原码、反码、补码
      - 使用补码来实现加法代替减法
      - 负数使用补码来表示
    - 构建 最小堆 时从哪个位置开始
    - 左移相当于乘法 \*2
    - 右移相当于除法 /2 向下取整
  - 栈
    - 实现 context provider
  - 队列
    - 实现合成事件的事件流执行顺序
- 水合 hydration
  - ssr 在服务端先注水（调接口）再脱水（转成字符串），发送到客户端后再注水（调动态接口）
- createContext
  - Provider
  - Consumer useContext
  - 只对 provider 包裹的子组件生效，在外面取值是初始化的
  - antd 的 form 使用 context 实现

### 资料

- [React 基础与进阶 juejin 伢羽](https://juejin.cn/column/7142674773930147853)
- [React18 新特性介绍&&升级指南](https://juejin.cn/post/7104917497530286111)
  - [React18 并发模式 demo 代码](https://codesandbox.io/p/sandbox/winter-cherry-ss-forked-pxnphz?file=%2Fsrc%2Findex.js)
- [彻底搞懂 React 18 并发机制的原理 - 神光](https://juejin.cn/post/7171231346361106440)

## React-Router-Dom

- react-router-dom 发展历程
  - v3
  - v4
  - v5
  - v6
- 路由模式
  - HashRouter
  - BrowserRouter
  - 使用 aop 的思想，重写原生的 onhashchange、popState 事件，然后触发 react 的 render
- path-to-regexp
  - 使用正则解析 /user/:id/:key 路径的匹配和对应字段取值
- \*通配优先级最低，路由深度越大优先级越高，优先级主要是对路由做排序，然后渲染的时候从上往下匹配
- outlet

### 资料

- [官方文档](https://github.com/remix-run/react-router)
- [React Router 6 重磅来袭（15 分钟了解它的前世今生和未来）](https://zhuanlan.zhihu.com/p/433876168)

## Redux

### 资料

## Dva

### 资料

## Umi

- keep alive 方案
  - KeepAliveLayout
  - 需要缓存的路由
  - patchKeepAlive
  - dropByCacheKey

### 资料

## react ssr

- 利于 seo；加快首屏渲染；
- 同构，build client server 两份代码
- 处理 router
- 处理 redux
- 处理样式
  - iso-style-loader
- 处理 tdk
  - react-helmet
