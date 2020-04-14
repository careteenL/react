import { TEXT, ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT } from './constants';
import { onlyOne, setProps, flatten } from './utils';
export function compareTwoElements(oldRenderElement, newRenderElement) {
  oldRenderElement = onlyOne(oldRenderElement);
  newRenderElement = onlyOne(newRenderElement);
  let currentDOM = oldRenderElement.dom;//先取出老的DOM节点
  let currentElement = oldRenderElement;
  if (newRenderElement == null) {
    currentDOM.parentNode.removeChild(currentDOM);//如果新的虚拟DOM节点为NULL。则要干掉老节点
    currentDOM = null;
  } else if (oldRenderElement.type != newRenderElement.type) {//span div function class
    let newDOM = createDOM(newRenderElement);//如果节点类型不同，则需要创建新的DOM节点，然后把老DOM节点替换掉
    currentDOM.parentNode.replaceChild(newDOM, currentDOM);
    currentElement = newRenderElement;
  } else {//新老节点都有，并且类型一样。 div span 就要进行dom diff 深度比较 比较他们的属性和他们的子节点，而且还要尽可能复用老节点
    let newDOM = createDOM(newRenderElement);//如果节点类型不同，则需要创建新的DOM节点，然后把老DOM节点替换掉
    currentDOM.parentNode.replaceChild(newDOM, currentDOM);
    currentElement = newRenderElement;//TODO
  }
  return currentElement;
}
export function createDOM(element) {
  element = onlyOne(element);//为什么要这么写? children是一个数组
  let { $$typeof } = element;
  let dom = null;
  if (!$$typeof) {// element 是一个字符串或者数字
    dom = document.createTextNode(element);
  } else if ($$typeof == TEXT) {//对象{$$typeof:TEXT}
    dom = document.createTextNode(element.content);
  } else if ($$typeof == ELEMENT) {
    //如果此虚拟DOM是一个原生DOM节点
    dom = createNativeDOM(element);
  } else if ($$typeof == FUNCTION_COMPONENT) {
    //如果此虚拟DOM是一个函数组件，就渲染此函数组件
    dom = createFunctionComponentDOM(element);
  } else if ($$typeof == CLASS_COMPONENT) {
    //如果此虚拟DOM是一个类组件，就渲染此类组件
    dom = createClassComponentDOM(element);
  }
  element.dom = dom;//不管是什么类型的元素，都让它的dom属性指向他创建出来的直实DOM元素
  return dom;
}
//创建函数组件对应的真实的DOM对象
function createFunctionComponentDOM(element) {
  let { type: FunctionCounter, props } = element;//type = FunctionCounter
  let renderElement = FunctionCounter(props);//返回要渲染的react元素
  element.renderElement = renderElement;//需要缓存,方便下次对比
  let newDOM = createDOM(renderElement);
  //虚拟DOM的dom属性指向它创建出来的真实DOM
  renderElement.dom = newDOM;//我们从虚拟DOMReact元素创建出真实DOM，创建出来以后会把真实DOM添加到虚拟DOM的dom属性上
  return newDOM;
  //element.renderElement.dom=DIV真实DOM元素
}
function createClassComponentDOM(element) {
  let { type: ClassCounter, props } = element;
  let componentInstance = new ClassCounter(props);//创建一个ClassCounter组件的实例
  //当创建类组件实例 后，会在类组件的虚拟DOM对象上添一个属性componentInstance,指向类组件实例 
  element.componentInstance = componentInstance;//以后组件运行当中componentInstance是不变的
  let renderElement = componentInstance.render();
  //在类组件实例上添加renderElement,指向上一次要渲染的虚拟DOM节点
  //因为后面组件更新的，我们会重新render,然后跟上一次的renderElement进行dom diff
  componentInstance.renderElement = renderElement;
  let newDOM = createDOM(renderElement);
  renderElement.dom = newDOM;
  // element.componentInstance.renderElement.dom=DIV真实DOM元素
  return newDOM;
}
/**
let element = React.createElement('button',
  { id: 'sayHello', onClick },
  'say', React.createElement('span', { color: 'red' }, 'Hello')
);
 */
function createNativeDOM(element) {
  let { type, props } = element;// span button div
  let dom = document.createElement(type);// 真实的BUTTON DOM对象
  //1.创建此虚拟DOM节点的子节点
  createDOMChildren(dom, element.props.children);
  setProps(dom, props);
  //2.给此DOM元素添加属性
  return dom;
}
function createDOMChildren(parentNode, children) {
  children && flatten(children).forEach((child, index) => {
    //child其实是虚拟DOM，我们会在虚拟DOM加一个属性_mountIndex,指向此虚拟DOM节点在父节点中的索引
    //在后面我们做dom-diff的时候会变得非常非常重要
    child._mountIndex = index;
    let childDOM = createDOM(child);//创建子虚拟DOM节点的真实DOM元素
    parentNode.appendChild(childDOM);
  });
}


export function ReactElement($$typeof, type, key, ref, props) {
  let element = {
    $$typeof, type, key, ref, props
  }
  return element;
}
