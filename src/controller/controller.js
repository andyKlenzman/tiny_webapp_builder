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
const DAY_MS = 24 * 60 * 60 * 1000;
/**
 *
 */
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

function getStartOfDayMsForTimestamp(isoString) {
  // Timestamp in Date-Objekt umwandeln
  const date = new Date(isoString);

  const startOfDayLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return startOfDayLocal.getTime();
}

const existsBetween = (values, a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return values.some((v) => v > lower && v < upper);
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

// input millisecond date value
// output - current streak, total completions in time interval, and number of intervals
// TODO: sollte ich es mehr entkoellt machen?
const runIntervalMapAnalysis = (msDateArray) => {
  const lower = Math.min(...msDateArray);
  const upper = Math.max(...msDateArray);

  console.log("lower:", lower, "upper:", upper);

  const intervalMap = getIntervalMap(lower, upper, DAY_MS);
  console.log("intervalMap :", intervalMap);

  let currentStreak = 0;
  let largestStreak = 0;
  let totalCompletions = 0;
  let totalIntervals = intervalMap.length; // TODO: check me

  for (let i = 0; i < msDateArray.length - 1; i++) {
    let result = existsBetween(msDateArray, intervalMap[i], intervalMap[i + 1]);
    console.log("testTime: ", result);
    if (result) {
      currentStreak++;
      totalCompletions++;
    } else {
      largestStreak = currentStreak;
      currentStreak = 0;
    }
  }

  if (largestStreak === 0) {
    largestStreak = currentStreak;
  }

  return { currentStreak, largestStreak, totalCompletions, totalIntervals };
};

const testTimeAnalyzers = () => {
  const testISO = getTestData();
  console.log("testTime: ", testISO, testISO.length);

  const testMs = testISO.map((iso) => Date.parse(iso));
  console.log("testTime: ", testMs, testMs.length);

  const { currentStreak, totalCompletions, totalIntervals } =
    runIntervalMapAnalysis(testMs);
  console.log("results:", { currentStreak, totalCompletions, totalIntervals });
};
