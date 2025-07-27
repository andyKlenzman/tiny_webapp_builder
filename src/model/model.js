import { DB } from "./dataAccess/dataAccessInterface";

//////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////

export const MODEL_EVENTS = {
  UPDATE: "model:update",
  ADD_GROUP: "model:addGroup",
};

// export const GROUP_EVENTS = {
//   ADD_GROUP: "group:addGroup",
// };

export const COLLECTIONS = {
  GROUPS: "groups",
};

//////////////////////////////////////////////////////
// Model
//////////////////////////////////////////////////////

export const Model = {
  events: {},

  appState: {},
  // TODO: bin mir nicht sicher ob ich event spezielle abos einbauen sollte.
  // weil es meheere handlers aufm renderApp() funktion zwingt.

  subscribe(event, handler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  },

  emit(event, payload) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler(payload));
    }
  },

  async init() {
    this.appState.groups = await DB.getAll(COLLECTIONS.GROUPS);
    this.emit(MODEL_EVENTS.UPDATE, this.getState());
  },

  getState() {
    return JSON.parse(JSON.stringify(this.appState));
  },

  addGroup(group_name, groupList) {
    const id = Date.now().toString();
    this.appState.groups[id] = { group_name, timestamps: [] };
    this.emit(MODEL_EVENTS.ADD_GROUP, {
      payload: { group_name, groupList },
    });
  },

  selectGroup(id) {
    if (!this.appState.selectedGroups) this.appState.selectedGroups = [];
    this.appState.selectedGroups.push(id);
  },
};
