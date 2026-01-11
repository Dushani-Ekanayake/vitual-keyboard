(function () {
  const LAYOUTS = {
    alpha: [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['shift','z','x','c','v','b','n','m','backspace'],
      ['mode','space','enter','hide']
    ],
    numeric: [
      ['1','2','3'],
      ['4','5','6'],
      ['7','8','9'],
      ['0','backspace','enter','mode','hide']
    ]
  }

  const create = (tag, cls) => {
    const el = document.createElement(tag)
    if (cls) el.className = cls
    return el
  }

  const isTextInput = el =>
    el &&
    (
      el.tagName === 'TEXTAREA' ||
      (el.tagName === 'INPUT' &&
        ['text','email','search','password','tel','url','number']
          .includes((el.type || 'text').toLowerCase()))
    )

  const insertText = (el, text) => {
    el.focus()

    const start =
      typeof el.selectionStart === 'number'
        ? el.selectionStart
        : el.value.length

    const end =
      typeof el.selectionEnd === 'number'
        ? el.selectionEnd
        : el.value.length

    el.value =
      el.value.slice(0, start) +
      text +
      el.value.slice(end)

    const pos = start + text.length
    el.setSelectionRange(pos, pos)

    el.dispatchEvent(new Event('input', { bubbles: true }))
  }

  const backspace = el => {
    el.focus()

    const start =
      typeof el.selectionStart === 'number'
        ? el.selectionStart
        : el.value.length

    const end =
      typeof el.selectionEnd === 'number'
        ? el.selectionEnd
        : el.value.length

    if (start === 0 && end === 0) return

    if (start === end) {
      el.value =
        el.value.slice(0, start - 1) +
        el.value.slice(end)
      el.setSelectionRange(start - 1, start - 1)
    } else {
      el.value =
        el.value.slice(0, start) +
        el.value.slice(end)
      el.setSelectionRange(start, start)
    }

    el.dispatchEvent(new Event('input', { bubbles: true }))
  }

  class VirtualKeyboard {
    constructor() {
      this.mode = 'alpha'
      this.shift = false
      this.input = null

      this.root = create('div', 'vk hidden')
      this.body = create('div', 'vk-body')
      this.root.appendChild(this.body)
      document.body.appendChild(this.root)

      this.render()
      this.bindEvents()
    }

    bindEvents() {
      document.addEventListener('focusin', e => {
        if (e.target.matches('[data-keyboard]') && isTextInput(e.target)) {
          this.show(e.target)
        }
      })

      this.root.addEventListener('mousedown', e => {
        e.preventDefault()
      })
    }

    show(input) {
      this.input = input
      this.mode = input.dataset.keyboard === 'numeric'
        ? 'numeric'
        : 'alpha'

      this.root.classList.remove('hidden')
      input.focus()
      this.render()
    }

    hide() {
      this.input = null
      this.root.classList.add('hidden')
    }

    render() {
      this.body.innerHTML = ''

      LAYOUTS[this.mode].forEach(row => {
        const rowEl = create('div', 'vk-row')

        row.forEach(key => {
          const btn = create('button', 'vk-key')
          btn.type = 'button'
          btn.textContent = this.getLabel(key)

          if (key === 'space') btn.classList.add('space')
          if (key === 'enter') btn.classList.add('enter')

          btn.addEventListener('click', () => this.handleKey(key))
          rowEl.appendChild(btn)
        })

        this.body.appendChild(rowEl)
      })
    }

    getLabel(key) {
      if (key === 'backspace') return '⌫'
      if (key === 'shift') return this.shift ? '⇧' : 'shift'
      if (key === 'space') return 'space'
      if (key === 'enter') return 'enter'
      if (key === 'mode') return this.mode === 'alpha' ? '123' : 'abc'
      if (key === 'hide') return 'hide'
      if (this.mode === 'alpha' && key.length === 1)
        return this.shift ? key.toUpperCase() : key
      return key
    }

    handleKey(key) {
      if (!this.input) return

      switch (key) {
        case 'backspace':
          backspace(this.input)
          break
        case 'space':
          insertText(this.input, ' ')
          break
        case 'enter':
          this.input.form?.requestSubmit()
          break
        case 'shift':
          this.shift = !this.shift
          this.render()
          return
        case 'mode':
          this.mode = this.mode === 'alpha' ? 'numeric' : 'alpha'
          this.render()
          return
        case 'hide':
          this.hide()
          return
        default:
          const char =
            this.mode === 'alpha' && this.shift
              ? key.toUpperCase()
              : key

          insertText(this.input, char)

          if (this.shift && this.mode === 'alpha') {
            this.shift = false
            this.render()
          }
      }

      this.input.focus()
    }
  }

  if (!window.__virtualKeyboard__) {
    window.__virtualKeyboard__ = new VirtualKeyboard()
  }
})()

