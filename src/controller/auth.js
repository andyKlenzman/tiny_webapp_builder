import { auth } from "../../firebase-config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export function mountLoginGate({ root, onReady }) {
  const wrapper = document.createElement("div");
  wrapper.id = "login-gate";
  wrapper.innerHTML = `
    <div class="login-container">
      <h2 class="login-title">Sign in</h2>
      <input id="email" type="email" placeholder="Email" class="input">
      <input id="password" type="password" placeholder="Password" class="input">
      <button id="login" class="login-button">Log in</button>
      <p id="err" class="login-error"></p>
    </div>
  `;
  root.appendChild(wrapper);

  const $ = (id) => wrapper.querySelector(id);
  $("#login").addEventListener("click", async () => {
    $("#err").textContent = "";
    try {
      const email = $("#email").value.trim();
      const pw = $("#password").value;
      await signInWithEmailAndPassword(auth, email, pw);
    } catch (e) {
      $("#err").textContent = e.message || "Login failed";
    }
  });

  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      wrapper.remove();
      unsub();
      onReady(user);
    }
  });

  return { logout: () => signOut(auth) };
}
