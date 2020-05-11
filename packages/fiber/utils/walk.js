function walk(vdom, cb) {
  cb && cb(vdom)
  vdom.children.forEach(child => walk(child, cb))
}

// Test
const root = {
  key: 'A1',
  children: [
    {
      key:  'B1',
      children: [
        {
          key: 'C1',
          children: []
        },
        {
          key: 'C2',
          children: []
        }
      ]
    },
    {
      key:  'B2',
      children: []
    }
  ]
}
walk(root, (node) => {
  console.log(node.key)
})