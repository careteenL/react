## Fiber

目的是初识fiber并实现react基础功能

### 目录

- [ ] 浏览器任务调度策略和渲染流程
- [ ] 实现React16下的虚拟DOM
- [ ] 实现Fiber的数据结构和遍历算法
- [ ] 实现Fiber架构下可中断和恢复的的任务调度

- [ ] 实现Fiber架构下的组件渲染和副作用收集提交
- [ ] 实现Fiber中的调和和双缓冲优化策略
- [ ] 实现useReducer和useState等Hooks

- [ ] expirationTime 任务的优先级 任务调度 超时时间的处理
- [ ] reconcile domdiff的优化key处理
- [ ] 合成事件 SyntheticEvent
- [ ] ref useEffect


### 浏览器任务调度策略和渲染流程

TODO 吃鸡的卡顿gif

玩吃鸡时需要流畅的刷新率，也就是至少60赫兹。不然大概率你就是送快递的。

TODO 手绘一个帧

一帧平均是16.66ms，主要分为以下几个部分
- 脚本执行
- 样式计算
- 布局
- 重绘
- 合成

在样式计算之前会执行脚本计算中使用到`requestAnimationFrame`的callback
  > 如果你还不了解[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)，前往mdn查看实现的进度条示例。

在合成后还存在一个`空闲阶段`，即合成及之前的所有步骤耗时若不足`16.66ms`，剩下的时间浏览器为我们提供了`requestIdleCallback`进行调用，对其充分利用。
  > [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)目前只支持chrome，需要[polyfill](./requestIdleCallback.polyfill.js)

TODO 手绘requestIdleCallback执行过程

TODO 执行过程

TODO 简易示例

### 链表

TODO 示例
> [更多关于链表实现和使用](https://github.com/careteenL/data-structure_algorithm/blob/0816-leetcode/src/data-structure/linked-list.md)
