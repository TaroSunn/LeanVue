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

  new Watcher(vm, updateComponent, () => {
    console.log('视图更新了')
  }, true)
}