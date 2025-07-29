import { DB } from "./dataAccess/dataAccessInterface";

//////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////
export const COLLECTIONS = {
  GROUPS: "groups",
};

//////////////////////////////////////////////////////
// Model
//////////////////////////////////////////////////////

export const Model = {
  state: {
    groups: {},
    selectedGroups: [],
  },
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
    this.state.groups = await DB.getAll(COLLECTIONS.GROUPS);
    return this.getState();
  },

  async getState() {
    this.state.groups = await DB.getAll(COLLECTIONS.GROUPS);
    return JSON.parse(JSON.stringify(this.state));
  },

  async addGroup(groupName) {
    console.log("addGroup: name: ", groupName);
    const group = { groupName, timestamps: [] };
    const { id } = await DB.add(COLLECTIONS.GROUPS, group);

    this.state.groups[id] = group;
    console.log("addGroup: state.groups:", this.state.groups);
    return id;
  },

  async deleteSelectedGroups() {
    this.state.selectedGroups.forEach(async (id) => {
      console.log(id);
      await DB.deleteById(COLLECTIONS.GROUPS, id);
      delete this.state.groups[id];
    });
    this.state.selectedGroups = [];
    return await this.getState();
  },

  toggleGroupSelection(id) {
    console.log("toggleGroupSelection: SelectedIdd: ",id)
    const idx = this.state.selectedGroups.indexOf(id);
    if (idx === -1) {
      this.state.selectedGroups.push(id);
    } else {
      this.state.selectedGroups.splice(idx, 1);
    }

    console.log("toggleGroupSelection: selected: ", this.state.selectedGroups);
  },
};
