
import React from '../../../packages/react';
import ReactDOM from '../../../packages/react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };

  }
  handleClick = () => {
    this.setState((state) => ({ number: state.number + 1 }));
  }
  render() {
    return (
      <div id={'count' + this.state.number}>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}
ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);
