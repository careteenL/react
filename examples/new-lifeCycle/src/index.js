
import React from '../../../packages/react';
import ReactDOM from '../../../packages/react-dom';

class Counter extends React.Component {
  static defaultProps = {
    name: 'Careteen'
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 }
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <ChildCounter number={this.state.number} />
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { number } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (number % 2 == 0) {
      return { number: number * 2 };
    } else {
      return { number: number * 3 };
    }
    // 否则，对于state不进行任何操作
    return null;
  }
  render() {
    return (<div>
      {this.state.number}
    </div>)
  }
}

ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);
