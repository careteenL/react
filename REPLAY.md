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
  - react19（2024）
    - useActionState
    - use 类似钩子，但可以条件渲染
    - ref 可以作为属性传递
    - context 可以直接使用，不用.Provider
    - 对文档元数据支持，不用再使用 react-helmet，直接写meta/link/title标签元素，会自动提升到 head 标签中
    - React compiler
      - react state、props、context 状态变更时，更新机制会从最顶层根节点开始往下递归对比，通过双缓存机制判断出哪些节点发生了变化，然后更新节点。
      - 解决由于父组件状态变更，而导致子组件 re-render 的场景
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
- [React 19 Beta 都更新了啥](https://mp.weixin.qq.com/s/lFdrgzWEIHJGV71iMqugUg)
- [苦等三年，React Compiler 终于能用了。使用体验：很爽，但仍有瑕疵](https://mp.weixin.qq.com/s/0ejbUqLFO647aNz7iZFZ6w)

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
  - staticRouter 做包裹，并传 ctx.path ，使访问服务端对应路由时能让客户端路由修正正确
- 处理 redux
  - 在组件和路由处 定义 loadData 函数去 dispatch 获取异步数据，然后进行返回
  - 在服务端中调用 loadData 函数得到数据，进而存放在 window.context.state 中
  - 客户端在访问时，优先从 window.context.state 获取并赋值给 redux 的 defaultState
- 处理样式
  - iso-style-loader
- 处理 tdk
  - react-helmet

## nextjs

- csr client side render 客户端渲染
  - 服务端返回空节点，客户端进行渲染
  - 首屏加载时间会比较慢，不利于 seo
- ssr server side render 服务端渲染
  - 同上方 react ssr
- ssg static site generate 静态站点生成
  - 渲染最快，适合内容不常变化的页面
  - 使用 getStaticProps 给服务端传递数据，服务端根据数据生成页面后再 build 出来
  - 动态路由时还需使用 getStaticPaths 来获取需要预渲染的路径
- isr increase static 增量静态生成
  - 结合 ssr 和 ssg 在性能和内容更新之间做了平衡
  - 使用方式与 ssg 类似
  - getStaticProps 时返回 revalidate 即重新校验的时间，每间隔会重新生成
  - getStaticPaths 时返回 fallback: blocking 表示当渲染未被预渲染的路径时，会等待 getStaticProps 完成并生成该页面，再提供给用户，也意味着用户需要等待
- 应用
  - saas 官网采用 react 去重构 velocity 服务端渲染的方式
    - velocity 服务端渲染后端为 java，官网项目往往是纯前端展示，其实不需要，故需重构为纯前端控制的 ssr
  - 官网首页会经常变化，则适合使用 ssr
  - 合作等页面常年不变，则适合使用 nextjs 的 ssg
- 服务端相关知识如何考虑？
  - TODO
  - 负载均衡？
  - 如何压测？QPS？
  - 日活月活多少？
  - 页面性能各个指标？

### 资料

- [讲清楚 Next.js 里的 CSR, SSR, SSG 和 ISR](https://juejin.cn/post/7273674732447711295)
- [.next项目服务端渲染部署中的负载均衡实现](https://juejin.cn/post/6844904117123416078)

## 请求库解决方案

- ahooks useRequest
- useSWR stale-while-revalidate
  - 原理是 http cache-control: max-age=300, stale-while-revalidate=30
  - 即 300s 内浏览器不会发起请求，而是从磁盘中读取已获取的数据；在 300s-330s 期间再访问仍然会使用缓存结果，与此同时进行异步 revalidate，也就是会发起请求响应会作为下次访问时使用（但是会牺牲这个期间的数据新鲜）；在 330s 后的访问会重新调接口并使用新数据
- react-query

### 资料

- [聊聊 useSWR，为开发提效 - 包括 useSWR 设计思想、优缺点和最佳实践](https://juejin.cn/post/6943397563114455048)
- [面试官：请使用 JS 简单实现一套 SWR 机制](https://cloud.tencent.com/developer/article/2047215)
