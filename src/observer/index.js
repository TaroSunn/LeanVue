import { isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    // data.__ob__ = this
    if(Array.isArray(data)) {
      data.__proto__ = arrayMethods
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach(item => {
      observe(item)
    })
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  observe(value)
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newValue) {
      if(newValue !== value) {
        observe(newValue)
        value = newValue
        dep.notify()
      }
    }
  })
}

export function observe(data) {
  if(!isObject(data)) {
    return
  }

  if(data.__ob__) {
    return
  }
  new Observer(data)
}