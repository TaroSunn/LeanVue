import { popTarget, pushTarget } from "./dep"

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []
    this.depsId = new Set()

    this.getter = exprOrFn

    this.get()
  }
  get() {
    pushTarget(this)
    this.getter()
    popTarget()
  }
  update() {
    this.get()
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