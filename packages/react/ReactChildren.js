import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols';
const SEPARATOR = '.';
const SUBSEPARATOR = ':';
function mapChildren(children, mapFunction, context) {
  const result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, mapFunction, context);
  return result;
}

function mapIntoWithKeyPrefixInternal(children, result, prefix, mapFunction, context) {
  if (prefix != null) {
    prefix = prefix + '/';
  }
  const traverseContext = { result, prefix, mapFunction, context };
  traverseAllChildren(children, '', mapSingleChildIntoContext, traverseContext);
}

function traverseAllChildren(children, nameSoFar, mapSingleChildIntoContext, traverseContext) {
  const type = typeof children;
  if (type === 'string' || type === 'number' || (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)) {
    mapSingleChildIntoContext(
      traverseContext,
      children,
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    );
  }
  if (Array.isArray(children)) {
    let child;
    let nextName;
    const nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;
    for (let i = 0; i < children.length; i) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      traverseAllChildren(child, nextName, mapSingleChildIntoContext, traverseContext);
    }
  }
}
function mapSingleChildIntoContext(traverseContext, child, childKey) {
  const { result, prefix, mapFunction, context } = traverseContext;
  let mappedChild = mapFunction.call(context, child);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c);
  } else if (mappedChild != null) {
    result.push({ ...mappedChild, key: prefix + childKey });
  }
}
function getComponentKey(component, index) {
  return component.key || index.toString(36);
}
export {
  mapChildren as map
};
