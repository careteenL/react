import { TEXT, ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT, INSERT, REMOVE, MOVE } from './constants';
import { onlyOne, setProps, flatten, patchProps } from './utils';
let updateDepth = 0;
let diffQueue = [];//这是一个补丁包，记录了哪些节点需要删除 ，哪些节点需要添加
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
  } else {
    //新老节点都有，并且类型一样。 div span 就要进行dom diff 深度比较 比较他们的属性和他们的子节点，而且还要尽可能复用老节点
    updateElement(oldRenderElement, newRenderElement);
  }
  return currentElement;
}
function updateElement(oldElement, newElement) {
  let currentDOM = oldElement.dom;//获取老的页面上真实存在的那个DOM节点
  newElement.dom = oldElement.dom;//DOM要实现复用,就是为了复用老的DOM节点
  if (oldElement.$$typeof === TEXT && newElement.$$typeof === TEXT) {
    if (oldElement.content !== newElement.content)//如果说老的文本内容 和新的文本内容不一样的话
      currentDOM.textContent = newElement.content;
  } else if (oldElement.$$typeof === ELEMENT) {//如果是元素类型 span div p
    // 先更新父节点的属性，再比较更新子节点
    updateDOMProperties(currentDOM, oldElement.props, newElement.props);
    updateChildrenElements(currentDOM, oldElement.props.children, newElement.props.children);
    //会把newElement的props赋给oldElement.props
    oldElement.props = newElement.props;
  } else if (oldElement.$$typeof === FUNCTION_COMPONENT) {
    updateFunctionComponent(oldElement, newElement);
  } else if (oldElement.$$typeof === CLASS_COMPONENT) {
    updateClassComponent(oldElement, newElement);
  }
}
function updateChildrenElements(dom, oldChildrenElements, newChildrenElements) {
  updateDepth++;//每进入一个新的子层级，就让updateDepth++
  diff(dom, oldChildrenElements, newChildrenElements, diffQueue);
  updateDepth--;//每比较完一层，返回上一级的时候，就updateDepth--
  if (updateDepth === 0) {//updateDepth等于，就说明回到最上面一层了，整个更新对比就完事了
    patch(diffQueue);//把收集到的差异 补丁传给patch方法进行更新
    diffQueue.length = 0;
  }
}
function patch(diffQueue) {
  //第1步要把该删除的全部删除 MOVE REMOVE
  let deleteMap = {};
  let deleteChildren = [];
  for (let i = 0; i < diffQueue.length; i++) {
    let difference = diffQueue[i];
    let { type, fromIndex, toIndex } = difference;
    if (type === MOVE || type === REMOVE) {
      let oldChildDOM = difference.parentNode.children[fromIndex];//先获取老的DOM节点
      deleteMap[fromIndex] = oldChildDOM;//为了方便后面复用，放到map里
      deleteChildren.push(oldChildDOM);
    }
  }
  //把移动的和REMOVE全部删除 B D
  deleteChildren.forEach(childDOM => {
    childDOM.parentNode.removeChild(childDOM);
  });
  for (let i = 0; i < diffQueue.length; i++) {
    let { type, fromIndex, toIndex, parentNode, dom } = diffQueue[i];
    switch (type) {
      case INSERT:
        insertChildAt(parentNode, dom, toIndex);
        break;
      case MOVE:
        insertChildAt(parentNode, deleteMap[fromIndex], toIndex);
        break;
      default:
        break;
    }
  }
}
//要向index这个索引位置插入
function insertChildAt(parentNode, newChildDOM, index) {
  let oldChild = parentNode.children[index];//先取出这个索引位置的老的DOM节点
  oldChild ? parentNode.insertBefore(newChildDOM, oldChild) : parentNode.appendChild(newChildDOM);
}
/**
 * 先更新和移动的都是子节点
 * 
 * 1. 先更新父节点还是先更新子节点? 先更新的是父节点
 * 2. 先移动父节点还是先移动子节点？ 先移动的是子节点
 */
