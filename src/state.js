import { observe } from "./observer/index"
import { isFunction } from "./utils"

export function initState(vm) {
  const opts = vm.$options

  if(opts.data) {
    initDate(vm)
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