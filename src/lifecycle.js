import Watcher from "./observer/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
  Vue.prototype.$nextTick = nextTick
}

export function mountComponent(vm, el) {
  let updateComponent = () => {
    vm._update(vm._render())
  }
  // updateComponent()
  callHook(vm, 'beforeMounted')
  new Watcher(vm, updateComponent, () => {
    console.log('视图更新了')
  }, true)
  callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
  let handlers = vm.$options[hook]
  if(handlers) {
    for(let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}