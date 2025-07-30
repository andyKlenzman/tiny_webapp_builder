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
    selectedTimestamps: {}, //TODO: this is a dumb thing
  },

  async init() {
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
    this.state.selectedGroups = []; // TODO: evaluate nme
    return await this.getState();
  },

  async addTimestampToGroup() {
    const timestamp = new Date().toISOString();
    const updatedGroups = [];

    for (const id of this.state.selectedGroups) {
      let doc = await DB.getById(COLLECTIONS.GROUPS, id);
      doc.timestamps.push(timestamp);
      await DB.update(COLLECTIONS.GROUPS, id, doc);
      updatedGroups.push({ id, timestamps: [...doc.timestamps] });
    }

    return { timestamp, updatedGroups };
  },

  async deleteSelectedTimestamps() {
    const selected = this.state.selectedTimestamps;
    const updatedGroups = [];

    for (const groupId in selected) {
      if (!selected[groupId] || !selected[groupId].length) continue;
      let doc = await DB.getById(COLLECTIONS.GROUPS, groupId);
      doc.timestamps = doc.timestamps.filter(
        (ts) => !selected[groupId].includes(ts)
      );
      await DB.update(COLLECTIONS.GROUPS, groupId, doc);
      updatedGroups.push({ id: groupId, timestamps: [...doc.timestamps] });
    }

    this.state.selectedTimestamps = {};
    return updatedGroups;
  },

  toggleGroupSelection(id) {
    console.log("toggleGroupSelection: SelectedIdd: ", id);
    const idx = this.state.selectedGroups.indexOf(id);
    if (idx === -1) {
      this.state.selectedGroups.push(id);
    } else {
      this.state.selectedGroups.splice(idx, 1);
    }

    console.log("toggleGroupSelection: selected: ", this.state.selectedGroups);
  },

  toggleTimestampSelection(groupId, timestamp) {
    console.log("toggleTimestampSelection: ", groupId, timestamp);

    // Ensure selectedTimestamps is an object
    if (
      typeof this.state.selectedTimestamps !== "object" ||
      Array.isArray(this.state.selectedTimestamps)
    ) {
      this.state.selectedTimestamps = {};
    }

    if (!this.state.selectedTimestamps[groupId]) {
      this.state.selectedTimestamps[groupId] = [];
    }

    const idx = this.state.selectedTimestamps[groupId].indexOf(timestamp);
    if (idx === -1) {
      this.state.selectedTimestamps[groupId].push(timestamp);
    } else {
      this.state.selectedTimestamps[groupId].splice(idx, 1);
      if (this.state.selectedTimestamps[groupId].length === 0) {
        delete this.state.selectedTimestamps[groupId];
      }
    }

    console.log(
      "toggleTimestampSelection: selected: ",
      this.state.selectedTimestamps
    );
  },

  // get rid of selected items from app
};
