import { setProps } from './utils'
import {
  ELEMENT_TEXT, TAG_ROOT, TAG_HOST, TAG_TEXT, PLACEMENT
} from './constants'

let workInProgressRoot = null // 正在渲染中的根Fiber
let nextUnitOfWork = null // 下一个工作单元

export function scheduleRoot(rootFiber) {
  // 把当前树设置为nextUnitOfWork开始进行调度
  workInProgressRoot = rootFiber
  nextUnitOfWork = workInProgressRoot
}

function commitRoot() {
  let currentFiber = workInProgressRoot.firstEffect
  while (currentFiber) {
    commitWork(currentFiber)
    currentFiber = currentFiber.nextEffect
  }
  workInProgressRoot = null
}
function commitWork(currentFiber) {
  if (!currentFiber) {
    return
  }
  let returnFiber = currentFiber.return // 先获取父Fiber
  const domReturn = returnFiber.stateNode // 获取父的DOM节点
  if (currentFiber.effectTag === PLACEMENT && currentFiber.stateNode != null) { // 如果是新增DOM节点
    let nextFiber = currentFiber
    domReturn.appendChild(nextFiber.stateNode)
  }
  currentFiber.effectTag = null
}

function performUnitOfWork(currentFiber) {
  beginWork(currentFiber) // 开始渲染前的Fiber,就是把子元素变成子fiber

  if (currentFiber.child) { // 如果子节点就返回第一个子节点
    return currentFiber.child
  }

  while (currentFiber) { // 如果没有子节点说明当前节点已经完成了渲染工作
    completeUnitOfWork(currentFiber) // 可以结束此fiber的渲染了 
    if (currentFiber.sibling) { // 如果它有弟弟就返回弟弟
      return currentFiber.sibling
    }
    currentFiber = currentFiber.return // 如果没有弟弟让爸爸完成，然后找叔叔
  }
}

function beginWork(currentFiber) {
  if (currentFiber.tag === TAG_ROOT) { // 如果是根节点
    updateHostRoot(currentFiber)
  } else if (currentFiber.tag === TAG_TEXT) { // 如果是原生文本节点
    updateHostText(currentFiber)
  } else if (currentFiber.tag === TAG_HOST) { // 如果是原生DOM节点
    updateHostComponent(currentFiber)
  }
}

function updateHostRoot(currentFiber) { // 如果是根节点
  const newChildren = currentFiber.props.children // 直接渲染子节点
  reconcileChildren(currentFiber, newChildren)
}
function updateHostText(currentFiber) {
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber) // 先创建真实的DOM节点
  }
}
function updateHostComponent(currentFiber) { // 如果是原生DOM节点
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber) // 先创建真实的DOM节点
  }
  const newChildren = currentFiber.props.children
  reconcileChildren(currentFiber, newChildren)
}
function createDOM(currentFiber) {
  if (currentFiber.type === ELEMENT_TEXT) {
    return document.createTextNode(currentFiber.props.text)
  }
  const stateNode = document.createElement(currentFiber.type)
  updateDOM(stateNode, {}, currentFiber.props)
  return stateNode
}

function reconcileChildren(currentFiber, newChildren) {
  let newChildIndex = 0 // 新虚拟DOM数组中的索引
  let prevSibling
  while (newChildIndex < newChildren.length) {
    const newChild = newChildren[newChildIndex]
    let tag
    if (newChild && newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT // 文本
    } else if (newChild && typeof newChild.type === 'string') {
      tag = TAG_HOST // 原生DOM组件
    }
    let newFiber = {
      tag, // 原生DOM组件
      type: newChild.type, // 具体的元素类型
      props: newChild.props, // 新的属性对象
      stateNode: null, // stateNode肯定是空的
      return: currentFiber, // 父Fiber
      effectTag: PLACEMENT, // 副作用标识
      nextEffect: null
    }
    if (newFiber) {
      if (newChildIndex === 0) {
        currentFiber.child = newFiber // 第一个子节点挂到父节点的child属性上
      } else {
        prevSibling.sibling = newFiber
      }
      prevSibling = newFiber // 然后newFiber变成了上一个哥哥了
    }
    prevSibling = newFiber // 然后newFiber变成了上一个哥哥了
    newChildIndex++
  }
}

function updateDOM(stateNode, oldProps, newProps) {
  setProps(stateNode, oldProps, newProps)
}
function completeUnitOfWork(currentFiber) {
  const returnFiber = currentFiber.return
  if (returnFiber) {
    if (!returnFiber.firstEffect) { // 1.1 / 2.1 / 3.1
      returnFiber.firstEffect = currentFiber.firstEffect
    }
    if (!!currentFiber.lastEffect) { // 2.2 / 3.2
      if (!!returnFiber.lastEffect) { // 3.3
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect
      }
      returnFiber.lastEffect = currentFiber.lastEffect // 2.3 // 3.4
    }

    const effectTag = currentFiber.effectTag // 1.2 / 2.4 / 3.5
    if (effectTag) {
      if (!!returnFiber.lastEffect) { // 3.6
        returnFiber.lastEffect.nextEffect = currentFiber
      } else {
        returnFiber.firstEffect = currentFiber // 1.3 / 2.4
      }
      returnFiber.lastEffect = currentFiber
    }
  }
}

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork) // 执行一个任务并返回下一个任务
    shouldYield = deadline.timeRemaining() < 1 // 如果剩余时间小于1毫秒就说明没有时间了，需要把控制权让给浏览器
  }
  // 如果没有下一个执行单元了，并且当前渲染树存在，则进行提交阶段
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
// 开始在空闲时间执行workLoop
requestIdleCallback(workLoop)
