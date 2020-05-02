
import React from '../../../packages/react';
import ReactDOM from '../../../packages/react-dom';

let ThemeContext = React.createContext(null);
let root = document.querySelector('#root');
class Header extends Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}`, padding: '5px' }}>
        header
        <Title />
      </div>
    )
  }
}
class Title extends Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}` }}>
        title
      </div>
    )
  }
}
class Main extends Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}`, margin: '5px', padding: '5px' }}>
        main
        <Content />
      </div>
    )
  }
}
class Content extends Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div style={{ border: `5px solid ${this.context.color}`, padding: '5px' }}>
        Content
        <button onClick={() => this.context.changeColor('red')} style={{ color: 'red' }}>红色</button>
        <button onClick={() => this.context.changeColor('green')} style={{ color: 'green' }}>绿色</button>
      </div>
    )
  }
}

class ClassPage extends Component {
  constructor(props) {
    super(props);
    this.state = { color: 'red' };
  }
  changeColor = (color) => {
    this.setState({ color });
  }
  render() {
    let contextVal = { changeColor: this.changeColor, color: this.state.color };
    return (
      <ThemeContext.Provider value={contextVal}>
        <div style={{ margin: '10px', border: `5px solid ${this.state.color}`, padding: '5px', width: '200px' }}>
          page
          <Header />
          <Main />
        </div>
      </ThemeContext.Provider>

    )
  }
}
class FunctionHeader extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => (
            <div style={{ border: `5px solid ${value.color}`, padding: '5px' }}>
              header
              <FunctionTitle />
            </div>
          )
        }
      </ThemeContext.Consumer>
    )
  }
}
class FunctionTitle extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => (
            <div style={{ border: `5px solid ${value.color}` }}>
              title
            </div>
          )
        }
      </ThemeContext.Consumer>
    )
  }
}
class FunctionMain extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => (
            <div style={{ border: `5px solid ${value.color}`, margin: '5px', padding: '5px' }}>
              main
              <FunctionContent />
            </div>
          )
        }
      </ThemeContext.Consumer>
    )
  }
}
class FunctionContent extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {
          (value) => (
            <div style={{ border: `5px solid ${value.color}`, padding: '5px' }}>
              Content
              <button onClick={() => value.changeColor('red')} style={{ color: 'red' }}>红色</button>
              <button onClick={() => value.changeColor('green')} style={{ color: 'green' }}>绿色</button>
            </div>
          )
        }
      </ThemeContext.Consumer>
    )
  }
}
class FunctionPage extends Component {
  constructor(props) {
    super(props);
    this.state = { color: 'red' };
  }
  changeColor = (color) => {
    this.setState({ color });
  }
  render() {
    let contextVal = { changeColor: this.changeColor, color: this.state.color };
    return (
      <ThemeContext.Provider value={contextVal}>
        <div style={{ margin: '10px', border: `5px solid ${this.state.color}`, padding: '5px', width: '200px' }}>
          page
          <FunctionHeader />
          <FunctionMain />
        </div>
      </ThemeContext.Provider>

    )
  }
}
ReactDOM.render(<FunctionPage />, root);
// ReactDOM.render(<ClassPage />, root);
