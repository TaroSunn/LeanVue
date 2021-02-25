import { observe } from "./observer/index"
import Watcher from "./observer/watcher"
import { isFunction } from "./utils"

export function initState(vm) {
  const opts = vm.$options

  if(opts.data) {
    initDate(vm)
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