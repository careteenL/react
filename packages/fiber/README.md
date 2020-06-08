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
  > [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)目前只支持chrome，需要[polyfill](https://github.com/careteenL/react/blob/master/packages/fiber/utils/requestIdleCallback.polyfill.js)

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

在`React15`及之前，`React`会递归比对`VirtualDOM`树，找出需要变动的节点，然后同步更新它们。这个过程`React`称为`Reconciliation(协调)`。

在`Reconciliation`期间，`React`会一直占用着浏览器资源，一则会导致用户触发的事件得不到响应, 二则会导致掉帧，用户可能会感觉到卡顿。如下模拟其遍历过程

##### React15的DOMDIFF

TODO 手绘节点结构图

将上图节点结构映射成虚拟DOM
```js
const root = {
  key: 'A1',
  children: [
    {
      key:  'B1',
      children: [
        {
          key: 'C1',
          children: []
        },
        {
          key: 'C2',
          children: []
        }
      ]
    },
    {
      key:  'B2',
      children: []
    }
  ]
}
```
采用深度优先算法对其遍历
> [详解DFS](https://github.com/careteenL/data-structure_algorithm/blob/0816-leetcode/src/algorithm/recursion/dfs-bfs.md#dfs)
```js
function walk(vdom, cb) {
  cb && cb(vdom)
  vdom.children.forEach(child => walk(child, cb))
}
// Test
walk(root, (node) => {
  console.log(node.key)
})
```
在`Dom-Diff`时也是如此递归遍历对比，且存在两个非常影响性能的问题。
- 树节点庞大时，会导致递归调用执行栈越来越深
- 不能中断执行，页面会等待递归执行完成才重新渲染
> [详解React的Dom-Diff](https://github.com/careteenL/react/tree/master/examples/dom-diff)

#### Fiber是什么

- Fiber是一个执行单元
- Fiber也是一种数据结构

##### Fiber是一个执行单元

上面`浏览器任务调度过程`提到在页面合成后还存在一个空闲阶段`requestIdleCallback`。

TODO 手绘React结合空闲阶段的调度过程

Fiber是一个执行单元，每次执行完一个执行单元，React就会检查现在还剩多少时间，如果没有时间就将控制权交还浏览器；然后继续进行下一帧的渲染。

##### Fiber也是一种数据结构

TODO 手绘Fiber数据结构

React中使用链表将`Virtual DOM`链接起来，每一个节点表示一个Fiber

```js
class FiberNode {
  constructor(type, payload) {
    this.type = type // 节点类型
    this.key = payload.key // key
    this.payload = payload // 挂载的数据
    this.return = null // 父Fiber
    this.child = null // 长子Fiber
    this.sibling = null // 相邻兄弟Fiber
  }
}

// Test
const A1 = new FiberNode('div', { key: 'A1' })
const B1 = new FiberNode('div', { key: 'B1' })
const B2 = new FiberNode('div', { key: 'B2' })
const C1 = new FiberNode('div', { key: 'C1' })
const C2 = new FiberNode('div', { key: 'C2' })

A1.child = B1
B1.return = A1
B1.sibling = B2
B1.child = C1
B2.return = A1
C1.return = B1
C1.sibling = C2
C2.return =  B1
```

##### 小结
- 我们可以通过某些调度策略合理分配CPU资源，从而提高用户的响应速度
- 通过Fiber架构，让自己的Reconciliation过程变得可被中断，适时地让出CPU执行权，可以让楼兰器及时地响应用户的交互

#### Fiber执行阶段

每次渲染有两个阶段：`Reconciliation`（协调/render）阶段和`Commit`（提交）阶段

- 协调/render阶段：可以认为是Diff阶段，这个阶段可以被中断，这个阶段会找出所有节点变更，例如节点增删改等等，这些变更在React中称为Effect（副作用）。
- 提交阶段：将上一个阶段计算出来的需要处理的副作用一次性执行。这个阶段不能中断，必须同步一次性执行完。


#### Reconciliation阶段

下面将上面讲到的几个知识点串联起来使用。
> 此阶段测试例子[fiberRender.html](https://github.com/careteenL/react/tree/master/packages/fiber/utils/fiberRender.html)，核心代码存放[fiberRender.js](https://github.com/careteenL/react/tree/master/packages/fiber/utils/fiberRender.js)。

上面`Fiber也是一种数据结构`小结已经构建了Fiber树，然后来开始遍历，在第一次渲染中，所有操作类型都是新增。
> 根据`Virtual DOM`去构建`Fiber Tree`

```js
nextUnitOfWork = A1
requestIdleCallback(workLoop, { timeout: 1000 })
```
空闲时间去遍历收集`A1`根节点
```js
function workLoop (deadline) {
  // 这一帧渲染还有空闲时间 || 没超时 && 还存在一个执行单元
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork) // 执行当前执行单元 并返回下一个执行单元
  }
  if (!nextUnitOfWork) {
    console.log('render end !')
  } else {
    requestIdleCallback(workLoop, { timeout: 1000 })
  }
}
```
- 当满足`这一帧渲染还有空闲时间或没超时 && 还存在一个执行单元`时去执行当前执行单元 并返回下一个执行单元。
- 不满足上面条件后若还存在一个执行单元，会继续下一帧的渲染。
  - 不存在执行单元时，次阶段完成。

```js
function performUnitOfWork (fiber) {
  beginWork(fiber) // 开始
  if (fiber.child) {
    return fiber.child
  }
  while (fiber) {
    completeUnitOfWork(fiber) // 结束
    if (fiber.sibling) {
      return fiber.sibling
    }
    fiber = fiber.return
  }
}
function beginWork (fiber) {
  console.log('start: ', fiber.key)
}
function completeUnitOfWork (fiber) {
  console.log('end: ', fiber.key)
}

```
TODO 手绘遍历流程
遍历执行单元流程如下
1. 从根节点开始遍历
1. 如果没有长子，则标识当前节点遍历完成。`completeUnitOfWork`中收集
1. 如果没有相邻兄弟，则返回父节点标识父节点遍历完成。`completeUnitOfWork`中收集
1. 如果没有父节点，标识所有遍历完成。`over`
1. 如果有长子，则遍历；`beginWork`中收集；收集完后返回其长子，回到`第2步`循环遍历
1. 如果有相邻兄弟，则遍历；`beginWork`中收集；收集完后返回其长子，回到`第2步`循环遍历

执行的收集顺序如下
> 类似[二叉树的先序遍历](https://github.com/careteenL/data-structure_algorithm/blob/0816-leetcode/src/data-structure/binary-search-tree.js#L129)
```js
function beginWork (fiber) {
  console.log('start: ', fiber.key) // A1 B1 C1 C2 B2
}
```
完成的收集顺序如下
> 类似[二叉树的后序遍历](https://github.com/careteenL/data-structure_algorithm/blob/0816-leetcode/src/data-structure/binary-search-tree.js#L163)
```js
function completeUnitOfWork (fiber) {
  console.log('end: ', fiber.key) // C1 C2 B1 B2 A1
}
```

#### Commit阶段

类似于`Git`的分支功能，从旧树里面fork一份，在新分支中进行**添加、删除、更新**操作，然后再进行提交。

TODO git commit流程图


> 此阶段测试例子[fiberCommit.html](https://github.com/careteenL/react/tree/master/packages/fiber/utils/fiberCommit.html)，核心代码存放[fiberCommit.js](https://github.com/careteenL/react/tree/master/packages/fiber/utils/fiberCommit.js)。

先构造根fiber，`stateNode`表示当前节点真实dom。
```js
let container = document.getElementById('root')
workInProgressRoot = {
  key: 'ROOT',
  stateNode: container,
  props: { children: [A1] }
}
nextUnitOfWork = workInProgressRoot // 从RootFiber开始，到RootFiber结束
```

如上一个阶段的`beginWork`收集过程，对其进行完善。即将所有节点fiber化。
```js
function beginWork(currentFiber) { // ++
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = document.createElement(currentFiber.type) // 创建真实DOM
    for (let key in currentFiber.props) { // 循环属性赋赋值给真实DOM
      if (key !== 'children' && key !== 'key')
        currentFiber.stateNode.setAttribute(key, currentFiber.props[key])
    }
  }
  let previousFiber
  currentFiber.props.children.forEach((child, index) => {
    let childFiber = {
      tag: 'HOST',
      type: child.type,
      key: child.key,
      props: child.props,
      return: currentFiber,
      effectTag: 'PLACEMENT',
      nextEffect: null
    }
    if (index === 0) {
      currentFiber.child = childFiber
    } else {
      previousFiber.sibling = childFiber
    }
    previousFiber = childFiber
  })
}
```
其中`effectTag`标识当前节点的副作用类型，第一次渲染为新增`PLACEMENT`，`nextEffect`标识下一个有副作用的节点。

然后再完善`completeUnitOfWork`（完成的收集）。
```js
function completeUnitOfWork(currentFiber) { // ++
  const returnFiber = currentFiber.return
  if (returnFiber) {
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect
    }
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect
      }
      returnFiber.lastEffect = currentFiber.lastEffect
    }

    if (currentFiber.effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber
      } else {
        returnFiber.firstEffect = currentFiber
      }
      returnFiber.lastEffect = currentFiber
    }
  }
}
```
目的是将完成的收集形成一个链表结构，配合`commitRoot`阶段。

当将所有的`执行、完成`收集完成后（即将所有真实DOM、虚拟DOM、Fiber结合，其副作用（增删改）形成一个链表结构），需要对其渲染到页面中。
```js
function workLoop (deadline) {
  // ...
  if (!nextUnitOfWork) {
    console.log('render end !')
    commitRoot()
  } else {
    requestIdleCallback(workLoop, { timeout: 1000 })
  }
}
```

找到第一个副作用完成的fiber节点，递归`appendChild`到父元素上。
```js
function commitRoot() { // ++
  let fiber = workInProgressRoot.firstEffect
  while (fiber) {
    console.log('complete: ', fiber.key) // C1 C2 B1 B2 A1
    commitWork(fiber)
    fiber = fiber.nextEffect
  }
  workInProgressRoot = null
}
function commitWork(currentFiber) {
  currentFiber.return.stateNode.appendChild(currentFiber.stateNode)
}
```
如下为上述的渲染效果
TODO commit阶段后的渲染结果

### React使用Fiber

TODO 虚拟DOM、初次渲染、更新