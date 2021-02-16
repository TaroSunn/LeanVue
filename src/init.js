import { compileToFunctions } from "./compiler/index"
import { mountComponent } from "./lifecycle"
import { initState } from "./state"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = options
    initState(vm)

    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    
    if(!options.render) {
      let template = options.template
      if(!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }

    mountComponent(vm, el)
  }
}