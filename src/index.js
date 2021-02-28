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

export default Vue