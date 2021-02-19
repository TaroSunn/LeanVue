import { initMixin } from "./init"

function Vue(option) {
  // 初始化操作
  this._init(option)
}

initMixin(Vue)

export default Vue