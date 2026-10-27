# Kotlin for Python developers: self-paced workshop

Part 1 of a Kotlin + Spring Boot workshop. 24 short exercises in the browser, each with a lesson that puts
Python and Kotlin side by side, then a task with automated tests. Code runs on JetBrains' public Kotlin
Playground servers, so there is nothing to install. A final guide page then moves the learner to a local
JDK + IntelliJ + Gradle setup (the `local-starter/` project), ready for the Spring Boot part.

Topics follow the order of Kotlin Koans, but every lesson and exercise here is original and framed for
people who already know Python: basics, classes and data classes, null safety, lambdas, collections,
extension functions, scope functions, lambdas with receiver (builders and DSLs), exceptions,
generics, operators, and a small order-processing capstone.

## Run it

Learners just open **https://mehradhf.github.io/kotlin-workshop/**. Every push to `main` rebuilds and publishes
`site/` through `.github/workflows/pages.yml` (one-time setup: repo Settings → Pages → Source: "GitHub Actions").

To work on it locally:

```bash
npm run serve        # then open http://localhost:8000
```

(Any static file server works, but `npm run serve` disables caching so updates show up on a normal reload.) You need internet access,
because the editor and compiler come from `unpkg.com` and `api.kotlinlang.org`.

Progress and the learner's code are saved in the browser's `localStorage`, so a refresh loses nothing.

## How a learner uses it

1. Read the lesson (Python on the left, Kotlin on the right; some snippets are runnable).
2. Edit the visible part of the editor. The tests are folded away under the `+` button.
3. Press the green play button. Failures are listed per test, and when everything passes the exercise gets a tick.
4. Stuck? Open the hints one at a time, then the solution as a last resort.

## Authoring exercises

Each exercise is one Markdown file in `exercises/` (`NN-slug.md`):

````markdown
---
title: Hello, Kotlin
section: Basics
---
Lesson text. A ```python block followed directly by a ```kotlin block is shown side by side.
A ```kotlin run block (with a `fun main`) becomes a runnable snippet.

```habit
**A Python habit to unlearn.** Shown as a callout where it appears in the lesson. Inline Markdown only.
```

## Your task
What the learner must do.

```hint
One block per hint, shown one at a time.
```
```kotlin starter
// full file: imports, given code, the editable region, and the JUnit tests
//sampleStart
fun hello(): String = TODO()
//sampleEnd
```
```kotlin solution
// same file with the editable region filled in
```
````

Only the code between `//sampleStart` and `//sampleEnd` is editable.

A page with `guide: true` in its front matter is reading only: it needs no task, starter or solution, and the
learner ticks it off with a "Mark as done" button (see `27-kotlin-on-your-machine`).

To take an exercise out of the site without deleting it, add `hidden: true` to its front matter and run
`npm run build`. It stays in `exercises/` and `npm run verify` still checks it. Remove the line to bring it back.
Currently hidden: `17-sealed-classes` (sealed classes and exhaustive `when`) and `22-properties-delegates`
(`lazy` and `lateinit`).

```bash
npm run build        # exercises/*.md -> site/exercises.js, and stamps index.html with a cache-busting version (commit both)
npm run verify       # compile-checks every exercise against the real Kotlin server
node verify.mjs 07   # ...or only exercises whose id starts with 07
```

`verify` asserts for every exercise that the **solution passes all tests**, the **starter compiles but fails
at least one test**, and every `kotlin run` snippet compiles and runs. Run it after any edit.
Set `KOTLIN_VERSION` to test against another compiler version (default `2.4.21`).

`local-starter/` is a Gradle project (Kotlin `2.4.21`, Gradle wrapper `9.8.2`) with the capstone's model, `TODO()`
stubs and tests. When you change the capstone, keep it in sync, and check it with `./gradlew test` (it should fail until
the solution is pasted in). Keep the Kotlin version there and in `verify.mjs` the same.

## Layout

```
exercises/   source of truth, one Markdown file per exercise
site/        static web app (index.html, app.js, style.css) + generated exercises.js
build.mjs    compiles exercises into site/exercises.js
verify.mjs   checks exercises against the Kotlin Playground compile API
serve.mjs    tiny static server for site/ with caching disabled
local-starter/  Gradle project learners open in IntelliJ on the last page
.github/workflows/pages.yml  publishes site/ to GitHub Pages
```

## Part 2

Spring Boot is not part of this workshop yet: the browser playground cannot run Spring, so Part 2 will be
a guided project in IntelliJ.
