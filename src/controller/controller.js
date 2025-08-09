import { Model, VIEW_MODES } from "../model/model";
import {
  createGroupElements,
  createGroupEntry,
  createAppView,
} from "../view/view";

//////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////
// TODO: A little overkill , na??
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
  console.log("changeViewMode:", viewMode);
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

const buildGroupElement = (id, group) => {
  // TODO: uneinheitlich Behandlung von HTML Tags. Entscheiden sie die Regeln und umbauen. Problem ist, das ich muss den ganzen Ding umbauen, wenn ich es einheitlich bauen will. Lass es einfach hier das selber und in spaeterer Iterationen, schreib es um
  let { groupWrapper, groupEntries, groupSubtext } = createGroupElements(
    id,
    group.groupName,
    () => Model.toggleGroupSelection(id)
  );

  const { currentStreak, totalCompletions, totalIntervals } =
    Model.getStreakDataForGroup(id);

  groupSubtext.classList.add("group-subtext");

  groupSubtext.textContent =
    currentStreak !== undefined
      ? `🔥${currentStreak} | ✅ ${totalCompletions}/${totalIntervals}`
      : "";

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
    const el = list.querySelector(`[id="${groupId}"]`);
    const ul = el?.querySelector("ul");
    if (!ul) return;

    const { entryWrapper } = createGroupEntry(timestamp, () => {
      Model.toggleTimestampSelection(groupId, timestamp);
    });

    ul.append(entryWrapper);
  });
};

//////////////////////////////////////////////////////
// Controller Entry Point
//////////////////////////////////////////////////////

const renderApp = async () => {
  // testDataAccessInterface();

  const state = await Model.init();

  const { root, list, inputField, manualTimestampInput } = createAppView(
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