function diff(parentNode, oldChildrenElements, newChildrenElements) {
  //oldChildrenElementsMap={G,A} newChildrenElementsMap={A,G}
  let oldChildrenElementsMap = getChildrenElementsMap(oldChildrenElements);//{A,B,C,D}
  let newChildrenElementsMap = getNewChildrenElementsMap(oldChildrenElementsMap, newChildrenElements);
  let lastIndex = 0;
  //比较是深度优先的，所以先放子节的补丁，再放父节点的补丁
  for (let i = 0; i < newChildrenElements.length; i++) {
    let newChildElement = newChildrenElements[i];
    if (newChildElement) {
      let newKey = newChildElement.key || i.toString();
      let oldChildElement = oldChildrenElementsMap[newKey];
      if (newChildElement === oldChildElement) {//说明他们是同一个对象，是复用老节点
        if (oldChildElement._mountIndex < lastIndex) {
          diffQueue.push({
            parentNode,//我要移除哪个父节点下的元素
            type: MOVE,
            fromIndex: oldChildElement._mountIndex,
            toIndex: i
          });
        }
        lastIndex = Math.max(oldChildElement._mountIndex, lastIndex);
      } else {//如果新老元素不相等，是直接 插入
        diffQueue.push({
          parentNode,
          type: INSERT,
          toIndex: i,
          dom: createDOM(newChildElement)
        });
      }
      newChildElement._mountIndex = i;//更新挂载索引
    } else {
      if (oldChildrenElements[i].componentInstance && oldChildrenElements[i].componentInstance.componentWillUnmount) {
        oldChildrenElements[i].componentInstance.componentWillUnmount();
      }
    }
  }
  for (let oldKey in oldChildrenElementsMap) {
    if (!newChildrenElementsMap.hasOwnProperty(oldKey)) {
      let oldChildElement = oldChildrenElementsMap[oldKey];
      diffQueue.push({
        parentNode,
        type: REMOVE,
        fromIndex: oldChildElement._mountIndex//3
      });
    }
  }
}
function getNewChildrenElementsMap(oldChildrenElementsMap, newChildrenElements) {
  let newChildrenElementsMap = {};
  for (let i = 0; i < newChildrenElements.length; i++) {
    let newChildElement = newChildrenElements[i];
    if (newChildElement) {//说明新节点不为NULL
      let newKey = newChildElement.key || i.toString();//A
      let oldChildElement = oldChildrenElementsMap[newKey];
      //可以复用1.key一样 2 需要类型是一样的
      if (canDeepCompare(oldChildElement, newChildElement)) {
        //在此处递归，更新父元素的时候，会递归更新每一个子元素
        //compareTwoElements 内部会判断 updateElement
        compareTwoElements(oldChildElement, newChildElement);//复用老的DOM节点，用新属性更新这个DOM节点
        newChildrenElements[i] = oldChildElement;//复用老的虚拟DOM节点
      }// key是新的元素的key,值是对应虚拟DOM。
      newChildrenElementsMap[newKey] = newChildrenElements[i];
    }
  }
  return newChildrenElementsMap;
}
function canDeepCompare(oldChildElement, newChildElement) {
  if (!!oldChildElement && !!newChildElement) {// $$typeof ELEMENT type span div
    return oldChildElement.type === newChildElement.type;//如果类型一样，就可以复用了，可以进行深度对比了
  }
  return false;
}
function getChildrenElementsMap(oldChildrenElements) {
  let oldChildrenElementsMap = {};
  for (let i = 0; i < oldChildrenElements.length; i++) {
    let oldKey = oldChildrenElements[i].key || i.toString();
    oldChildrenElementsMap[oldKey] = oldChildrenElements[i];
  }
  return oldChildrenElementsMap;
}
function updateClassComponent(oldElement, newElement) {
  let componentInstance = oldElement.componentInstance;//获取老的类组件实例 
  let updater = componentInstance.$updater;
  let nextProps = newElement.props;//新的属性对象
  if (componentInstance.componentWillReceiveProps) {
    componentInstance.componentWillReceiveProps(nextProps);
  }
  updater.emitUpdate(nextProps);
}
//如果是要更新一个函数组件 1.拿 到老元素 2.重新执行函数组件拿 到新的元素 进行对比
function updateFunctionComponent(oldElement, newElement) {
  let oldRenderElement = oldElement.renderElement;//获取老的渲染出来的元素
  let newRenderElement = newElement.type(newElement.props);// newElement.type=FunctionCounter
  let currentElement = compareTwoElements(oldRenderElement, newRenderElement);
}
function updateDOMProperties(dom, oldProps, newProps) {
  patchProps(dom, oldProps, newProps);
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
  if (componentInstance.componentWillMount) {
    componentInstance.componentWillMount();
  }
  //当创建类组件实例 后，会在类组件的虚拟DOM对象上添一个属性componentInstance,指向类组件实例 
  element.componentInstance = componentInstance;//以后组件运行当中componentInstance是不变的
  let renderElement = componentInstance.render();
  //在类组件实例上添加renderElement,指向上一次要渲染的虚拟DOM节点
  //因为后面组件更新的，我们会重新render,然后跟上一次的renderElement进行dom diff
  componentInstance.renderElement = renderElement;
  let newDOM = createDOM(renderElement);
  renderElement.dom = newDOM;
  if (componentInstance.componentDidMount) {
    componentInstance.componentDidMount();
  }
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
