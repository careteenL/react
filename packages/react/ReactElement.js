
import ReactCurrentOwner from './ReactCurrentOwner';
import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols';
function hasValidRef(config) {
  return config.ref !== undefined;
}
function hasValidKey(config) {
  return config.key !== undefined;
}
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
}
export function createElement(type, config, children) {
  let propName; // 定义一个变量叫属性名
  const props = {}; // 定义一个元素的props对象
  let key = null; // 在兄弟节点中唯一标识自己的唯一性的，在同一个的不同兄弟之间key要求不同
  let ref = null; // ref=React.createRef() "username" this.refs.username {input=>this.username = input} 从而得到真实的DOM元素
  let self = null; // 用来获取真实的this指针 
  let source = null; // 用来定位创建此虚拟DOM元素在源码的位置 哪个文件 哪一行 哪一列
  if (config !== null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    for (propName in config) {
      if (!RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName]
      }
    }
  }
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children; // 如果说是独生子的话children是一个对象
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray; // 如果说是有多个儿子的话，props.children就是一个数组了
  }
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    // 只有当属性对象没有此属性对应的值的时候，默认属性才会生效，否则直接忽略 
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }
  // ReactCurrentOwner此元素的拥有者
  return ReactElement(
    type, key, ref, self, source, ReactCurrentOwner.current, props
  )
}
function ReactElement(type, key, ref, _self, _source, _owner, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    _owner,
    _self,
    _source
  }
  return element;
}
