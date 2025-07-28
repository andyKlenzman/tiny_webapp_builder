// is this an element or a component?

// el
// refs
// api

//////////////////////////////////////////////////////
// View
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// Create Elements
//////////////////////////////////////////////////////
export const createButtonElement = (textContent) => {
  let button = document.createElement("button");
  button.textContent = textContent;

  return {
    el: button,
  };
};

export const createInputElement = () => {
  let inputWrapper = document.createElement("div");
  inputWrapper.className = "flex-row";

  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "group name";

  let inputButton = createButtonElement("enter").el;

  inputWrapper.append(inputField, inputButton);

  return {
    el: inputWrapper,
    refs: { inputField, inputButton },
  };
};

export const createGroupList = () => {
  let groupList = document.createElement("ul");

  return { el: groupList };
};

export const createGroup = (id) => {
  let groupWrapper = document.createElement("div");


  let groupHeaderWrapper = document.createElement("div");
  groupHeaderWrapper.classList.add("flex-row");

  let groupCheckbox = document.createElement("input");
  groupCheckbox.type = "checkbox";

  let groupName = document.createElement("h2");
  groupName.textContent = "test";

  groupHeaderWrapper.append(groupCheckbox, groupName);

  let groupEntries = document.createElement("ul");

  groupWrapper.append(groupHeaderWrapper, groupEntries);

  const addEntry = () => {
    let groupEntry = document.createElement("li");
    groupEntry.textContent = "test";
    groupEntries.append(groupEntry);
  };

  return {
    el: groupWrapper,
    refs: { groupName, groupCheckbox },
    api: { addEntry },
  };
};

//////////////////////////////////////////////////////
// Public API - Create App View - Update App
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// Archive
//////////////////////////////////////////////////////

//TODO: implement me!
// const createView = () => {
//   let inputWrapper = document.createElement("div");
//   inputWrapper.className = "flex-row";

//   let inputField = document.createElement("input");
//   inputField.type = "text";
//   inputField.placeholder = "group name";

//   let inputButton = document.createElement("button");
//   createButton.textContent = "enter";

//   inputWrapper.append(inputField, createButton);

//   // returns a View Object with all of the possible components, very practical for the size of app id like to build
//   // can also beiinhalten umfassen uberspannen beiinhalten umfassen ubersoannen beinhalten, umfassen, uberspannen, beiinhalten,, umfassen, uberspannen, beiinhalten
//   return { wrapper, inputField, inputButton };
// };

// verorten innerhalb dem Element
// export function updateGroupList(groups) {
//   groupListContainer.innerHTML = "";
//   groups.forEach((name) => {
//     const el = document.createElement("p");
//     el.textContent = name;
//     groupListContainer.appendChild(el);
//   });
// }
