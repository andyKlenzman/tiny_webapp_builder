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
    <div style="max-width:320px;margin:8rem auto;font-family:system-ui;">
      <h2 style="margin-bottom:1rem;">Sign in</h2>
      <input id="email" type="email" placeholder="Email" style="width:100%;padding:.5rem;margin:.25rem 0;">
      <input id="password" type="password" placeholder="Password" style="width:100%;padding:.5rem;margin:.25rem 0;">
      <button id="login" style="width:100%;padding:.6rem;margin-top:.5rem;">Log in</button>
      <p id="err" style="color:#b00;min-height:1.2rem;"></p>
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
      // onAuthStateChanged unten übernimmt das Routing
    } catch (e) {
      $("#err").textContent = e.message || "Login failed";
    }
  });

  // Schaltet nach erfolgreichem Login zur App
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      wrapper.remove();
      unsub();
      onReady(user);
    }
  });

  // Optional: expose logout for a menu button
  return { logout: () => signOut(auth) };
}
