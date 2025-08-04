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
  if (!allowedViewModes.includes(Model.state.currentView)) {
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
  const { groupWrapper, groupEntries } = createGroupElements(
    id,
    group.groupName,
    () => Model.toggleGroupSelection(id)
  );

  applyViewMode(groupEntries, [VIEW_MODES.EDIT_TIMESTAMPS]);

  group.timestamps.forEach((timestamp) => {
    const { entryWrapper } = createGroupEntry(timestamp, () => {
      Model.toggleTimestampSelection(id, timestamp);
    });
    groupEntries.append(entryWrapper);
  });

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
  testTimeAnalyzers();

  const state = await Model.init();
  console.log("renderApp: initialState:", state.groups);

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

//////////////////////////////////////////////////////
// Timerstamp Ana;zer
//////////////////////////////////////////////////////

// TODO: herausfinden auf wlechem schichte dies Ding leben sollte

const ANALYZE_MODES = {
  STREAKS: "streaks",
};

// returns a lowest to highest list of locations of the time interval inside of two time values the number and time interval locations of
const getIntervalMap = (valueA, valueB, interval) => {
  let currentInterval;
  let endTime;

  if (valueA < valueB) {
    currentInterval = valueA;
    endTime = valueB;
  } else {
    currentInterval = valueB;
    endTime = valueA;
  }

  let timeMap = [];

  while (endTime >= currentInterval) {
    timeMap.push(currentInterval);
    currentInterval = currentInterval + interval;
  }

  return timeMap;
};

// returns a list of ms values based on ISO data
const getMillisecondFromISO = (ISOs) => {
  return ISOs.map((iso) => Date.parse(iso));
};

const getTestData = () => {
  let testISO = [];
  // Generate 10 random ISO timestamps within the last 10 days
  const now = Date.now();
  const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;
  for (let i = 0; i < 10; i++) {
    const randomTime = tenDaysAgo + Math.random() * (now - tenDaysAgo);
    testISO.push(new Date(randomTime).toISOString());
  }

  return testISO;
};

const existsBetween = (values, a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return values.some((v) => v > lower && v < upper);
};

const DAY_MS = 24 * 60 * 60 * 1000;
const testTimeAnalyzers = () => {
  const testISO = getTestData();
  console.log("testTime: ", testISO, testISO.length);

  const testMs = getMillisecondFromISO(testISO);
  console.log("testTime: ", testMs, testMs.length);

  const minValue = Math.min(...testMs);
  const maxValue = Math.max(...testMs);

  console.log("Min:", minValue, "Max:", maxValue);

  const intervalMap = getIntervalMap(maxValue, minValue, DAY_MS);

  for (let i = 0; i < testMs.length - 1; i++) {
    let result = existsBetween(testMs, intervalMap[i], intervalMap[i + 1]);
    console.log("testTime: ", result);
  }

  let timeA_ms = new Date().getTime();
  let timeB_ms = new Date().setHours(24, 0, 0, 0);
  timeB_ms = new Date(timeB_ms).getTime();
};
