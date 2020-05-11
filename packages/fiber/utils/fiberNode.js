class FiberNode {
  constructor(type, payload) {
    this.type = type // 节点类型
    this.key = payload.key // key
    this.payload = payload // 挂载的数据
    this.return = null // 父Fiber
    this.child = null // 长子Fiber
    this.sibling = null // 相邻兄弟Fiber
  }
}

// Test
const A1 = new FiberNode('div', { key: 'A1' })
const B1 = new FiberNode('div', { key: 'B1' })
const B2 = new FiberNode('div', { key: 'B2' })
const C1 = new FiberNode('div', { key: 'C1' })
const C2 = new FiberNode('div', { key: 'C2' })

A1.child = B1
B1.return = A1
B1.sibling = B2
B1.child = C1
B2.return = A1
C1.return = B1
C1.sibling = C2
C2.return =  B1

console.log(A1)