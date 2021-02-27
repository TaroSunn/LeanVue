import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.user = !!options.user
    this.options = options
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    this.lazy = !!options.lazy
    this.dirty = options.lazy
    if(typeof exprOrFn === 'string') {
      this.getter = function () {
        let path = exprOrFn.split('.')
        let obj = vm
        for(let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    } else {
      this.getter = exprOrFn
    }
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    pushTarget(this)
    const value = this.getter.call(this.vm)
    popTarget()

    return value
  }
  update() {
    if(this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    let newValue = this.get()
    let oldValue = this.value

    this.value = newValue
    if(this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
  addDep(dep) {
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  evaluate() {
    this.dirty = false
    this.value = this.get()
  }
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }
}

export default Watcher