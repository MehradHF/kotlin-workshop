// Checks every exercise against the real Kotlin Playground server:
//   - the solution must compile and pass all tests
//   - the starter must compile and fail at least one test (otherwise it is already "solved")
// Usage: node verify.mjs [id-prefix ...]
import { loadExercises } from './build.mjs'

const VERSION = process.env.KOTLIN_VERSION ?? '2.4.21'
const BASE = `https://api.kotlinlang.org/api/${VERSION}/compiler`

async function post(endpoint, confType, text) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ args: '', confType, files: [{ name: 'File.kt', text, publicId: '' }] }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const errorsOf = (r) =>
  Object.values(r.errors ?? {})
    .flat()
    .filter((e) => e.severity === 'ERROR')
    .map((e) => `line ${e.interval.start.line + 1}: ${e.message}`)

async function runTests(code) {
  const r = await post('test', 'junit', code)
  const compile = errorsOf(r)
  const results = Object.values(r.testResults ?? {}).flat()
  return { compile, results, exception: r.exception?.message }
}

async function runMain(code) {
  const r = await post('run', 'java', code)
  return { compile: errorsOf(r), exception: r.exception?.message, text: r.text }
}

const prefixes = process.argv.slice(2)
const exercises = loadExercises().filter((e) => !prefixes.length || prefixes.some((p) => e.id.startsWith(p)))
let failed = 0
const fail = (id, msg) => {
  failed++
  console.log(`  FAIL ${id}: ${msg}`)
}

for (const ex of exercises) {
  const problems = []
  try {
    const sol = await runTests(ex.solution)
    if (sol.compile.length) problems.push(`solution does not compile: ${sol.compile.join('; ')}`)
    else if (!sol.results.length) problems.push(`solution ran no tests (${sol.exception ?? 'no results'})`)
    else {
      const bad = sol.results.filter((t) => t.status !== 'OK')
      if (bad.length) problems.push(`solution fails: ${bad.map((t) => `${t.methodName} (${t.comparisonFailure?.message ?? t.exception?.message})`).join('; ')}`)
    }

    const st = await runTests(ex.starter)
    if (st.compile.length) problems.push(`starter does not compile: ${st.compile.join('; ')}`)
    else if (st.results.length && st.results.every((t) => t.status === 'OK')) problems.push('starter already passes all tests')

    for (const [i, code] of ex.runs.entries()) {
      const m = await runMain(code)
      if (m.compile.length || m.exception) problems.push(`run snippet ${i}: ${[...m.compile, m.exception].filter(Boolean).join('; ')}`)
    }
  } catch (e) {
    problems.push(`request failed: ${e.message}`)
  }
  if (problems.length) problems.forEach((p) => fail(ex.id, p))
  else console.log(`  ok   ${ex.id}`)
}
console.log(failed ? `\n${failed} problem(s)` : '\nAll exercises verified')
process.exit(failed ? 1 : 0)
