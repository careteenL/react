
import React from '../../../packages/react';
import ReactDOM from '../../../packages/react-dom';

class Counter extends React.Component { // 他会比较两个状态相等就不会刷新视图 PureComponent是浅比较
  static defaultProps = {
    name: 'Careteen'
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 }
    console.log('Counter constructor')
  }
  componentWillMount() { // 取本地的数据 同步的方式：采用渲染之前获取数据，只渲染一次
    console.log('Counter  componentWillMount');
  }
  componentDidMount() {
    console.log('Counter  componentDidMount');
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };
  // react可以shouldComponentUpdate方法中优化 PureComponent 可以帮我们做这件事
  shouldComponentUpdate(nextProps, nextState) { // 代表的是下一次的属性 和 下一次的状态
    console.log('Counter  shouldComponentUpdate');
    return nextState.number > 1;
    // return nextState.number!==this.state.number; //如果此函数种返回了false 就不会调用render方法了
  } //不要随便用setState 可能会死循环
  componentWillUpdate() {
    console.log('Counter  componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('Counter  componentDidUpdate');
  }
  render() {
    console.log('Counter render');
    return (
      <div>
        <p>{this.state.number}</p>
        {this.state.number > 3 ? null : <ChildCounter n={this.state.number} />}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
class ChildCounter extends React.Component {
  componentWillUnmount() {
    console.log('ChildCounter  componentWillUnmount')
  }
  componentWillMount() {
    console.log('ChildCounter componentWillMount')
  }
  render() {
    console.log('ChildCounter render')
    return (<div>
      {this.props.n}
    </div>)
  }
  componentDidMount() {
    console.log('ChildCounter componentDidMount')
  }
  componentWillReceiveProps(newProps) { // 第一次不会执行，之后属性更新时才会执行
    console.log('ChildCounter componentWillReceiveProps')
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter shouldComponentUpdate')
    return nextProps.n > 2; //子组件判断接收的属性 是否满足更新条件 为true则更新
  }
  componentWillUpdate() {
    console.log('ChildCounter  componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('ChildCounter  componentDidUpdate');
  }
}
let element = React.createElement(Counter, {});
ReactDOM.render(
  element,
  document.getElementById('root')
);
