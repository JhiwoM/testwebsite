const USERS_KEY = "verdantUsers";
const SESSION_KEY = "verdantSession";

const $ = (id) => document.getElementById(id);
const gallery = $("gallery");
const logoutBtn = $("logoutBtn");

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  updateUI();
}

function updateUI() {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (session) {
    gallery.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    $("welcomeName").textContent = session.name;
  } else {
    gallery.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
}

$("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("regName").value.trim();
  const email = $("regEmail").value.trim().toLowerCase();
  const password = $("regPassword").value;

  if (password.length < 6) {
    $("registerMessage").textContent = "Password must be at least 6 characters.";
    return;
  }

  const users = getUsers();
  if (users.some(user => user.email === email)) {
    $("registerMessage").textContent = "An account with that email already exists.";
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setSession({ name, email });
  $("registerMessage").textContent = "Account created! Your gallery is now unlocked.";
  $("registerForm").reset();
  location.hash = "gallery";
});

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;
  const user = getUsers().find(u => u.email === email && u.password === password);

  if (!user) {
    $("loginMessage").textContent = "Incorrect email or password.";
    return;
  }

  setSession({ name: user.name, email: user.email });
  $("loginMessage").textContent = "Logged in successfully.";
  $("loginForm").reset();
  location.hash = "gallery";
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  updateUI();
  location.hash = "home";
});

updateUI();
