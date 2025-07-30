//////////////////////////////////////////////////////
// View
//////////////////////////////////////////////////////
//todo: createAppView()
//////////////////////////////////////////////////////
// Atoms
//////////////////////////////////////////////////////
export const createButtonElement = (textContent) => {
  let button = document.createElement("button");
  button.textContent = textContent;

  return button;
};

export const createGroupList = () => {
  let groupList = document.createElement("ul");

  return groupList;
};

export const createGroupEntry = (timestamp, onCheckboxToggle) => {
  let entryWrapper = document.createElement("li");
  entryWrapper.className = "flex-row";
  entryWrapper.dataset.id = timestamp;

  let entryText = document.createElement("p");
  entryText.textContent = timestamp;

  let entryCheckbox = document.createElement("input");
  entryCheckbox.type = "checkbox";
  entryCheckbox.addEventListener("change", () => onCheckboxToggle());

  entryWrapper.append(entryCheckbox, entryText);

  return { entryWrapper, entryText, entryCheckbox };
};
//////////////////////////////////////////////////////
// Compounds
//////////////////////////////////////////////////////

export const createInputElements = () => {
  let inputWrapper = document.createElement("div");
  inputWrapper.className = "flex-row";

  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "group name";

  let inputButton = createButtonElement("enter");

  inputWrapper.append(inputField, inputButton);

  return { inputWrapper, inputField, inputButton };
};

export const createGroupElements = (id, name, onCheckboxToggle) => {
  let groupWrapper = document.createElement("div");
  groupWrapper.id = id;

  let groupHeaderWrapper = document.createElement("div");
  groupHeaderWrapper.classList.add("flex-row");

  let groupCheckbox = document.createElement("input");
  groupCheckbox.type = "checkbox";
  groupCheckbox.addEventListener("change", () => onCheckboxToggle(id));

  let groupName = document.createElement("h2");
  groupName.textContent = name;

  groupHeaderWrapper.append(groupCheckbox, groupName);

  let groupEntries = document.createElement("ul");

  groupWrapper.append(groupHeaderWrapper, groupEntries);

  // TODO: delete or refactor
  // const addEntry = () => {
  //   let groupEntry = document.createElement("li");
  //   groupEntry.textContent = "test";
  //   groupEntries.append(groupEntry);
  // };

  return { groupWrapper, groupName, groupCheckbox, groupEntries };
};
