import { DB } from "./dataAccess/dataAccessInterface";

//////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////

export const MODEL_EVENTS = {
  UPDATE: "model:update",
  ADD_GROUP: "model:addGroup",
  SELECT_GROUP: "model:selectGroup",
  DELETE_GROUP: "model:deleteGroup",
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
      payload: { id, group_name, groupList },
    });
  },

  deleteSelectedGroups() {
    if (!this.appState.selectedGroups || !this.appState.groups) return;
    this.appState.selectedGroups.forEach((id) => {
      delete this.appState.groups[id];
    });
    this.appState.selectedGroups = [];
    this.emit(MODEL_EVENTS.DELETE_GROUP, { ids: this.getState().selectedGroups });
  },

  selectGroup(id) {
    if (!this.appState.selectedGroups) this.appState.selectedGroups = [];
    const index = this.appState.selectedGroups.indexOf(id);

    // If the item does not exist, indexOf returns -1
    if (index == -1) {
      this.appState.selectedGroups.push(id);
    } else {
      this.appState.selectedGroups.splice(index, 1);
    }
    console.log(this.appState.selectedGroups);
    this.emit(MODEL_EVENTS.SELECT_GROUP, {});
  },
};
