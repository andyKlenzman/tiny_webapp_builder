import { Model } from "../model/Model";
import {
  createInputElements,
  createGroupList,
  createGroupElements,
  createButtonElement,
} from "../view/view";
//////////////////////////////////////////////////////
// Model Handlers
//////////////////////////////////////////////////////
const handleModelEventAddGroup = ({ payload }) => {
  console.log("handleModelEventAddGroup: payload: ", payload);
  let newGroup = createGroupElements(id);

  newGroup.groupCheckbox.addEventListener("change", (e) => {
    Model.selectGroup(payload.id);
  });

  payload.groupList.append(newGroup.el);
};

const handleDeleteButtonClick = (e) => {
  console.log("handleDeleteButtonClick: ");
  Model.deleteSelectedGroups();

  // interact with the model
};

const handleInputFieldInput = (e) => {
  console.log("handleInputFieldEvent: input");

  // interact with the model
};

//////////////////////////////////////////////////////
// Create UI Handlers
//////////////////////////////////////////////////////
const createHandleInputButtonClick = (inputField, groupList) => {
  return () => {
    const groupName = inputField.value.trim();
    if (groupName === "") return;

    console.log("handleInputButtonEvent: data: ", groupName);

    Model.addGroup(groupName, groupList);

    inputField.value = "";
  };
};

const createHandleModelEventDeleteGroup = (groupList) => {
  return ({ ids }) => {
    console.log("handleModelEventDeleteGroup: ");

    ids.forEach((id) => {
      const groupEl = groupList.el.querySelector(`div[id="${id}"]`);
      if (groupEl) {
        groupEl.remove();
      }
    });
  };
};

const createHandleModelEventAddGroup = (groupList) => {
  return (newGroupData) => {
    console.log("handleModelEventAddGroup: id: ", newGroupData);
    console.log("handleModelEventAddGroup: id: ", [newGroupData]);

    let newGroup = createGroup();
    newGroup.el.id = newGroupData;
    newGroup.refs.groupName.textContent = id.groupName;

    newGroup.refs.groupCheckbox.addEventListener("change", (e) => {
      Model.selectGroup(payload.id);
    });

    groupList.el.append(newGroup.el);
  };
};

//////////////////////////////////////////////////////
// Entry Point
//////////////////////////////////////////////////////
const renderApp = async () => {
  const state = await Model.init();
  console.log("renderApp: initialState:", state.groups);

  const { inputWrapper, inputField, inputButton } = createInputElements();
  const list = document.createElement("div");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  // Append initial groups
  for (const [id, group] of Object.entries(state.groups)) {
    const { groupWrapper } = createGroupElements(id, group.groupName, (id) =>
      Model.toggleGroupSelection(id)
    );
    list.append(groupWrapper);
  }

  // Add Group Handler
  inputButton.addEventListener("click", async () => {
    const name = inputField.value.trim();
    console.log("inputButtonClick: ", name);
    if (!name) return;

    const id = await Model.addGroup(name);
    const { groupWrapper } = createGroupElements(id, name, (id) =>
      Model.toggleGroupSelection(id)
    );
    list.append(groupWrapper);
    inputField.value = "";
  });

  // Delete Handler
  deleteButton.addEventListener("click", async () => {
    const state = await Model.deleteSelectedGroups();
    console.log(state);
    Array.from(list.children).forEach((child) => {
      if (!state.groups[child.id]) {
        child.remove();
      }
    });
  });

  document.body.append(inputWrapper, list, deleteButton);
};
export default renderApp;
