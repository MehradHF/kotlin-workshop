// Compiles exercises/*.md into site/exercises.js (no dependencies, Node 18+).
//
// Exercise file format:
//   ---
//   title: ...
//   section: ...
//   hidden: true       (optional: keep the file and verify it, but leave it out of the site)
//   guide: true        (optional: a reading page with no task or editor; the learner marks it done)
//   ---
//   lesson markdown (plain ```python / ```kotlin blocks are shown side by side)
//   ```kotlin run      -> runnable snippet (must contain fun main)
//   ## Your task       -> everything after this heading is the task text
//   ```kotlin starter  -> full file given to the learner, editable region between //sampleStart and //sampleEnd
//   ```kotlin solution -> same file with the region filled in
//   ```hint            -> one hint per block, revealed one at a time
//   ```habit           -> "Python habit to unlearn" box, shown where it appears in the lesson (inline markdown only:
//                         a code fence inside would end the block)
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const dir = join(root, 'exercises')

export function parseExercise(file) {
  const raw = readFileSync(join(dir, file), 'utf8')
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fm) throw new Error(`${file}: missing front matter`)
  const meta = Object.fromEntries(
    fm[1].split('\n').map((l) => [
      l.slice(0, l.indexOf(':')).trim(),
      l.slice(l.indexOf(':') + 1).trim().replace(/^"(.*)"$/, '$1'),   // allow YAML-style quoted values
    ]),
  )
  let body = raw.slice(fm[0].length)

  const runs = []
  const hints = []
  const habits = []
  let starter = null
  let solution = null
  body = body.replace(/^```(\S+)?(?: (\S+))?\n([\s\S]*?)^```$/gm, (all, lang, tag, code) => {
    if (lang === 'kotlin' && tag === 'starter') starter = code.trimEnd() + '\n'
    else if (lang === 'kotlin' && tag === 'solution') solution = code.trimEnd() + '\n'
    else if (lang === 'kotlin' && tag === 'run') {
      runs.push(code.trimEnd() + '\n')
      return `<div class="run-slot" data-run="${runs.length - 1}"></div>`
    } else if (lang === 'habit') {
      habits.push(code.trim())
      return `<div class="habit-slot" data-habit="${habits.length - 1}"></div>`
    } else if (lang === 'hint') hints.push(code.trim())
    else return all
    return ''
  })
  const guide = meta.guide === 'true'
  if (!guide && (!starter || !solution)) throw new Error(`${file}: needs starter and solution blocks`)

  const [lesson, task = ''] = body.split(/^## Your task\s*$/m)
  const region = (src) => {
    const m = src.match(/^[ \t]*\/\/sampleStart\n([\s\S]*?)^[ \t]*\/\/sampleEnd/m)
    if (!m) throw new Error(`${file}: missing //sampleStart ... //sampleEnd`)
    return m[1].trimEnd() + '\n'
  }
  return {
    id: file.replace(/\.md$/, ''),
    title: meta.title,
    section: meta.section,
    hidden: meta.hidden === 'true',
    guide,
    lesson: lesson.trim(),
    task: task.trim(),
    runs,
    habits,
    hints,
    starter,
    solution,
    solutionRegion: guide ? null : region(solution),
  }
}

export function loadExercises() {
  return readdirSync(dir)
    .filter((f) => /^\d+-.*\.md$/.test(f))
    .sort()
    .map(parseExercise)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const exercises = loadExercises().filter((e) => !e.hidden)
  writeFileSync(join(root, 'site', 'exercises.js'), `window.EXERCISES = ${JSON.stringify(exercises, null, 1)};\n`)
  console.log(`Built ${exercises.length} exercises -> site/exercises.js`)

  // Cache busting: GitHub Pages lets browsers cache files for 10 minutes, and a fresh exercises.js with a stale app.js
  // renders wrongly. Stamping one fingerprint of all three files onto their URLs means a browser either reuses the whole
  // previous set or fetches the whole new one, never a mix.
  const assets = ['style.css', 'exercises.js', 'app.js']
  const hash = createHash('sha256')
  for (const a of assets) hash.update(readFileSync(join(root, 'site', a)))
  const version = hash.digest('hex').slice(0, 10)
  const indexPath = join(root, 'site', 'index.html')
  const index = readFileSync(indexPath, 'utf8')
  const stamped = index.replace(/"(style\.css|exercises\.js|app\.js)(\?v=[0-9a-f]+)?"/g, `"$1?v=${version}"`)
  if (stamped.match(/\?v=/g)?.length !== assets.length) throw new Error('site/index.html: expected one reference to each of ' + assets.join(', '))
  writeFileSync(indexPath, stamped)
  console.log(`Stamped site/index.html with version ${version}`)
}
