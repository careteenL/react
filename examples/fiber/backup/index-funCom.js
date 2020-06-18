import React from 'react'
import ReactDOM from 'react-dom'
// import React from '../../../packages/fiber/core/react'
// import ReactDOM from '../../../packages/fiber/core/react-dom'

function FunctionCounter() {
  return (
    <h1>
      Count:0
    </h1>
  )
}
ReactDOM.render(
  <FunctionCounter />,
  document.getElementById('root')
)
