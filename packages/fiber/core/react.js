import { ELEMENT_TEXT } from './constants';
import { Update } from './UpdateQueue';
import { scheduleRoot,useReducer ,useState} from './scheduler';
/**
 * 创建元素(虚拟DOM)的广法
 * @param {} type  元素的类型div span p
 * @param {*} config  配置对象 属性 key ref
 * @param  {...any} children  放着所有的儿子，这里会做成一个数组
 */
function createElement(type, config, ...children) {
    delete config.__self;
    delete config.__source;//表示这个元素是在哪行哪列哪个文件生成的
    return {
        type,
        props: {
            ...config,//做了一个兼容处理，如果是React元素的话返回自己，如果是文本类型，如果是一个字符串的话，返回元素对象
            children: children.map(child => {
                //如果这个child是一个React.createElement返回的React元素，如果是字符串的话，才会转成文本节点
                return typeof child === 'object' ? child : {
                    type: ELEMENT_TEXT,
                    props: { text: child, children: [] }
                }
            })
        }
    }
}
class Component {
    constructor(props) {
        this.props = props;
        //this.updateQueue = new UpdateQueue();
    }
    setState(payload) {//可能是对象，也可能是一个函数
        let update = new Update(payload);
        //updateQueue其实是放在此类组件对应的fiber节点的 internalFiber
        this.internalFiber.updateQueue.enqueueUpdate(update);
        //this.updateQueue.enqueueUpdate(update);
        debugger
        scheduleRoot();//从根节点开始调度
    }
}
Component.prototype.isReactComponent = {};//类组件
const React = {
    createElement,
    Component,
    useReducer,
    useState
}
export default React;