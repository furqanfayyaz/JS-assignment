<<<<<<< HEAD
# User Dashboard Simulation — JavaScript Async Patterns

A small project demonstrating synchronous vs. asynchronous execution in JavaScript by simulating a dashboard load sequence (login → profile → posts → comments → notifications) three different ways.

## Files

| File | Description |
|---|---|
| `callbacks.js` | Part A — implemented with nested callbacks only |
| `promises.js` | Part B — refactored using Promises (`.then` / `.catch`) |
| `async-await.js` | Parts C, D, E — refactored using `async/await`, with simulated random failures and the event loop demo |
| `event-loop-answers.md` | Written answers to the Event Loop Challenge (Task 1) and Part E |

## Running

```bash
node callbacks.js
node promises.js
node async-await.js
```

`async-await.js` has a 30% chance per step of simulating a failure (`SIMULATE_RANDOM_FAILURE` flag at the top of the file) — run it a few times to see both the success path and the error-handling path.

## Expected console output (happy path)

```
Application Started
Initializing...
Microtask
Macrotask
Authenticating user...
✅ Login successful
Loading profile...
✅ Profile loaded
Loading posts...
✅ Posts loaded
Loading comments...
✅ Comments loaded
Loading notifications...
✅ Notifications loaded
=========================
Dashboard Ready
=========================
```

---

## Part F — Reflection Questions

**1. Why is JavaScript considered single-threaded?**
JavaScript has exactly one call stack and can execute only one piece of code at a time. There's no built-in mechanism for running two JS functions in true parallel on separate cores the way multi-threaded languages can.

**2. If JavaScript is single-threaded, how can it perform asynchronous operations?**
The JS engine itself is single-threaded, but the *environment* it runs in (the browser or Node.js) is not. Things like timers, network requests, and file I/O are handed off to the environment (Web APIs in the browser, libuv's thread pool in Node), which does the waiting outside of JS. When that work finishes, the environment queues a callback to run back on the single JS thread via the event loop.

**3. What role does the browser (or Node.js) play in asynchronous programming?**
It provides the APIs (`setTimeout`, `fetch`, file system access, etc.) that do the actual waiting/work outside the JS call stack, and it maintains the callback/microtask queues. JS itself doesn't know how to wait for a network response — the host environment does that and hands the result back.

**4. What is the Call Stack?**
A LIFO (last-in, first-out) structure that tracks function calls currently executing. When a function is called, a frame is pushed on; when it returns, the frame is popped off. JS can only execute what's on top of the stack.

**5. What is the Event Loop?**
The mechanism that continuously checks: "Is the call stack empty?" If yes, it first drains the entire microtask queue, then takes exactly one task from the macrotask queue and pushes it onto the call stack. It repeats this forever, which is how async callbacks eventually get executed even though JS is single-threaded.

**6. What is the difference between the Callback Queue and the Microtask Queue?**
The Callback Queue (macrotask queue) holds callbacks from things like `setTimeout`, `setInterval`, and I/O events. The Microtask Queue holds callbacks from Promises (`.then`/`.catch`/`.finally`) and `queueMicrotask`. The event loop always fully empties the microtask queue before it processes even a single macrotask — microtasks have strictly higher priority.

**7. Why do Promises execute before `setTimeout(..., 0)`?**
Because Promise callbacks go into the microtask queue, and the event loop's rule is: after the current synchronous code finishes, drain the *entire* microtask queue first, and only then take one item from the macrotask queue (where `setTimeout` callbacks live). This is true even if the `setTimeout` was scheduled before the Promise resolved.

**8. Compare Callbacks, Promises, and Async/Await**

| | Advantages | Disadvantages | When to use |
|---|---|---|---|
| **Callbacks** | Simple, no extra syntax; supported everywhere | Deep nesting ("callback hell") for sequential async steps; error handling has to be manually repeated at every level; easy to create bugs (e.g. calling a callback twice) | Simple, one-off async operations, or working with older APIs that only support callbacks |
| **Promises** | Flattens nesting into a `.then()` chain; centralized error handling with `.catch()`; composable (`Promise.all`, `Promise.race`) | Chains can still get long; `.then()` syntax is less readable than plain sequential code; easy to forget a `.catch()` | Sequential or parallel async workflows where you want cleaner composition than callbacks |
| **Async/Await** | Reads like synchronous code, easiest to follow; error handling via familiar `try/catch`; easy to mix with loops and conditionals | Requires understanding Promises underneath; overusing sequential `await` can accidentally serialize things that could run in parallel (needs `Promise.all` for that) | Most modern application code — the default choice for readability and maintainability |
=======
# JS-assignment
>>>>>>> a1250bc921052904f1173274d2aa26f602fb004c
