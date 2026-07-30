// ============================================================
// PART A — Callback-based implementation ("callback hell")
// ============================================================
// Each step only starts after the previous one's callback fires.
// Notice the nesting depth growing with every step — this is the
// classic "pyramid of doom" that Promises/async-await solve.

// --- Simulated async operations (each uses setTimeout as a fake network call) ---

function login(callback) {
  console.log("Authenticating user...");
  setTimeout(() => {
    console.log("✅ Login successful");
    callback(null, { userId: 1 });
  }, 2000);
}

function getProfile(userId, callback) {
  console.log("Loading profile...");
  setTimeout(() => {
    console.log("✅ Profile loaded");
    callback(null, { userId, name: "Jane Doe" });
  }, 1000);
}

function getPosts(userId, callback) {
  console.log("Loading posts...");
  setTimeout(() => {
    console.log("✅ Posts loaded");
    callback(null, [{ id: 101, title: "First Post" }, { id: 102, title: "Second Post" }]);
  }, 2000);
}

function getComments(postId, callback) {
  console.log("Loading comments...");
  setTimeout(() => {
    console.log("✅ Comments loaded");
    callback(null, [{ id: 1, text: "Nice post!" }]);
  }, 1500);
}

function getNotifications(userId, callback) {
  console.log("Loading notifications...");
  setTimeout(() => {
    console.log("✅ Notifications loaded");
    callback(null, [{ id: 1, msg: "You have a new follower" }]);
  }, 1000);
}

// --- Orchestration: nested callbacks, executed strictly in order ---

function loadDashboard() {
  // Synchronous line — runs before any timers fire
  login((err, user) => {
    if (err) return console.error("❌ Failed to login.", err);

    getProfile(user.userId, (err, profile) => {
      if (err) return console.error("❌ Failed to load profile.", err);

      getPosts(profile.userId, (err, posts) => {
        if (err) return console.error("❌ Failed to load posts.", err);

        getComments(posts[0].id, (err, comments) => {
          if (err) return console.error("❌ Failed to load comments.", err);

          getNotifications(profile.userId, (err, notifications) => {
            if (err) return console.error("❌ Failed to load notifications.", err);

            console.log("=========================");
            console.log("Dashboard Ready");
            console.log("=========================");
          });
        });
      });
    });
  });
}

loadDashboard();

module.exports = { login, getProfile, getPosts, getComments, getNotifications };
