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
    this.state.selectedGroups = []; // TODO: evaluate nme
    return await this.getState();
  },

  async addTimestampToGroup() {
    const timestamp = new Date().toISOString();

    this.state.selectedGroups.forEach(async (id) => {
      let doc = await DB.getById(COLLECTIONS.GROUPS, id);
      console.log("addTimestampToGroup: doc:", doc);

      doc.timestamps.push(timestamp);

      console.log("addTimestampToGroup: doc:", doc);

      await DB.update(COLLECTIONS.GROUPS, id, doc);
    });

    return timestamp;
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

    if (!this.state.selectedTimestamps[groupId])
      this.state.selectedTimestamps[groupId] = [];

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

  // get rid of selected items from app
};
