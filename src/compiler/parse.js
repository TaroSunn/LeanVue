const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

export function parseHTML(html) {
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }
  
  let root
  let currentParent
  let stack = []
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if(!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }
  function end(tagName) {
    let tag = stack.pop()
    currentParent = stack[stack.length - 1]
    if(currentParent) {
      tag.parent = currentParent,
      currentParent.children.push(tag)
    }    
  }
  function chars(text) {
    text = text.trim()
    if(text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }
  while(html) {
    let textEnd = html.indexOf('<')
    // 开始标签
    if(textEnd === 0) {
      const startTagMatch = parseStartTag()
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 结束标签
      const endTagMatch = html.match(endTag)
      if(endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    // 文本
    let text
    if(textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if(text) {
      advance(text.length)
      chars(text)
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end
      let attr
      // 不是闭合标签 并且 有属性
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if(end) {
        advance(end[0].length)
        return match
      }
    }
  }

  return root
}
