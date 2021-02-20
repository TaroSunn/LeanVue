import { initMixin } from "./init"
import {lifecycleMixin} from './lifecycle'
import { renderMixin } from "./render"
function Vue(option) {
  // 初始化操作
  this._init(option)
}

initMixin(Vue)

renderMixin(Vue)

lifecycleMixin(Vue)

export default Vue