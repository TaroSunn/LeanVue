import Dep from "./observer/dep"
import { observe } from "./observer/index"
import Watcher from "./observer/watcher"
import { isFunction } from "./utils"

export function initState(vm) {
  const opts = vm.$options

  if(opts.data) {
    initDate(vm)
  }

  if(opts.computed) {
    initComputed(vm, opts.computed)
  }

  if(opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

function initDate(vm) {
  let data = vm.$options.data

  data = vm._data = isFunction(data) ? data.call(vm) : data

  for(let key in data) {
    proxy(vm,'_data', key)
  }

  observe(data)
}

function initWatch(vm, watch) {
  for(let key in watch) {
    let handler = watch[key]
    if(Array.isArray(handler)) {
      for(let i = 0; i < handler.length; i++) {
        createWatcher(vm,key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler)
}

export function stateMixin(Vue) {
  Vue.prototype.$watch = function(key, handler, options = {}) {
    options.user = true
    new Watcher(this, key, handler, options)
  }
}

function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = {}

  for(let key in computed) {
    const userDef = computed[key]
    let getter = typeof userDef === 'function' ? userDef : userDef.get

    watchers[key] = new Watcher(vm, getter, () => {} , {
      lazy: true
    })
    
    defineComputed(vm, key, userDef)
  }
}

function createComputedGetter(key) {
  return function computedGetter() {
    let watcher = this._computedWatchers[key]
    if(watcher.dirty) {
      watcher.evaluate()
    }

    if(Dep.target) {
      watcher.depend()
    }

    return watcher.value
  }
}

function defineComputed(vm, key, userDef) {
  let shareProperty = {}
  if(typeof userDef === 'function') {
    shareProperty.get = userDef
  } else {
    shareProperty.get = createComputedGetter(key)
    shareProperty.set = userDef.set
  }
  Object.defineProperty(vm, key, shareProperty)
}