// Single-page app: sidebar + one exercise at a time, hash-routed (#/<exercise-id>).
// Progress and the learner's code live in localStorage, so a refresh loses nothing.
const exercises = window.EXERCISES
const $ = (sel, root = document) => root.querySelector(sel)
const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props)
  node.append(...children)
  return node
}

const store = {
  get: (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(`kw:${key}`)) ?? fallback } catch { return fallback }
  },
  set: (key, value) => localStorage.setItem(`kw:${key}`, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(`kw:${key}`),
}
// The playground reports only the editable lines, never the hidden imports and tests. So we save just that
// region and splice it back into the full starter file on load. (Tolerates a full file too.)
const REGION = /^([ \t]*\/\/sampleStart\n)([\s\S]*?)(^[ \t]*\/\/sampleEnd)/m
const regionOf = (code) => (REGION.test(code) ? code.match(REGION)[2] : code)
const withRegion = (starter, region) =>
  starter.replace(REGION, (_, start, __, end) => start + region.replace(/\n*$/, '\n') + end)

const isDone = (id) => store.get('done', {})[id] === true
const markDone = (id) => { store.set('done', { ...store.get('done', {}), [id]: true }); renderSidebar() }

function renderSidebar() {
  const current = location.hash.replace('#/', '')
  const toc = $('#toc')
  toc.replaceChildren()
  let section = null
  for (const ex of exercises) {
    if (ex.section !== section) {
      section = ex.section
      toc.append(el('h2', { textContent: section }))
    }
    const link = el('a', { href: `#/${ex.id}`, className: ex.id === current ? 'current' : '' },
      el('span', { className: 'mark', textContent: isDone(ex.id) ? '✓' : '' }),
      el('span', { textContent: ex.title }))
    toc.append(link)
  }
  const done = exercises.filter((e) => isDone(e.id)).length
  $('#progress-bar').style.width = `${(done / exercises.length) * 100}%`
  $('#progress-text').textContent = `${done} of ${exercises.length} exercises done`
}

function renderWelcome() {
  const sections = [...new Set(exercises.map((e) => e.section))]
  const main = $('#content')
  main.innerHTML = `
    <h1>Kotlin for Python developers</h1>
    <p>Each exercise has a short lesson with Python and Kotlin side by side, then a task: edit the highlighted
       code and press <b>Run</b>. When every test is green the exercise is ticked off.</p>
    <p>Stuck? Open a <b>hint</b> first, and the <b>solution</b> only as a last resort. Your code and progress
       are saved in this browser.</p>
    <div class="cards"></div>
    <a class="btn primary" href="#/${exercises[0].id}">Start with exercise 1 →</a>`
  const cards = $('.cards', main)
  for (const s of sections) {
    const list = exercises.filter((e) => e.section === s)
    cards.append(el('div', { className: 'card' }, el('h3', { textContent: s }),
      el('ul', {}, ...list.map((e) => el('li', { textContent: e.title })))))
  }
}

// Wrap each Python snippet and the Kotlin snippet right after it in a two-column grid.
function pairSnippets(root) {
  for (const py of root.querySelectorAll('pre > code.language-python')) {
    const pre = py.parentElement
    const next = pre.nextElementSibling
    if (!next || !next.matches('pre') || !next.querySelector('code.language-kotlin')) continue
    pre.classList.add('py')
    next.classList.add('kt')
    const wrap = el('div', { className: 'compare' })
    pre.before(wrap)
    wrap.append(pre, next)
  }
}

function playgroundFor(code, { junit, onTestPassed, onTestFailed, onChange }) {
  const node = el('code', { textContent: code })
  if (junit) node.setAttribute('data-target-platform', 'junit')
  node.setAttribute('theme', 'idea')
  node.setAttribute('data-autocomplete', 'true')
  node.setAttribute('match-brackets', 'true')
  node.setAttribute('indent', '4')
  return { node, mount: () => KotlinPlayground(node, { onTestPassed, onTestFailed, onChange }) }
}

