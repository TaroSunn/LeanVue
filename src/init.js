import { compileToFunction } from "./compiler/index"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"
import { mergeOptions } from "./utils"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {

    const vm = this

    vm.$options = mergeOptions(vm.constructor.options, options)

    callHook(vm, 'beforeCreate')

    initState(vm)

    callHook(vm, 'created')
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    el = document.querySelector(el)
    vm.$el = el 
    const options = vm.$options
    if(!options.render) {
      let template = options.template
      if(!template && el) {
        template = el.outerHTML
        let render = compileToFunction(template)
        options.render = render
      }
    }

    mountComponent(vm, el)
  }
}