import { db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

/*////////////////////////////////////////////////////
// Constants and DOM References
////////////////////////////////////////////////////*/
const groupName = "groups";
const itemName = "items";

const form = document.getElementById("group-form");
const nameInput = document.getElementById("group-name");
const groupsContainer = document.getElementById("groups-container");

/*////////////////////////////////////////////////////
// Neue Gruppe anlegen
////////////////////////////////////////////////////*/
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const groupLabel = nameInput.value.trim();
  if (!groupLabel) return;

  const docRef = await addDoc(collection(db, groupName), {
    name: groupLabel,
    created: new Date().toISOString(),
  });

  createGroup(groupLabel, docRef.id);
  nameInput.value = ""
});

/*////////////////////////////////////////////////////
// Bestehende Gruppen + Items laden
////////////////////////////////////////////////////*/
async function loadGroupsAndItems() {
  const groupSnap = await getDocs(collection(db, groupName));

  groupSnap.forEach(async (groupDoc) => {
    const groupData = groupDoc.data();
    const groupEl = createGroup(groupData.name, groupDoc.id);

    const q = query(
      collection(db, itemName),
      where("groupId", "==", groupDoc.id)
    );
    const itemSnap = await getDocs(q);
    const items = [];

    itemSnap.forEach((itemDoc) => {
      const itemData = itemDoc.data();
      items.push(itemData);
      addItemToGroup(groupEl, itemData.timestamp, false, groupDoc.id);
    });

    updateStreakDisplay(groupEl, items);
  });
}

/*////////////////////////////////////////////////////
// Gruppe erstellen + Streak-Anzeige
////////////////////////////////////////////////////*/
function createGroup(name, firestoreId) {
  const group = document.createElement("div");
  group.className = "group";

  const header = document.createElement("div");
  header.className = "group-header";

  const streakDisplay = document.createElement("span");
  streakDisplay.className = "group-streak";
  streakDisplay.textContent = "Streak: 0";

  const toggle = document.createElement("span");
  toggle.className = "group-toggle";
  toggle.textContent = "▼";

  const title = document.createElement("h3");
  title.className = "group-title";
  title.textContent = name;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "group-delete";
  deleteBtn.textContent = "Löschen";

  const itemContainer = document.createElement("div");
  itemContainer.className = "item-container";

  header.addEventListener("click", () => {
    itemContainer.classList.toggle("hidden");
    toggle.textContent = itemContainer.classList.contains("hidden") ? "►" : "▼";

    if (itemContainer.classList.contains("hidden")) {
      deleteBtn.classList.add("hidden");
    } else {
      deleteBtn.classList.remove("hidden");
    }
  });

  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!confirm("Gruppe wirklich löschen?")) return;

    group.remove();
    await deleteDoc(doc(db, groupName, firestoreId));

    const q = query(
      collection(db, itemName),
      where("groupId", "==", firestoreId)
    );
    const snap = await getDocs(q);
    snap.forEach(async (itemDoc) => await deleteDoc(itemDoc.ref));
  });

  header.append(streakDisplay, toggle, title, deleteBtn);
  group.append(header, itemContainer);
  groupsContainer.append(group);

  addItemToGroup(group, null, true, firestoreId);
  return group;
}

/*////////////////////////////////////////////////////
// Item hinzufügen
////////////////////////////////////////////////////*/
async function addItemToGroup(
  groupEl,
  timestamp,
  createOnCheck = true,
  groupId = null
) {
  const itemContainer = groupEl.querySelector(".item-container");

  const wrapper = document.createElement("div");
  wrapper.className = "item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const label = document.createElement("label");
  label.className = "item-label";

  let timeVal;
  if (timestamp) {
    timeVal = new Date(timestamp);
    label.textContent = timeVal.toLocaleString();
    checkbox.checked = true;
  } else {
    timeVal = new Date();
    label.textContent = "Neue Aufgabe";
  }

  checkbox.addEventListener("change", async () => {
    if (!checkbox.checked || !createOnCheck) return;

    const nowUtc = new Date().toISOString();
    label.textContent = new Date(nowUtc).toLocaleString();

    addItemToGroup(groupEl, nowUtc, false, groupId);
    await addDoc(collection(db, itemName), {
      groupId: groupId,
      timestamp: nowUtc,
    });

    const items = await getGroupItems(groupId);
    updateStreakDisplay(groupEl, items);
  });

  wrapper.append(checkbox, label);
  itemContainer.prepend(wrapper);
}

/*////////////////////////////////////////////////////
// Items einer Gruppe holen
////////////////////////////////////////////////////*/
async function getGroupItems(groupId) {
  const q = query(collection(db, itemName), where("groupId", "==", groupId));
  const snap = await getDocs(q);
  return Array.from(snap.docs).map((doc) => doc.data());
}

/*////////////////////////////////////////////////////
// Streak berechnen und anzeigen
////////////////////////////////////////////////////*/
function updateStreakDisplay(groupEl, items) {
  const streakDisplay = groupEl.querySelector(".group-streak");
  const streaks = calculateStreaks(items);
  streakDisplay.textContent = `Streak: ${streaks}`;
}

function calculateStreaks(items, intervalHours = 24, requiredInRow = 3) {
  const sorted = items.map((i) => new Date(i.timestamp)).sort((a, b) => a - b);

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate = null;

  sorted.forEach((date) => {
    if (!lastDate) {
      currentStreak = 1;
    } else {
      const diffHours = Math.abs(date - lastDate) / (1000 * 60 * 60);
      if (diffHours <= intervalHours) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }
    if (currentStreak >= requiredInRow) {
      maxStreak = Math.max(maxStreak, currentStreak);
    }
    lastDate = date;
  });

  return maxStreak;
}

/*////////////////////////////////////////////////////
// App starten
////////////////////////////////////////////////////*/
loadGroupsAndItems();