function renderExercise(ex, index) {
  const main = $('#content')
  const savedCode = store.get(`code:${ex.id}`, null)
  main.replaceChildren()

  const status = el('div', { className: 'status' })
  const lesson = el('div', { innerHTML: marked.parse(ex.lesson) })
  pairSnippets(lesson)
  lesson.querySelectorAll('pre code').forEach((c) => hljs.highlightElement(c))

  const pending = []
  lesson.querySelectorAll('.run-slot').forEach((slot) => {
    const pg = playgroundFor(ex.runs[Number(slot.dataset.run)], {})
    slot.replaceWith(pg.node)
    pending.push(pg.mount)
  })

  const prev = exercises[index - 1]
  const next = exercises[index + 1]
  const nav = el('div', { className: 'nav' },
    prev ? el('a', { className: 'btn', href: `#/${prev.id}`, textContent: `← ${prev.title}` }) : el('span'),
    next ? el('a', { className: 'btn primary', href: `#/${next.id}`, textContent: `${next.title} →` })
         : el('a', { className: 'btn primary', href: '#/', textContent: 'Finished! Back to start' }))
  const crumb = el('div', { className: 'crumb', textContent: `${ex.section} · ${index + 1} of ${exercises.length}` })

  // Guide pages are reading only: no editor, the learner ticks them off themselves.
  if (ex.guide) {
    const doneBtn = el('button', { className: 'btn', onclick: () => { markDone(ex.id); doneBtn.disabled = true; doneBtn.textContent = '✓ Done' } })
    doneBtn.disabled = isDone(ex.id)
    doneBtn.textContent = doneBtn.disabled ? '✓ Done' : 'Mark as done'
    main.append(crumb, el('h1', { textContent: ex.title }), lesson, el('div', { className: 'actions' }, doneBtn), nav)
    pending.forEach((mount) => mount())
    window.scrollTo(0, 0)
    return
  }

  const editorHost = el('div', { className: 'editor' })
  const mountEditor = (code) => {
    editorHost.replaceChildren()
    status.className = 'status'
    const pg = playgroundFor(code, {
      junit: true,
      onChange: (current) => store.set(`code:${ex.id}`, regionOf(current)),
      onTestPassed: () => {
        status.className = 'status pass'
        status.textContent = '✓ All tests passed. Nice work!'
        markDone(ex.id)
      },
      onTestFailed: () => {
        status.className = 'status fail'
        status.textContent = 'Some tests failed. Read the failure messages below the editor and try again.'
      },
    })
    editorHost.append(pg.node)
    pg.mount()
  }

  const hints = ex.hints.map((h, i) => el('details', {}, el('summary', { textContent: `Hint ${i + 1}` }),
    el('div', { className: 'hint', innerHTML: marked.parseInline(h) })))
  const solution = el('details', {}, el('summary', { textContent: 'Show solution' }),
    el('pre', {}, el('code', { className: 'language-kotlin', textContent: ex.solutionRegion })))
  hljs.highlightElement($('code', solution))

  const resetBtn = el('button', { className: 'btn', textContent: 'Reset code', onclick: () => {
    if (!confirm('Discard your changes and restore the starter code?')) return
    store.remove(`code:${ex.id}`)
    mountEditor(ex.starter)
  } })

  main.append(
    crumb,
    el('h1', { textContent: ex.title }),
    lesson,
    el('h2', { textContent: 'Your task' }),
    el('div', { className: 'task', innerHTML: marked.parse(ex.task) }),
    editorHost,
    status,
    el('div', { className: 'actions' }, resetBtn),
    ...hints,
    solution,
    nav,
  )
  pending.forEach((mount) => mount())
  mountEditor(savedCode === null ? ex.starter : withRegion(ex.starter, regionOf(savedCode)))
  window.scrollTo(0, 0)
}

function route() {
  const id = location.hash.replace('#/', '')
  const index = exercises.findIndex((e) => e.id === id)
  renderSidebar()
  if (index < 0) renderWelcome()
  else renderExercise(exercises[index], index)
}

$('#reset-progress').onclick = () => {
  if (!confirm('Erase all progress and saved code in this browser?')) return
  Object.keys(localStorage).filter((k) => k.startsWith('kw:')).forEach((k) => localStorage.removeItem(k))
  location.hash = '#/'
  route()
}
window.addEventListener('hashchange', route)
route()
