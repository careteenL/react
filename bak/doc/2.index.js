
import React, { Component } from './react';
import ReactDOM from 'react-dom';
/* class App extends Component {
  render() {
    return (
      <div>
        <p>1</p>
        <button>+</button>
      </div>
    )
  }
}
let element = <App />; */
class App extends Component {
  static defaultProps = {
    name: 'app'
  }
  render() {
    let returnElement = React.createElement("div",
      { title: this.props.name + '_' + this.props.title },
      React.createElement("p", { key: 'p_key' }, "1"),
      React.createElement("button", { key: 'button_key' }, "+"));
    console.log(returnElement);
    return returnElement;
  }
}
debugger
let element = React.createElement(App, { title: 'zhufeng' });
/* let instance = new App();
let renderedElement = instance.render();
 */
console.log(element);
ReactDOM.render(element, document.getElementById('root'));