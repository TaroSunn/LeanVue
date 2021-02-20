import { generate } from './generate'
import {parseHTML} from './parser'
export function compileToFunction(template) {
  let root = parseHTML(template)

  let code = generate(root)
  let render = new Function(`with(this) {return ${code}}`)
  return render
}