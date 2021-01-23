import { observe } from "./observer/index"

export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  } 
}
function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  observe(data)
}