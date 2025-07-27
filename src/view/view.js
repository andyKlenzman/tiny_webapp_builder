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
export const createInputElement = () => {
  let inputWrapper = document.createElement("div");
  inputWrapper.className = "flex-row";

  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "group name";

  let inputButton = document.createElement("button");
  inputButton.textContent = "enter";

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

export const createGroup = () => {
  let groupWrapper = document.createElement("div");

  let groupName = document.createElement("h2");
  groupName.textContent = "test";

  let groupEntries = document.createElement("ul");

  groupWrapper.append(groupName, groupEntries);

  const addEntry = () => {
    let groupEntry = document.createElement("li");
    groupEntry.textContent = "test";
    groupEntries.append(groupEntry);
  };

  return { el: groupWrapper, refs: { groupName }, api: { addEntry } };
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
