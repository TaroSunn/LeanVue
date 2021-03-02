import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import {lifecycleMixin} from './lifecycle'
import { renderMixin } from "./render"
import { stateMixin } from "./state"
function Vue(option) {
  // 初始化操作
  this._init(option)
}

initMixin(Vue)

renderMixin(Vue)

lifecycleMixin(Vue)

stateMixin(Vue)

initGlobalApi(Vue)

import {compileToFunction} from './compiler/index'
import {createElm, patch} from './vdom/patch'

let oldTemplate = `<div style="color:red;background: blue" a="1">
  <li key="A">A</li> 
  <li key="B">B</li>
  <li key="C">C</li>
  <li key="D">D</li>
</div>`

let vm1 = new Vue({data: {message: 'hello'}})
const render1 = compileToFunction(oldTemplate)
const oldVnode = render1.call(vm1)

document.body.appendChild(createElm(oldVnode))

let newTemplate = `<div b="1" style="color:green">
  <li key="D">D</li>
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
</div>`
let vm2 = new Vue({data: {message: 'test'}})
const render2 = compileToFunction(newTemplate)
const newVnode = render2.call(vm2)

setTimeout(() => {
  patch(oldVnode, newVnode)
}, 2000);

export default Vue