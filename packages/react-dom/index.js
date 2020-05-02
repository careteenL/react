
import { createDOM } from '../react/vdom';
import { updateQueue } from '../react/component';
function render(element, container) {
  // 1.要把虚拟 DOM变成真实DOM
  let dom = createDOM(element);
  // 2.把直实DOM挂载到container上
  container.appendChild(dom);
}
function unstable_batchedUpdates(fn) {
  updateQueue.isPending = true; // 强行处理批量更新模式
  fn();
  updateQueue.isPending = false;
  updateQueue.batchUpdate();
}
export {
  unstable_batchedUpdates
}
export default {
  render,
  unstable_batchedUpdates
}
