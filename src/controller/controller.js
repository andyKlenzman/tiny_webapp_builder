import { Model } from "../model/model";
import {
  createInputElements,
  createGroupElements,
  createGroupEntry,
} from "../view/view";

//////////////////////////////////////////////////////
// Controller
//////////////////////////////////////////////////////
const renderApp = async () => {
  const state = await Model.init();
  console.log("renderApp: initialState:", state.groups);

  // TODO: move inititial state into render  app view
  const { inputWrapper, inputField, inputButton } = createInputElements();
  const list = document.createElement("div");

  const addTimestampButton = document.createElement("button");
  addTimestampButton.textContent = "addTimestamp";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";

  // Append initial groups
  for (const [id, group] of Object.entries(state.groups)) {
    const { groupWrapper, groupEntries } = createGroupElements(
      id,
      group.groupName,
      (id) => Model.toggleGroupSelection(id)
    );
    group.timestamps.forEach((timestamp) => {
      const { entryWrapper } = createGroupEntry(timestamp, () => {
        Model.toggleTimestampSelection(id, timestamp);
      });
      groupEntries.append(entryWrapper);
    });
    list.append(groupWrapper);
  }

  // Add Group Handler
  inputButton.addEventListener("click", async () => {
    const groupName = inputField.value.trim();
    console.log("inputButtonClick: ", groupName);
    if (!groupName) return;

    const id = await Model.addGroup(groupName);
    const { groupWrapper } = createGroupElements(id, groupName, (id) =>
      Model.toggleGroupSelection(id)
    );
    list.append(groupWrapper);
    inputField.value = "";
  });

  // Timestamp handler
  addTimestampButton.addEventListener("click", async () => {
    const { timestamp, updatedGroups } = await Model.addTimestampToGroup();

    updatedGroups.forEach(({ id }) => {
      const groupComponent = list.querySelector(`[id="${id}"]`);
      if (groupComponent) {
        const { entryWrapper } = createGroupEntry(timestamp, () => {
          Model.toggleTimestampSelection(id, timestamp);
        });

        const groupEntries = groupComponent.querySelector("ul");
        if (groupEntries) groupEntries.append(entryWrapper);
      }
    });
  });

  // Delete Handler
  deleteButton.addEventListener("click", async () => {
    await Model.deleteSelectedGroups();
    console.log("deleteButtonClick: deleteSelectedGroups:");

    const state = await Model.deleteSelectedTimestamps();
    console.log("deleteButtonClick: deleteSelectedTimestamps:", state);

    // TODO: kapseln mich in einen Funktion ein
    let newGroups = [];
    for (const [id, group] of Object.entries(state.groups)) {
      const { groupWrapper, groupEntries } = createGroupElements(
        id,
        group.groupName,
        (id) => Model.toggleGroupSelection(id)
      );
      group.timestamps.forEach((timestamp) => {
        const { entryWrapper } = createGroupEntry(timestamp, () => {
          Model.toggleTimestampSelection(id, timestamp);
        });
        groupEntries.append(entryWrapper);
      });
      // Remove all existing group elements before re-rendering
      list.append(groupWrapper);
      newGroups.push(groupWrapper);
    }

    list.innerHTML = "";
    newGroups.forEach(group => {

      list.append(group)
    })
  });

  document.body.append(inputWrapper, list, deleteButton, addTimestampButton);
};
export default renderApp;
