class Update {
  constructor(payload, nextUpdate) {
    this.payload = payload
    this.nextUpdate = nextUpdate
  }
}

const isFunction = (func) => {
  return typeof func === 'function'
}

class UpdateQueue {
  constructor() {
    this.baseState = null
    this.firstUpdate = null
    this.lastUpdate = null
  }
  enqueue(update) {
    if (!this.firstUpdate) {
      this.firstUpdate = this.lastUpdate = update
    } else {
      this.lastUpdate.nextUpdate = update
      this.lastUpdate = update
    }
  }
  forceUpdate() {
    let currentState = this.baseState || {}
    let currentUpdate = this.firstUpdate
    while(currentUpdate) {
      const nextState = isFunction(currentUpdate.payload) ? currentUpdate.payload(currentState) : currentUpdate.payload
      currentState = {
        ...currentState,
        ...nextState
      }
      currentUpdate = currentUpdate.nextUpdate
    }
    this.firstUpdate = this.lastUpdate = null
    return this.baseState = currentState
  }
}

// Test
const queue = new UpdateQueue()
queue.enqueue(new Update({ name: 'careteen' }))
queue.enqueue(new Update({ age: 24 }))
queue.enqueue(new Update((state) => ({ age: state.age + 1 })))
queue.enqueue(new Update((state) => ({ age: state.age + 1 })))

queue.forceUpdate()
console.log(queue.baseState)
