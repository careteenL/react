import { updateQueue } from './component';
export function addEvent(dom, eventType, listener) {
  eventType = eventType.toLowerCase();
  let eventStore = dom.eventStore || (dom.eventStore = {});
  eventStore[eventType] = listener;
  document.addEventListener(eventType.slice(2), dispatchEvent, false);
}
let syntheticEvent;

function dispatchEvent(event) {
  let { type, target } = event;
  let eventType = 'on' + type;
  syntheticEvent = getSyntheticEvent(event);
  //在事件监听函数执行前先进入批量更新模式
  updateQueue.isPending = true;
  while (target) {
    let { eventStore } = target;
    let listener = eventStore && eventStore[eventType];
    if (listener) {
      listener.call(target, syntheticEvent);
    }
    target = target.parentNode;
  }
  for (let key in syntheticEvent) {
    if (syntheticEvent.hasOwnProperty(key))
      delete syntheticEvent[key];
  }
  //当事件处理函数执行完成后，把批量更新模式改为false
  updateQueue.isPending = false;
  //执行批量更新，就是把缓存的那个updater全部执行了
  updateQueue.batchUpdate();
}
function persist() {
  syntheticEvent = {};
  Object.setPrototypeOf(syntheticEvent, {
    persist
  });
}
function getSyntheticEvent(nativeEvent) {
  if (!syntheticEvent) {
    persist();
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.currentTarget = nativeEvent.target;
  for (let key in nativeEvent) {
    if (typeof nativeEvent[key] == 'function') {
      syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
    } else {
      syntheticEvent[key] = nativeEvent[key];
    }
  }
  return syntheticEvent;
}
