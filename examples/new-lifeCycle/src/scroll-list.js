import React from '../../../packages/react';
import ReactDOM from '../../../packages/react-dom';

class ScrollingList extends React.Component {
  wrapper
  timeID
  constructor(props) {
    super(props);
    this.state = { messages: [] }
    this.wrapper = React.createRef();
  }

  addMessage = () => {
    this.setState(state => ({
      messages: [`${state.messages.length}`, ...state.messages],
    }))
  }
  componentDidMount() {
    this.timeID = window.setInterval(() => {//设置定时器
      this.addMessage();
    }, 3000)
  }
  componentWillUnmount() {//清除定时器
    window.clearInterval(this.timeID);
  }
  getSnapshotBeforeUpdate = () => {//很关键的，我们获取当前rootNode的scrollHeight，传到componentDidUpdate 的参数perScrollHeight
    return this.wrapper.current.scrollHeight;
  }
  componentDidUpdate(pervProps, pervState, prevScrollHeight) {
    const curScrollTop = this.wrapper.current.scrollTop;//当前向上卷去的高度
    //当前向上卷去的高度加上增加的内容高度
    this.wrapper.current.scrollTop = curScrollTop + (this.wrapper.current.scrollHeight - prevScrollHeight);
  }
  render() {
    let style = {
      height: '100px',
      width: '200px',
      border: '1px solid red',
      overflow: 'auto'
    }
    return (
      <div style={style} ref={this.wrapper} >
        {this.state.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  }
}

ReactDOM.render(
  <ScrollingList />,
  document.getElementById('root')
);