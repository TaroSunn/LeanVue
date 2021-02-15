import { observe } from "./observer/index"
import { proxy } from "./util"

export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  } 
}


function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data

  for(let key in data) {
    proxy(vm, '_data', key)
  }

  observe(data)
}