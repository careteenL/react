import {
  isFunction
} from './utils';
import {
  compareTwoElements
} from './vdom';
//更新队列
export let updateQueue = {
  updaters: [], //这里面放着将要执行的更新器对象
  isPending: false, //是否批量更新模式 如果isPending=true 则处于批量更新模式
  add(updater) { //放进去之后就完事。不进行真正的更新，什么时候真正更新
    this.updaters.push(updater);
  },
  //需要有人调用batchUpdate方法才会真正更新
  batchUpdate() { //强行全部更新 执行执行真正的更新
    let {
      updaters
    } = this;
    this.isPending = true; //进入批量更新模式
    let updater;
    while (updater = updaters.pop()) {
      updater.updateComponent(); //更新所有脏 dirty 组件
    }
    this.isPending = false; //改为非批量更新
  }
}
class Updater {
  constructor(componentInstance) {
    this.componentInstance = componentInstance; //一个Updater和一个类组件实例是一对1的关系
    this.pendingStates = []; //更新可能是批量的，如果是处于批量更新的话，需要把分状态都先暂存到这个数组,最后在更新的时候统一合并
    this.nextProps = null; //新的属性对象
  }
  addState(partialState) {
    this.pendingStates.push(partialState); //先把新状态放入数组中
    this.emitUpdate(); // 开始试图更新
  }
  emitUpdate(nextProps) { //可能会传一个新的属性对象过来
    this.nextProps = nextProps;
    //如果传递了新的属性对象或者当前非批量更新模式的话就直接更新，否则先不更新
    //如果有新属性对象或者要立即更新的话
    if (nextProps || !updateQueue.isPending) {
      this.updateComponent();
    } else { //如果当前是批量更新模式，则把自己这个updater实例放到updateQueue数组里
      updateQueue.add(this);
    }
  }
  updateComponent() {
    let {
      componentInstance,
      pendingStates,
      nextProps
    } = this;
    if (nextProps || pendingStates.length > 0) { //长度大于0说明有等待执行合并的更新状态
      shouldUpdate(componentInstance, nextProps, this.getState());
    }
  }
  getState() {
    let {
      componentInstance,
      pendingStates
    } = this;
    let {
      state
    } = componentInstance; //获取到老组件的当前状态
    if (pendingStates.length > 0) {
      pendingStates.forEach(nextState => {
        if (isFunction(nextState)) {
          state = {
            ...state,
            ...nextState.call(componentInstance, state)
          };
        } else {
          state = {
            ...state,
            ...nextState
          };
        }
      });
    }
    pendingStates.length = 0; //用完之后就可以清除pendingStates
    return state;
  }
}

function shouldUpdate(componentInstance, nextProps, nextState) { //判断是否要更新
  let scu = componentInstance.shouldComponentUpdate &&
    !componentInstance.shouldComponentUpdate(nextProps, nextState);
  componentInstance.props = nextProps;
  componentInstance.state = nextState;
  if (scu) {
    return false; // 不更新
  }
  componentInstance.forceUpdate(); //让组件强行更新
}
class Component {
  constructor(props) {
    this.props = props;
    this.$updater = new Updater(this); // this 就是类组件的实例
    this.state = {}; //当前状态
    this.nextProps = null; //下一个属性对象
  }
  //批量更新 partial部分，因为状态可能会被合并
  setState(partialState) {
    this.$updater.addState(partialState);
  }
  forceUpdate() { //进行组件实际更新
    //componentInstance.renderElement = renderElement;
    let {
      props,
      state,
      renderElement: oldRenderElement,
      getSnapshotBeforeUpdate
    } = this;
    if (this.componentWillUpdate) {
      this.componentWillUpdate(); //组件将要更新
    }
    let extraArgs = getSnapshotBeforeUpdate && getSnapshotBeforeUpdate();
    let newRenderElement = this.render(); //重新渲染获取新的React元素
    let currentElement = compareTwoElements(oldRenderElement, newRenderElement);
    this.renderElement = currentElement;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(props, state, extraArgs); //组件更新完成
    }
  }
}
//类组件和函数组件编译之后都是函数，通过 此属性来区分到底是函数组件还是类组件
Component.prototype.isReactComponent = {};
export {
  Component
}
