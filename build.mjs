// Compiles exercises/*.md into site/exercises.js (no dependencies, Node 18+).
//
// Exercise file format:
//   ---
//   title: ...
//   section: ...
//   ---
//   lesson markdown (plain ```python / ```kotlin blocks are shown side by side)
//   ```kotlin run      -> runnable snippet (must contain fun main)
//   ## Your task       -> everything after this heading is the task text
//   ```kotlin starter  -> full file given to the learner, editable region between //sampleStart and //sampleEnd
//   ```kotlin solution -> same file with the region filled in
//   ```hint            -> one hint per block, revealed one at a time
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
    fm[1].split('\n').map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]),
  )
  let body = raw.slice(fm[0].length)

  const runs = []
  const hints = []
  let starter = null
  let solution = null
  body = body.replace(/^```(\S+)?(?: (\S+))?\n([\s\S]*?)^```$/gm, (all, lang, tag, code) => {
    if (lang === 'kotlin' && tag === 'starter') starter = code.trimEnd() + '\n'
    else if (lang === 'kotlin' && tag === 'solution') solution = code.trimEnd() + '\n'
    else if (lang === 'kotlin' && tag === 'run') {
      runs.push(code.trimEnd() + '\n')
      return `<div class="run-slot" data-run="${runs.length - 1}"></div>`
    } else if (lang === 'hint') hints.push(code.trim())
    else return all
    return ''
  })
  if (!starter || !solution) throw new Error(`${file}: needs starter and solution blocks`)

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
    lesson: lesson.trim(),
    task: task.trim(),
    runs,
    hints,
    starter,
    solution,
    solutionRegion: region(solution),
  }
}

export function loadExercises() {
  return readdirSync(dir)
    .filter((f) => /^\d+-.*\.md$/.test(f))
    .sort()
    .map(parseExercise)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const exercises = loadExercises()
  writeFileSync(join(root, 'site', 'exercises.js'), `window.EXERCISES = ${JSON.stringify(exercises, null, 1)};\n`)
  console.log(`Built ${exercises.length} exercises -> site/exercises.js`)
}
