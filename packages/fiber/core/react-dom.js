import { TAG_ROOT } from './constants'
import { scheduleRoot } from './scheduler'

function render(element, container) {
  let rootFiber = {
    tag: TAG_ROOT, // 这是根Fiber
    stateNode: container, // 此Fiber对应的DOM节点
    props: { children: [element] }, // 子元素就是要渲染的element
  }
  scheduleRoot(rootFiber)
}

export default {
  render
}