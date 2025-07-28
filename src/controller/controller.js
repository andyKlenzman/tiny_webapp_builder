import { Model, MODEL_EVENTS } from "../model/Model";
import {
  createInputElement,
  createGroupList,
  createGroup,
  createButtonElement,
} from "../view/view";
//////////////////////////////////////////////////////
// Model Handlers
//////////////////////////////////////////////////////
const handleModelEventAddGroup = ({ payload }) => {
  console.log("handleModelEventAddGroup: payload: ", payload);
  let newGroup = createGroup();
  newGroup.el.id = payload.id;

  newGroup.refs.groupCheckbox.addEventListener("change", (e) => {
    Model.selectGroup(payload.id);
  });

  payload.groupList.el.append(newGroup.el);
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
    const input = inputField.value.trim();
    if (input === "") return;

    console.log("handleInputButtonEvent: data: ", input);

    Model.addGroup(input, groupList);

    inputField.value = "";
  };
};

const createHandleModelEventDeleteGroup = (groupList) => {
  return ({ids}) => {
    console.log("handleModelEventDeleteGroup: ");

    ids.forEach((id) => {
      const groupEl = groupList.el.querySelector(`div[id="${id}"]`);
      if (groupEl) {
        groupEl.remove();
      }
    });
  };
};

//////////////////////////////////////////////////////
// Entry Point
//////////////////////////////////////////////////////
const renderApp = () => {
  const inputElement = createInputElement(); // View initialisieren
  const groupList = createGroupList();

  const handleModelEventDeleteGroup =
    createHandleModelEventDeleteGroup(groupList);
  const handleInputButtonClick = createHandleInputButtonClick(
    inputElement.refs.inputField,
    groupList
  );

  inputElement.refs.inputField.addEventListener("input", handleInputFieldInput);
  inputElement.refs.inputButton.addEventListener(
    "click",
    handleInputButtonClick
  );

  const deleteButton = createButtonElement("delete");
  deleteButton.el.addEventListener("click", handleDeleteButtonClick);

  Model.init();

  Model.subscribe(MODEL_EVENTS.ADD_GROUP, handleModelEventAddGroup);
  Model.subscribe(MODEL_EVENTS.DELETE_GROUP, handleModelEventDeleteGroup);

  document.body.append(inputElement.el, groupList.el, deleteButton.el);
};

export default renderApp;
