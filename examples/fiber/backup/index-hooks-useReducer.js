// import React from 'react'
// import ReactDOM from 'react-dom'
import React from '../../../packages/fiber/core/react';
import ReactDOM from '../../../packages/fiber/core/react-dom';

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 };
    default:
      return state;
  }
}
function FunctionCounter() {
  const [numberState, setNumberState] = React.useState({ number: 0 });
  const [countState, dispatch] = React.useReducer(reducer, { count: 0 });
  return (
    <div>
      <h1 onClick={() => setNumberState(state => ({ number: state.number + 1 }))}>
        Count: {numberState.number}
      </h1 >
      <hr />
      <h1 onClick={() => dispatch({ type: 'ADD' })}>
        Count: {countState.count}
      </h1 >
    </div>
  )
}
ReactDOM.render(
  <FunctionCounter />,
  document.getElementById('root')
);
