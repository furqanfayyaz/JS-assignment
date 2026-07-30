// ============================================================
// PART B — Promise-based implementation
// ============================================================
// Same operations as callbacks.js, but each returns a Promise.
// Chaining with .then() flattens the nesting into a straight
// line, and a single .catch() at the end handles ANY failure
// in the chain — no matter which step it came from.

function login() {
  console.log("Authenticating user...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("✅ Login successful");
      resolve({ userId: 1 });
    }, 2000);
  });
}

function getProfile(userId) {
  console.log("Loading profile...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("✅ Profile loaded");
      resolve({ userId, name: "Jane Doe" });
    }, 1000);
  });
}

function getPosts(userId) {
  console.log("Loading posts...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("✅ Posts loaded");
      resolve([{ id: 101, title: "First Post" }, { id: 102, title: "Second Post" }]);
    }, 2000);
  });
}

function getComments(postId) {
  console.log("Loading comments...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("✅ Comments loaded");
      resolve([{ id: 1, text: "Nice post!" }]);
    }, 1500);
  });
}

function getNotifications(userId) {
  console.log("Loading notifications...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("✅ Notifications loaded");
      resolve([{ id: 1, msg: "You have a new follower" }]);
    }, 1000);
  });
}

// --- Orchestration: flat .then() chain instead of nesting ---

function loadDashboard() {
  let profileRef; // needed later steps depend on data from earlier ones

  login()
    .then((user) => getProfile(user.userId))
    .then((profile) => {
      profileRef = profile;
      return getPosts(profile.userId);
    })
    .then((posts) => getComments(posts[0].id))
    .then(() => getNotifications(profileRef.userId))
    .then(() => {
      console.log("=========================");
      console.log("Dashboard Ready");
      console.log("=========================");
    })
    .catch((err) => {
      // A single catch handles a rejection from ANY step above —
      // this is the big win over callbacks: one error path, not one per step.
      console.error("❌", err.message || err);
      console.log("Application terminated.");
    });
}

loadDashboard();

module.exports = { login, getProfile, getPosts, getComments, getNotifications };
