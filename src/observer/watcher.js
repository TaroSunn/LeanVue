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

    this.value = this.get()
  }
  get() {
    pushTarget(this)
    const value = this.getter()
    popTarget()

    return value
  }
  update() {
    queueWatcher(this)
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
}

export default Watcher