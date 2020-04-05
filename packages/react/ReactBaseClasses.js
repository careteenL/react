
let emptyObject = {};
class Component {
  constructor(props, context) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
  }
}
// 在React内部是凭这个变量来判断是不是一个React组件的
// 因为组件定义的有两种方式，一种是类组件，一种函数组件,都被babel编译成函数
Component.prototype.isReactComponent = {};

class PureComponent extends Component { }
PureComponent.prototype.isPureReactComponent = true;
export { Component }
