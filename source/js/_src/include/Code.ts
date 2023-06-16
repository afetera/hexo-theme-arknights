/// <reference path="common/base.ts" />

'use strict'

class Code {
  private doAsMermaid = (item: Element) => {
    let Amermaid = item.querySelector('.mermaid') as HTMLElement
    item.outerHTML = '<div class="highlight mermaid">' + Amermaid.innerText + '</div>'
  }

  private resetName = (str: string): string => {
    if (str == 'plaintext') {
      return 'TEXT'
    }
    if (str == 'cs') {
      return 'C#'
    }
    if (str == 'cpp') {
      return 'C++'
    }
    return str.toUpperCase()
  }

  private doAsCode = (item: Element) => {
    const codeType = this.resetName(item.classList[1]),
      lineCount = getElement('.gutter', item).children[0].childElementCount >> 1
    item.classList.add(lineCount < 16 ? 'open' : 'fold')
    item.classList.add('code')
    item.innerHTML =
      `<div class="code-header" tabindex='0'>
        <div class="code-title">
          <i class="status-icon"></i>
          <span>${format(config.code.codeInfo, codeType, lineCount)}</span>
        </div>
        <div class="code-header-tail">
          <button class="code-copy">${config.code.copy}</button>
          <div class="code-space">${config.code.expand}</div>
        </div>
      </div>
      <div class="content-box">${item.innerHTML}</div>`
    getElement('.code-copy', item).addEventListener('click', (click: Event) => {
      const button = click.target as HTMLElement
      navigator.clipboard.writeText(getElement('code', item).innerText)
      button.classList.add('copied')
      button.innerText = config.code.copyFinish
      setTimeout(() => {
        button.classList.remove('copied')
        button.innerText = config.code.copy
      }, 1200)
    })
  }

  private clearMermaid = () => {
    document.querySelectorAll('.mermaid').forEach((item) => {
      let style = item.querySelector('style')
      if (style) {
        style.remove()
      }
    })
  }

  public findCode = () => {
    let codeBlocks = document.querySelectorAll('.highlight')
    if (codeBlocks !== null) {
      codeBlocks.forEach(item => {
        if (item.getAttribute('code-find') === null) {
          try {
            if (!item.classList.contains('mermaid') && item.querySelector('.code-header') === null) {
              if (item.querySelector('.mermaid') !== null) {
                this.doAsMermaid(item)
              } else {
                this.doAsCode(item)
              }
            }
          } catch (e) {
            return
          }
          item.setAttribute('code-find', '')
        }
      })
    }
    mermaid.init()
    this.clearMermaid()
  }

  constructor() {
    this.findCode()
    document.addEventListener('pjax:success', this.findCode)
  }
}

let code = new Code()
