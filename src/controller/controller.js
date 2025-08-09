import { Model, VIEW_MODES } from "../model/model";
import {
  createGroupElements,
  createGroupEntry,
  createAppView,
} from "../view/view";

//////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////

const updateStatusBar = (statusBarElement, statusText) => {
  if (statusBarElement) {
    statusBarElement.textContent = `Status: ${statusText}`;
  }
};

const applyViewMode = (el, allowedViewModes) => {
  el.dataset.viewMode = allowedViewModes.join(",");
  if (!allowedViewModes.includes(Model.getCurrentView())) {
    el.classList.add("hidden");
  } else {
    el.classList.remove("hidden");
  }
};

const changeViewMode = (baseElement, viewMode) => {
  const elements = baseElement.querySelectorAll("[data-view-mode]");
  elements.forEach((el) => {
    const modes = el.dataset.viewMode.split(",").map((m) => m.trim());
    if (modes.includes(viewMode)) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
};

// Einheitlicher Formatter + Subtext-Updater
const formatStreak = ({
  currentStreak,
  totalCompletions,
  totalIntervals,
} = {}) =>
  currentStreak !== undefined
    ? `🔥${currentStreak} | ✅ ${totalCompletions}/${totalIntervals}`
    : "";

const updateGroupStreakSubtext = (groupId, groupComponent) => {
  const data = Model.getStreakDataForGroup(groupId);
  const sub = groupComponent.querySelector(".group-subtext");
  if (sub) sub.textContent = formatStreak(data);
};

const buildGroupElement = (id, group) => {
  // Hinweis: Uneinheitliche DOM-Behandlung bewusst belassen; später refactoren.
  let { groupWrapper, groupEntries, groupSubtext } = createGroupElements(
    id,
    group.groupName,
    () => Model.toggleGroupSelection(id)
  );

  const data = Model.getStreakDataForGroup(id);
  groupSubtext.classList.add("group-subtext");
  groupSubtext.textContent = formatStreak(data);

  applyViewMode(groupEntries, [VIEW_MODES.EDIT]);

  if (group.timestamps) {
    group.timestamps.forEach((timestamp) => {
      const { entryWrapper } = createGroupEntry(timestamp, () => {
        Model.toggleTimestampSelection(id, timestamp);
      });
      groupEntries.append(entryWrapper);
    });
  }

  return groupWrapper;
};

//////////////////////////////////////////////////////
// Controller Callbacks for View
//////////////////////////////////////////////////////

const handleViewModeChange = (newMode) => {
  Model.changeCurrentView(newMode);
  changeViewMode(document, newMode);
};

const handleAddGroup = async (inputField, list) => {
  const groupName = inputField.value.trim();
  if (!groupName) return;

  const id = await Model.addGroup(groupName);
  const groupWrapper = buildGroupElement(id, { groupName, timestamps: [] });
  list.append(groupWrapper);
  inputField.value = "";
};

const handleAddTimestamp = async (list) => {
  const { timestamp, updatedGroups } =
    await Model.addTimestampToSelectedGroups();

  updatedGroups.forEach(({ id }) => {
    const groupComponent = list.querySelector(`[id="${id}"]`);
    if (!groupComponent) return;

    const { entryWrapper } = createGroupEntry(timestamp, () => {
      Model.toggleTimestampSelection(id, timestamp);
    });

    const groupEntries = groupComponent.querySelector("ul");
    if (groupEntries) groupEntries.append(entryWrapper);

    updateGroupStreakSubtext(id, groupComponent);
  });
};

const handleDelete = async (list) => {
  await Model.deleteSelectedGroups();
  const state = await Model.deleteSelectedTimestamps();

  list.innerHTML = "";

  for (const [id, group] of Object.entries(state.groups)) {
    const groupWrapper = buildGroupElement(id, group);
    list.append(groupWrapper);
  }
};

const handleManualTimestamp = async (input, list) => {
  const value = input.value;
  if (!value) return;

  const timestamp = new Date(value).toISOString();
  await Model.addTimestampToSelectedGroups(timestamp);

  Model.state.selectedGroups.forEach((groupId) => {
    const groupComponent = list.querySelector(`[id="${groupId}"]`);
    const ul = groupComponent?.querySelector("ul");
    if (!ul) return;

    const { entryWrapper } = createGroupEntry(timestamp, () => {
      Model.toggleTimestampSelection(groupId, timestamp);
    });

    ul.append(entryWrapper);

    // 🔄 Streak neu berechnen + anzeigen
    updateGroupStreakSubtext(groupId, groupComponent);
  });
};

//////////////////////////////////////////////////////
// Controller Entry Point
//////////////////////////////////////////////////////

const renderApp = async () => {
  const state = await Model.init();

  const { root, list } = createAppView(
    handleViewModeChange,
    handleAddGroup,
    handleAddTimestamp,
    handleDelete,
    handleManualTimestamp
  );

  document.body.append(root);

  for (const [id, group] of Object.entries(state.groups)) {
    const groupWrapper = buildGroupElement(id, group);
    list.append(groupWrapper);
  }
};

export default renderApp;
