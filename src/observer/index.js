const toString = Object.prototype.toString

class Observer {
  constructor(value) {
    this.walk(value)
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
  if(!toString.call(data) === '[object Object]') {
    return
  }
  return new Observer(data)
}