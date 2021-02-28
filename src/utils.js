export function isFunction(val) {
  return typeof val === 'function'
}

export function isObject(val) {
  return typeof val === 'object' && val !== null
}

const callbacks = []

function flushCallbacks() {
  callbacks.forEach(cb => cb())
  waiting = false
}

let waiting = false

function timer(flushCallbacks) {
  let timerFn = () => {}

  if(Promise) {
    timerFn = () => {
      Promise.resolve().then(flushCallbacks)
    }
  } else if(MutationObserver) {
    let textNode = document.createTextNode(1)
  
    let observe = new MutationObserver(flushCallbacks)
  
    observe.observe(textNode, {
      characterData: true
    })
  
    timerFn = () => {
      textNode.textContent = 3
    }
  } else if(setImmediate) {
    timerFn = () => {
      setImmediate(flushCallbacks)
    }
  } else {
    timerFn = () => {
      setTimeout(flushCallbacks, 0)
    }
  }
  timerFn()
}


export function nextTick(cb) {
  callbacks.push(cb)
  if(!waiting) {
    timer(flushCallbacks);
    waiting = true
  }
}

let lifecycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats = {}

function mergeHook(parentVal,childVal) {
  if(childVal) {
    if(parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal 
  }
}

lifecycleHooks.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {}
  for(let key in parent) {
    mergeField(key)
  }
  for(let key in child) {
    if(parent.hasOwnProperty(key)) {
      continue
    }
    mergeField(key)
  }
  function mergeField(key) {
    let parentVal = parent[key]
    let childVal = child[key]
    if(strats[key]) {
      options[key] = strats[key](parentVal, childVal)
    } else {
      if(isObject(parentVal) && isObject(childVal)) {
        options[key] = {...parentVal, ...childVal}
      }else {
        options[key] = child[key]
      }
    }

  }
  return options
}