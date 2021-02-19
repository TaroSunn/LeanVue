import { isObject } from "../utils";
import { arrayMethods } from "./array";

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
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observe(newValue)
      value = newValue
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