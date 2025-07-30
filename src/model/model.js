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
    groups: {}, // TODO: Consider making this an array??
    selectedGroups: [],
    selectedTimestamps: [],
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
    this.state.selectedGroups = [];
    return await this.getState();
  },

  async addTimestampToGroup() {
    const timestamp = new Date().toISOString();
    let updatedGroups = [];

    for (const id of this.state.selectedGroups) {
      let doc = await DB.getById(COLLECTIONS.GROUPS, id);
      doc.timestamps.push(timestamp);

      // TODO: uberlegen ob ein update and return funktion wurde wiederverwendbarkeit erhoehern
      await DB.update(COLLECTIONS.GROUPS, id, doc);
      updatedGroups.push({ id, timestamps: [...doc.timestamps] });
    }

    return { timestamp, updatedGroups };
  },

  async deleteSelectedTimestamps() {
    console.log(this.state.selectedTimestamps);
    const selected = this.state.selectedTimestamps;

    for (const groupId in selected) {
      // Sanity check: skip if groupId does not exist in current groups
      if (!this.state.groups[groupId]) continue;

      // Check that there are timestamps selected for the currently iterated group
      if (!selected[groupId] || !selected[groupId].length) continue;
      let doc = await DB.getById(COLLECTIONS.GROUPS, groupId);

      console.log("deleteSelectedTimestamps: before", doc);
      doc.timestamps = doc.timestamps.filter(
        (ts) => !selected[groupId].includes(ts)
      );

      await DB.update(COLLECTIONS.GROUPS, groupId, doc);

      console.log("deleteSelectedTimestamps: after", doc);
    }

    this.state.selectedTimestamps = {}; // Reset to empty object
    return await this.getState();
  },

  toggleGroupSelection(groupId) {
    console.log("toggleGroupSelection: SelectedIdd: ", groupId);
    const idx = this.state.selectedGroups.indexOf(groupId);
    if (idx === -1) {
      this.state.selectedGroups.push(groupId);
    } else {
      this.state.selectedGroups.splice(idx, 1);
    }

    console.log("toggleGroupSelection: selected: ", this.state.selectedGroups);
  },
  toggleTimestampSelection(groupId, timestamp) {
    if (!this.state.selectedTimestamps[groupId]) {
      this.state.selectedTimestamps[groupId] = [];
    }

    const idx = this.state.selectedTimestamps[groupId].indexOf(timestamp);

    if (idx === -1) {
      this.state.selectedTimestamps[groupId].push(timestamp);
    } else {
      this.state.selectedTimestamps[groupId].splice(idx, 1);
    }

    console.log(
      "toggleTimestampSelection: selected: ",
      this.state.selectedTimestamps
    );
  },
};
