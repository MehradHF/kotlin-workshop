---
title: Kotlin on your machine
section: Next steps
guide: true
---
So far every line of Kotlin ran on JetBrains' servers. Real projects (including the Spring Boot part of this workshop) are built on your own machine, so this page sets that up. You will move your capstone solution into a normal Gradle project and run its tests from the IDE and the command line. Plan for 20 to 30 minutes, most of it downloads.

## The pieces, in Python terms

| Python | Kotlin on the JVM |
|---|---|
| The `python` interpreter | The **JDK** (Java Development Kit): the JVM that runs your code, plus tools. Kotlin compiles to JVM bytecode, so it needs a JDK, not a separate Kotlin runtime. |
| `pyproject.toml` + pip + venv | **Gradle** and its `build.gradle.kts` file: dependencies, build, test and run, all in one tool |
| PyPI | **Maven Central**, where Gradle downloads libraries from |
| `pytest` | **JUnit**, used through `kotlin.test` (the same `assertEquals` you have been using) |
| `python -i` / a REPL | A **scratch file** in IntelliJ, or the Kotlin REPL |

Each project gets its own dependencies automatically (Gradle caches them per version), so there is no virtualenv to activate.

## 1. Install IntelliJ IDEA and a JDK

Install [IntelliJ IDEA](https://www.jetbrains.com/idea/download/). The free edition is enough. It is made by the company behind Kotlin, and its Kotlin support is far ahead of other editors. (VS Code works for Kotlin, but only just.)

You need a **JDK, version 21 or newer**. The easiest way: let IntelliJ download one when it asks for an SDK (step 3). If you prefer the terminal:

```bash
# macOS with Homebrew
brew install --cask temurin@21

# macOS / Linux with SDKMAN (https://sdkman.io), a bit like pyenv for the JVM
sdk install java 21-tem

# Windows
winget install EclipseAdoptium.Temurin.21.JDK
```

Check it with `java -version`. You should see `21` (or newer) in the output.

## 2. Get the starter project

The workshop repository contains a ready-made project in the `local-starter` folder. Either clone it:

```bash
git clone https://github.com/MehradHF/kotlin-workshop.git
```

or [download it as a ZIP](https://github.com/MehradHF/kotlin-workshop/archive/refs/heads/main.zip) and unpack it.

```plaintext
local-starter/
├── build.gradle.kts          like pyproject.toml: plugins, dependencies, settings
├── settings.gradle.kts       the project name
├── gradlew, gradlew.bat      the Gradle wrapper: downloads the right Gradle version for you
└── src/
    ├── main/kotlin/          your code (Orders.kt, Main.kt)
    └── test/kotlin/          your tests (OrdersTest.kt)
```

The code and tests live in separate folders, and the folder names follow a convention, so Gradle needs no configuration to find them. The `build.gradle.kts` file is short:

```kotlin
plugins {
    kotlin("jvm") version "2.4.21"     // compile Kotlin for the JVM
    application                       // adds `./gradlew run`
}

repositories {
    mavenCentral()                    // where libraries come from
}

dependencies {
    testImplementation(kotlin("test"))   // like a dev-dependency: only for tests
}
```

Yes, it is Kotlin too: a DSL built with lambdas with receiver, exactly like the builders from that exercise.

## 3. Open it in IntelliJ

**File → Open**, then select the `local-starter` folder (not a single file) and choose **Trust Project**. IntelliJ reads the Gradle files and downloads Gradle, the Kotlin compiler and the test libraries. The first time this takes a few minutes, with progress shown in the bottom bar.

If it asks for a JDK ("Project SDK is not defined"), pick **Download JDK** and choose version 21 or newer from any vendor.

## 4. Run the tests (they fail)

Open `src/test/kotlin/OrdersTest.kt` and click the green arrow next to `class OrdersTest`. All 10 tests fail with `NotImplementedError`: `Orders.kt` contains only the `TODO()` stubs from the capstone.

The same from a terminal, inside `local-starter`:

```bash
./gradlew test          # Windows: gradlew.bat test
```

## 5. Bring your capstone solution

Open the capstone exercise on this site (your code is still saved there) and copy the four functions. In `src/main/kotlin/Orders.kt`, paste them over the stubs. Run the tests again: all green.

Then run the program itself. Open `Main.kt` and click the green arrow next to `fun main`, or run:

```bash
./gradlew run
```

You should see:

```plaintext
Parsed 2 of 3 lines
Total: 2749 cents
```

A few things you can try now that the playground did not offer:

- **Ctrl-click** (⌘-click on macOS) `sumOf` or `groupBy` to read the standard library source. It is ordinary Kotlin, and very readable.
- Put a **breakpoint** in `parseLine` (click the line number) and run the test with the bug icon instead of the arrow.
- **File → New → Scratch File → Kotlin** gives you a throwaway file that shows results as you type, the closest thing to a Python REPL.
- Break a test on purpose and see how Gradle reports the failure.

## Adding a library

Where Python has `pip install requests`, Gradle has one line in `dependencies { }`. Libraries are named `group:artifact:version`:

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.8.0")   // used by your code
    testImplementation(kotlin("test"))                               // used only by tests
}
```

IntelliJ shows a small Gradle "reload" button after you edit the file. Click it, and the library is ready to import.

## What's next

The Spring Boot part of the workshop uses exactly this setup. [start.spring.io](https://start.spring.io) generates a project like `local-starter` (choose **Gradle - Kotlin** and **Kotlin**) with Spring added to `dependencies`. Everything from these exercises carries over: data classes become your request and response bodies, null safety meets JSON, and collection pipelines do most of the work in between.
