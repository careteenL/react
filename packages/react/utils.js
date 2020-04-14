
import { addEvent } from './event';
//如果obj是数组，只取第一个元素,如果不是数组，就返回自己
export function onlyOne(obj) {
  return Array.isArray(obj) ? obj[0] : obj;
}
/**
 * 给真实DOM节点赋属性
 */
export function setProps(dom, props) {
  for (let key in props) {
    if (key != 'children') {
      let value = props[key];
      setProp(dom, key, value);
    }
  }
}
function setProp(dom, key, value) {
  if (/^on/.test(key)) {//如果属性名是以on开头的说明要绑定事件
    //dom[key.toLowerCase()] = value;//稍后会改成合成事件
    addEvent(dom, key, value);
  } else if (key === 'className') {
    dom.className = value;
  } else if (key === 'style') {
    for (let styleName in value) {// { color: 'red' }
      dom.style[styleName] = value[styleName];
    }
  } else {
    dom.setAttribute(key, value);
  }
}
//展开一个数组，打平一个任意的多维数组.这样可以避免深克隆
export function flatten(array) {
  let flatted = [];
  (function flat(array) {
    array.forEach(item => {
      if (Array.isArray(item)) {
        flat(item);
      } else {
        flatted.push(item);
      }
    });
  })(array);
  return flatted;
}

export function isFunction(obj) {
  return typeof obj === 'function'
}
