
import { TEXT, ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT } from './constants';
import { ReactElement } from './vdom';
import { Component } from './component';
// import { Component } from './ReactBaseClasses';
import { createElement } from './ReactElement';
import { map } from './ReactChildren';
function createElement(type, config = {}, ...children) {
  delete config.__source;
  delete config.__self;
  let { key, ref, ...props } = config;
  let $$typeof = null;
  if (typeof type === 'string') {//span div button
    $$typeof = ELEMENT;//是一个原生的DOM类型
    //说明这个类型是一个类组件
  } else if (typeof type === 'function' && type.prototype.isReactComponent) {
    $$typeof = CLASS_COMPONENT;
  } else if (typeof type === 'function') {
    $$typeof = FUNCTION_COMPONENT;//说明是一个函数数组
  }
  props.children = children.map(item => {
    if (typeof item === 'object') {
      return item;// React.createElement('span', { color: 'red' }, 'Hello')
    } else {
      return { $$typeof: TEXT, type: TEXT, content: item };//item = "Hello"
    }
  })
  return ReactElement($$typeof, type, key, ref, props);
}

const React = {
  createElement,
  Component,
  Children: {
    map
  },
}
export {
  Component
}
export default React;
