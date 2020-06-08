
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
//老有新没有=>删除    老新都有=>更新  老没有新的=>添加
export function patchProps(dom, oldProps, newProps) {
  for (let key in oldProps) {
    if (key !== 'children') {//此处只处理自己的DOM属性，不处理children节点
      if (!newProps.hasOwnProperty(key)) {//如果此老属性在新的属性对象中不存在，则删除
        dom.removeAttribute(key);
      }
    }
  }
  for (let key in newProps) {
    if (key !== 'children') {//此处只处理自己的DOM属性，不处理children节点
      setProp(dom, key, newProps[key]);
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
