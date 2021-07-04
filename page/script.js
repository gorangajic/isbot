import isbot from '../src/index.js'
import { amend } from '../src/amend/index.js'
import list from '../src/list.json'

(function () {
  const textarea = document.querySelector('textarea')
  const output = document.querySelector('output')
  let timer

  const query = window.location.search.replace(/\?ua=(.*)$/, '$1')

  amend(list)
  const pattern = new RegExp(list.join('|'), 'i')

  textarea.innerHTML = query
    ? decodeURIComponent(query)
    : navigator.userAgent
  textarea.addEventListener('keyup', change)
  textarea.addEventListener('paste', change)
  textarea.addEventListener('focus', () => textarea.select())
  check()

  function change ({ target: { value } }) {
    clearTimeout(timer)
    timer = setTimeout(check, 200, value)
  }

  function check (value = textarea.innerHTML) {
    value = value.trim()
    if (value === '') {
      output.innerHTML = 'Insert user agent string in the text box'
      return
    }

    const result = isbot(value)

    output.innerHTML = [
      result
        ? 'I think so, yes'
        : 'I don\'t think so, no',
      result
        ? `The pattern that I recognise is <kbd>${find(value)}</kbd>`
        : 'I could not find a pattern I recognise'
    ].join('\n')

    output.className = ''
    setTimeout(() => { output.className = 'highlight' }, 100)
  }

  function find (ua) {
    const match = ua.match(pattern)
    return match && match[0]
  }
})()
