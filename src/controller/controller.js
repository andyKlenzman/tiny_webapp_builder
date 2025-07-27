import { Model, MODEL_EVENTS } from "../model/Model";
import { createInputElement, createGroupList, createGroup } from "../view/view";
//////////////////////////////////////////////////////
// Model Handlers
//////////////////////////////////////////////////////
const handleModelEventAddGroup = ({ payload }) => {
  console.log("handleModelEventAddGroup: payload: ", payload);
  let newGroup = createGroup();
  payload.groupList.el.append(newGroup.el);
};

//////////////////////////////////////////////////////
// UI Handlers
//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////
// Entry Point
//////////////////////////////////////////////////////
const renderApp = () => {
  const inputElement = createInputElement(); // View initialisieren
  const groupList = createGroupList();

  const handleInputButtonClick = createHandleInputButtonClick(
    inputElement.refs.inputField,
    groupList
  );

  inputElement.refs.inputField.addEventListener("input", handleInputFieldInput);
  inputElement.refs.inputButton.addEventListener(
    "click",
    handleInputButtonClick
  );

  Model.init();

  Model.subscribe(MODEL_EVENTS.ADD_GROUP, handleModelEventAddGroup);

  document.body.append(inputElement.el, groupList.el);
};

export default renderApp;
