
import { createDOM } from '../react/vdom';
function render(element, container) {
  // 1.要把虚拟 DOM变成真实DOM
  let dom = createDOM(element);
  // 2.把直实DOM挂载到container上
  container.appendChild(dom);
}
export default {
  render
}
