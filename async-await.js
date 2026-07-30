// ============================================================
// PART C — async/await implementation
// PART D — Error handling (random simulated failure)
// ============================================================
// Same Promise-returning functions as promises.js, but the
// orchestration reads top-to-bottom like synchronous code.
// try/catch replaces .catch() and wraps ALL awaited calls —
// a rejection at any step jumps straight to the catch block,
// so nothing after a failure runs and there are no unhandled
// promise rejections.

// --- Toggle to force/allow random failure simulation (Part D) ---
const SIMULATE_RANDOM_FAILURE = true;
const FAILURE_CHANCE = 0.3; // 30% chance any given step fails

function maybeFail(stepName) {
  if (SIMULATE_RANDOM_FAILURE && Math.random() < FAILURE_CHANCE) {
    throw new Error(`Failed to load ${stepName}.`);
  }
}

function login() {
  console.log("Authenticating user...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        maybeFail("login");
        console.log("✅ Login successful");
        resolve({ userId: 1 });
      } catch (err) {
        reject(err);
      }
    }, 2000);
  });
}

function getProfile(userId) {
  console.log("Loading profile...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        maybeFail("profile");
        console.log("✅ Profile loaded");
        resolve({ userId, name: "Jane Doe" });
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

function getPosts(userId) {
  console.log("Loading posts...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        maybeFail("posts");
        console.log("✅ Posts loaded");
        resolve([{ id: 101, title: "First Post" }, { id: 102, title: "Second Post" }]);
      } catch (err) {
        reject(err);
      }
    }, 2000);
  });
}

function getComments(postId) {
  console.log("Loading comments...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        maybeFail("comments");
        console.log("✅ Comments loaded");
        resolve([{ id: 1, text: "Nice post!" }]);
      } catch (err) {
        reject(err);
      }
    }, 1500);
  });
}

function getNotifications(userId) {
  console.log("Loading notifications...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        maybeFail("notifications");
        console.log("✅ Notifications loaded");
        resolve([{ id: 1, msg: "You have a new follower" }]);
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

// --- Orchestration: linear, synchronous-looking flow ---

async function loadDashboard() {
  try {
    const user = await login();
    const profile = await getProfile(user.userId);
    const posts = await getPosts(profile.userId);
    await getComments(posts[0].id);
    await getNotifications(profile.userId);

    console.log("=========================");
    console.log("Dashboard Ready");
    console.log("=========================");
  } catch (err) {
    // Stops here — nothing after the failed await runs.
    console.error("❌", err.message);
    console.log("Application terminated.");
  }
}

// ============================================================
// PART E — Event Loop Demonstration
// ============================================================
// Placed here to run BEFORE the async dashboard logic starts,
// so its output appears first (all of it is either synchronous
// or microtask/macrotask work queued at the very start).

console.log("Application Started");

setTimeout(() => {
  console.log("Macrotask");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask");
});

console.log("Initializing...");

/*
  PART E — Explanation
  ---------------------------------------------------------
  Output order: "Application Started" -> "Initializing..." -> "Microtask" -> "Macrotask"

  1. Synchronous statements (Call Stack):
     - console.log("Application Started")
     - console.log("Initializing...")
     Both run immediately, in order, because the call stack executes
     top-to-bottom before anything else gets a turn.

  2. Microtask Queue:
     - The Promise.resolve().then(...) callback goes here.
     Once the call stack is empty, the event loop drains the ENTIRE
     microtask queue before touching macrotasks — so "Microtask" prints
     next, ahead of the timer.

  3. Macrotask Queue:
     - The setTimeout(..., 0) callback goes here.
     Even with a 0ms delay, it must wait for (a) the timer to actually
     expire and (b) the microtask queue to be fully empty. So "Macrotask"
     prints last.
*/

loadDashboard();

module.exports = { login, getProfile, getPosts, getComments, getNotifications };
