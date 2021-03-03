export function patch(oldVnode, vnode) {

  if(!oldVnode) {
    return createElm(vnode)
  }
  if(oldVnode.nodeType === 1) {
    const parentElm = oldVnode.parentNode
    let elm = createElm(vnode)
    parentElm.insertBefore(elm, oldVnode.nextSibling)

    parentElm.removeChild(oldVnode)
    
    return elm
  } else {
    // 比较标签名称不同
    if(oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }
    let el = vnode.el = oldVnode.el

    // 比较文本
    if(vnode.tag === undefined) { // 新旧都是文本
      if(oldVnode.text !== vnode.text) {
        el.textContent = vnode.text
      }
      return
    }
    // 比较属性
    patchProps(vnode, oldVnode.data)
    
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []

    // 都有子元素
    if(oldChildren.length > 0 && newChildren.length >0) {

      pathChildren(el, oldChildren, newChildren)      

    } else if(newChildren.length > 0) {
      // 旧元素没有子元素，新元素有子元素
      for(let i = 0; i < newChildren.length; i++) {
        let child = createElm(newChildren[i])
        el.appendChild(child)
      }
    } else if(oldChildren.length > 0) {
      // 新元素没有子元素，旧元素有子元素
      el.innerHTML = ''
    }
    return el
  }
}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

function pathChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  const makeIndexByKey = (children) => {
    return children.reduce((memo, current, index) => {
      if(current.key) {
        memo[current.key] = index
      }
      return memo
    }, {})
  }
  const keysMap = makeIndexByKey(oldChildren)
  console.log(keysMap)
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if(!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    }
    if(isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    }else if(isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode , newEndVnode)
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if(isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      let moveIndex = keysMap[newStartVnode.key]
      if(moveIndex === undefined) {
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        let moveNode =  oldChildren[moveIndex]
        oldChildren[moveIndex] = null
        el.insertBefore(moveNode.el, oldStartVnode.el)
        patch(moveNode, newStartVnode)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if(newStartIndex <= newEndIndex) {
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      // el.appendChild(createElm(newChildren[i]))
      let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      el.insertBefore(createElm(newChildren[i]), anchor)
    }
  }

  if(oldStartIndex <= oldEndIndex) {
    for(let i = oldStartIndex; i <= oldEndIndex; i++) {
      if(oldChildren[i] !== null) el.removeChild(oldChildren[i].el)
    }
  }

}

function patchProps(vnode, oldProps = {}) {
  let newProps = vnode.data || {}
  let el = vnode.el

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}

  for (let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }

  for(let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  for(let key in newProps) {
    if(key === 'style') {
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}

function createComponent(vnode) {
  let i = vnode.data
  if((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  if(vnode.componentInstance) {
    return true
  }
}

export function createElm(vnode) {
  let {tag, data, children, text, vm} = vnode
  if(typeof tag === 'string') {

    if(createComponent(vnode)) {
      return vnode.componentInstance.$el
    }

    vnode.el = document.createElement(tag)
    patchProps(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })


  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}