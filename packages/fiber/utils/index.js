export const sleep = (delay) => {
  for (var start = Date.now(); Date.now() - start <= delay;) {}
}

export const sleepAsync = (delay) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
