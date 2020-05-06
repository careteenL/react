## Fiber

目的是初识fiber并实现react基础功能

### 目录

- [ ] 浏览器任务调度策略和渲染流程
- [ ] 链表
  - 模拟setState
- [ ] Fiber是什么
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

由于数组的大小是固定的，从数组的起点或者中间插入或移除项的成本很高。链表相对于传统的数组的优势在于添加或移除元素的时候不需要移动其他元素，**需要添加和移除很多元素时，最好的选择是链表，而非数组。** 链表在React的Fiber架构和Hooks实现发挥很大的作用。

#### 模拟setState

TODO 手绘链表执行图

如上可以使用链表实现类似于`React的setState方法`。

```js
// 表示一个节点
class Update {
  constructor(payload, nextUpdate) {
    this.payload = payload
    this.nextUpdate = nextUpdate
  }
}
```
一个节点需要`payload`挂载数据，`nextUpdate`指向下一个节点。
```js
// 模拟链表
class UpdateQueue {
  constructor() {
    this.baseState = null
    this.firstUpdate = null
    this.lastUpdate = null
  }
  enqueue(update) {
    if (!this.firstUpdate) {
      this.firstUpdate = this.lastUpdate = update
    } else {
      this.lastUpdate.nextUpdate = update
      this.lastUpdate = update
    }
  }
}
```
链表初始化时需要`baseState`存放数据，`firstUpdate`指向第一个节点，`lastUpdate`指向最后一个节点。

以及`enqueue`将节点串联起来。
```js
const isFunction = (func) => {
  return typeof func === 'function'
}
class UpdateQueue {
  forceUpdate() {
    let currentState = this.baseState || {}
    let currentUpdate = this.firstUpdate
    while(currentUpdate) {
      const nextState = isFunction(currentUpdate.payload) ? currentUpdate.payload(currentState) : currentUpdate.payload
      currentState = {
        ...currentState,
        ...nextState
      }
      currentUpdate = currentUpdate.nextUpdate
    }
    this.firstUpdate = this.lastUpdate = null
    return this.baseState = currentState
  }
}
```
还需要`forceUpdate`将所有节点挂载的数据合并。类似于`React的setState`参数可对象可函数。

> [更多关于链表的实现和使用](https://github.com/careteenL/data-structure_algorithm/blob/0816-leetcode/src/data-structure/linked-list.md)

### Fiber是什么

#### 为什么需要Fiber

#### Fiber如何工作
