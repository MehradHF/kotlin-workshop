# Kotlin for Python developers: self-paced workshop

Part 1 of a Kotlin + Spring Boot workshop. 25 short exercises in the browser, each with a lesson that puts
Python and Kotlin side by side, then a task with automated tests. Code runs on JetBrains' public Kotlin
Playground servers, so there is nothing to install.

Topics follow the order of Kotlin Koans, but every lesson and exercise here is original and framed for
people who already know Python: basics, classes and data classes, null safety, lambdas, collections,
sealed classes, extension functions, scope functions, exceptions, generics, operators, and a small
order-processing capstone.

## Run it

```bash
npm run serve        # then open http://localhost:8000
```

(Any static file server works.) You need internet access,
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

```bash
npm run build        # exercises/*.md -> site/exercises.js (commit the result)
npm run verify       # compile-checks every exercise against the real Kotlin server
node verify.mjs 07   # ...or only exercises whose id starts with 07
```

`verify` asserts for every exercise that the **solution passes all tests**, the **starter compiles but fails
at least one test**, and every `kotlin run` snippet compiles and runs. Run it after any edit.
Set `KOTLIN_VERSION` to test against another compiler version (default `2.4.21`).

## Layout

```
exercises/   source of truth, one Markdown file per exercise
site/        static web app (index.html, app.js, style.css) + generated exercises.js
build.mjs    compiles exercises into site/exercises.js
verify.mjs   checks exercises against the Kotlin Playground compile API
```

## Part 2

Spring Boot is not part of this workshop yet: the browser playground cannot run Spring, so Part 2 will be
a guided project in IntelliJ.
