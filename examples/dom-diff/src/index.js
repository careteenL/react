
import React from '../../../packages/react';
import ReactDOM from '../../../packages/react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: true };

  }
  handleClick = () => {
    this.setState((state) => ({ show: !state.show }));
  }
  render() {
    if (this.state.show) {
      return (
        <ul onClick={this.handleClick}>
          <li key="A">A</li>
          <li key="B">B</li>
          <li key="C">C</li>
          <li key="D">D</li>
        </ul>
      )
    } else {
      return (
        <ul onClick={this.handleClick}>
          <li key="A">A</li>
          <li key="C">C</li>
          <li key="B">B</li>
          <li key="E">E</li>
          <li key="F">F</li>
        </ul>
      )
    }
  }
}
ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);
