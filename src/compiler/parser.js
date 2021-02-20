const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}

let root = null
let stack = []

export function parseHTML(html) {
  // 开始标签
  function start(tagName, attributes) {
    let parent = stack[stack.length -1]
    let element = createAstElement(tagName, attributes)
    if(!root) {
      root = element
    }
    if(parent) {
      element.parent = parent
      parent.children.push(element)
    }
    stack.push(element)
  }
  // 结束标签
  function end(tagName) {
    let last = stack.pop()
    if(last.tag !== tagName) {
      throw new Error('标签有误')
    }
  }
  // 文本
  function chars(text) {
    text = text.trim()
    let parent = stack[stack.length -1]
    if(text) {
      parent.children.push({
        type: 3,
        text
      })
    }
  }
  // 删除匹配到的字符
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)

    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if(end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  while(html) {
    let textEnd = html.indexOf('<') // 解析html开头是否是<

    if(textEnd === 0) {
      // 解析开始标签
      const startTagMatch = parseStartTag(html)
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // // 解析结束标签
      const endTagMatch = html.match(endTag)
      if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }

    }
    // 文本
    let text
    if(textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if(text) {
      chars(text)
      advance(text.length)
    }
  }
  return root
}
