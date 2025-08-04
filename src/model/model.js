import { DB } from "./dataAccess/dataAccessInterface";

export const COLLECTIONS = {
  GROUPS: "groups",
};

export const VIEW_MODES = {
  STREAKS: "Streaks",
  EDIT_TIMESTAMPS: "Edit Timestamps",
};

export const STATUS = {
  IDLE: "Idle",
  LOADING: "Loading",
  ERROR: "Error",
  CONNECTED: "Connected",
  DISCONNECTED: "Disconnected",
};

//////////////////////////////////////////////////////
// State & View State
//////////////////////////////////////////////////////
const state = {
  groups: {},
  selectedGroups: [],
  selectedTimestamps: {},
};

let currentView = VIEW_MODES.STREAKS;

//////////////////////////////////////////////////////
// Helpers
//////////////////////////////////////////////////////
// TODO: Do I need this?? Prob wheen firebase gets involeved
const syncGroups = async () => {
  state.groups = await DB.getAll(COLLECTIONS.GROUPS);
  return JSON.parse(JSON.stringify({ ...state, currentView }));
};

//////////////////////////////////////////////////////
// App Status
//////////////////////////////////////////////////////

let appStatus = STATUS.IDLE; 

const statusState = {
  setStatus: (status) => {
    appStatus = status;
    console.log("Status updated:", appStatus);
  },
  getStatus: () => appStatus,
};


//////////////////////////////////////////////////////
// ViewState
//////////////////////////////////////////////////////

const viewState = {
  changeCurrentView: (newMode) => {
    currentView = newMode;
    return currentView;
  },
  getCurrentView: () => currentView,
};

//////////////////////////////////////////////////////
// Group Logic
//////////////////////////////////////////////////////

const groupStore = {
  async addGroup(groupName) {
    const group = { groupName, timestamps: [] };
    const { id } = await DB.add(COLLECTIONS.GROUPS, group);
    state.groups[id] = group;
    return id;
  },

  async deleteSelectedGroups() {
    for (const id of state.selectedGroups) {
      await DB.deleteById(COLLECTIONS.GROUPS, id);
      delete state.groups[id];
    }
    state.selectedGroups = [];
    return await syncGroups();
  },

  toggleGroupSelection(groupId) {
    const index = state.selectedGroups.indexOf(groupId);
    if (index === -1) {
      state.selectedGroups.push(groupId);
    } else {
      state.selectedGroups.splice(index, 1);
    }
  },
};

//////////////////////////////////////////////////////
// Timestamp Logic
//////////////////////////////////////////////////////

const timestampStore = {
  async addTimestampToSelectedGroups(timestamp = new Date().toISOString()) {
    let updatedGroups = [];

    for (const id of state.selectedGroups) {
      let doc = await DB.getById(COLLECTIONS.GROUPS, id);
      doc.timestamps.push(timestamp);
      await DB.update(COLLECTIONS.GROUPS, id, doc);
      updatedGroups.push({ id, timestamps: [...doc.timestamps] });
    }

    return { timestamp, updatedGroups };
  },

  async deleteSelectedTimestamps() {
    for (const groupId in state.selectedTimestamps) {
      if (!state.groups[groupId]) continue;
      if (!state.selectedTimestamps[groupId]?.length) continue;

      let doc = await DB.getById(COLLECTIONS.GROUPS, groupId);
      doc.timestamps = doc.timestamps.filter(
        (ts) => !state.selectedTimestamps[groupId].includes(ts)
      );
      await DB.update(COLLECTIONS.GROUPS, groupId, doc);
    }

    state.selectedTimestamps = {};
    return await syncGroups();
  },

  toggleTimestampSelection(groupId, timestamp) {
    if (!state.selectedTimestamps[groupId]) {
      state.selectedTimestamps[groupId] = [];
    }

    const index = state.selectedTimestamps[groupId].indexOf(timestamp);
    if (index === -1) {
      state.selectedTimestamps[groupId].push(timestamp);
    } else {
      state.selectedTimestamps[groupId].splice(index, 1);
    }
  },
};

//////////////////////////////////////////////////////
// Model Entry Point
//////////////////////////////////////////////////////

export const Model = {
  init: () => syncGroups(),

  getState: () => syncGroups(),

  getCurrentView: viewState.getCurrentView,
  changeCurrentView: viewState.changeCurrentView,

  addGroup: groupStore.addGroup,
  deleteSelectedGroups: groupStore.deleteSelectedGroups,
  toggleGroupSelection: groupStore.toggleGroupSelection,

  addTimestampToSelectedGroups: timestampStore.addTimestampToSelectedGroups,
  deleteSelectedTimestamps: timestampStore.deleteSelectedTimestamps,
  toggleTimestampSelection: timestampStore.toggleTimestampSelection,

  getAppStatus: statusState.getStatus,
  setAppStatus: statusState.setStatus,

  
  state,
};
