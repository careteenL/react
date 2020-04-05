
import React, { Component } from '../../../packages/react';
import ReactDOM from 'react-dom';
class Child extends Component {
  render() {
    console.log(this.props.children);
    const mappedChildren = React.Children.map(
      this.props.children,
      (item, index) => (
        [<div key={`div${index}A`}>{item}</div>, <div key={`div${index}B`}>{item}</div>]
      )
    );
    console.log(mappedChildren);
    return (
      <div>
        {mappedChildren}
      </div>
    )
  }
}

class App extends Component {
  // [1, 2, 3].map(item => <li>{item}</li>);
  //   1.map(item => <li>{item}</li>);
  //   React.Children.map([1,2,3],item => <li>{item}</li>);
  //   React.Children.map(1,item => <li>{item}</li>);
  render() {
    return (
      <Child>
        <div>child1</div>
        <div key="key2">child2</div>
        <div key="key3">child3</div>
        {
          [
            <div key="key4">child4</div>,
            <div key="key5">child5</div>,
            <div key="key6">child6</div>
          ]
        }
      </Child>
    )
  }
}
console.log('App.prototype.isReactComponent', App.prototype.isReactComponent);
ReactDOM.render(<App />, document.getElementById('root'));
