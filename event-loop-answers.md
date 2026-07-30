# Event Loop Challenge — Answers

## Question 1
```js
console.log("A");
setTimeout(() => { console.log("B"); }, 0);
console.log("C");
```
**Output:**
```
A
C
B
```
`A` and `C` are synchronous and run immediately on the call stack. The `setTimeout` callback is handed to the Web API, then queued as a **macrotask**. It only runs once the call stack is empty and no microtasks are pending — so it prints last, even with a 0ms delay.

---

## Question 2
```js
console.log(1);
Promise.resolve().then(() => { console.log(2); });
console.log(3);
```
**Output:**
```
1
3
2
```
`1` and `3` are synchronous. `Promise.resolve().then()` schedules its callback on the **microtask queue**, which only runs after the current synchronous code finishes — so `2` prints last.

---

## Question 3
```js
console.log("Start");
setTimeout(() => { console.log("Timeout"); }, 0);
Promise.resolve().then(() => { console.log("Promise"); });
console.log("End");
```
**Output:**
```
Start
End
Promise
Timeout
```
`Start`/`End` run synchronously first. Then the event loop always fully drains the **microtask queue** (`Promise`) before it ever touches the **macrotask queue** (`Timeout`) — regardless of which was scheduled first.

---

## Question 4
```js
console.log("Start");
async function demo() {
  console.log("Inside");
  await Promise.resolve();
  console.log("After Await");
}
demo();
console.log("End");
```
**Output:**
```
Start
Inside
End
After Await
```
Code inside an `async function` runs **synchronously** up until the first `await`. So `demo()` prints `Inside` immediately when called. The `await` then pauses the function and schedules everything after it as a microtask. `End` (synchronous, outside the function) runs before that microtask, so `After Await` prints last.

---

## Question 5
```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve()
  .then(() => { console.log("3"); })
  .then(() => { console.log("4"); });
console.log("5");
```
**Output:**
```
1
5
3
4
2
```
`1` and `5` run synchronously first. The microtask queue then drains completely — including the *second* `.then()`, which is only added to the queue after the first one resolves — all before the `setTimeout` macrotask gets a turn.

---

## Bonus Challenge
```js
console.log("Start");
setTimeout(() => console.log("Timeout 1"), 0);
Promise.resolve().then(() => {
  console.log("Promise 1");
  setTimeout(() => console.log("Timeout 2"), 0);
});
queueMicrotask(() => { console.log("Microtask"); });
console.log("End");
```
**Output:**
```
Start
End
Promise 1
Microtask
Timeout 1
Timeout 2
```
1. `Start` and `End` run synchronously.
2. Microtask queue drains in order queued: the `.then()` callback (`Promise 1`) runs first, then `queueMicrotask`'s callback (`Microtask`). Note: `Promise 1`'s callback schedules `Timeout 2` as a **new macrotask** while the microtask queue is still being processed — but since it's a macrotask, it has to wait.
3. Only after the microtask queue is fully empty does the event loop move to the macrotask queue. `Timeout 1` was queued first, so it runs before `Timeout 2`.

---

## Part E — Event Loop Demonstration (Task 2)
```js
console.log("Application Started");
setTimeout(() => { console.log("Macrotask"); }, 0);
Promise.resolve().then(() => { console.log("Microtask"); });
console.log("Initializing...");
```

**1. Output order:**
```
Application Started
Initializing...
Microtask
Macrotask
```

**2. Why that order occurs:** The two `console.log` calls run synchronously and immediately, in source order. Once the call stack is empty, the event loop checks the microtask queue before the macrotask queue, so the Promise callback (`Microtask`) runs next. Only after the microtask queue is empty does the `setTimeout` callback (`Macrotask`) get pulled from the macrotask queue.

**3. Synchronous statements:** `console.log("Application Started")` and `console.log("Initializing...")`.

**4. Enters the Microtask Queue:** the `.then()` callback attached to `Promise.resolve()`.

**5. Enters the Macrotask Queue:** the `setTimeout(..., 0)` callback.
