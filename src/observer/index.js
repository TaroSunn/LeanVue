import { arrayMethods } from "./array"

const toString = Object.prototype.toString

class Observer {
  constructor(value) {

    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    })
    
    if(Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray(value) {
    value.forEach(item => {
      observe(item)
    })
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      console.log('get')
      return value
    },
    set(newVal) {
      if(newVal === value) {
        return
      }
      console.log('set')
      observe(newVal)
      value = newVal
    }
  })
}

export function observe(data) {
  if(toString.call(data) !== '[object Object]' && !Array.isArray(data)) {
    return data
  }

  if(data.__ob__) {
    return data
  }
  return new Observer(data)
}