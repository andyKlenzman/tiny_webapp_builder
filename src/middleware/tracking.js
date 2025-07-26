// it can be that this app is so simple, the middleware actuallydoes not need to exist and app can live on the top level.
import { createGroupComponent } from "../core/ui/atoms/uiAtoms";

// import {server} to do add layer

// Wie kann ich den Eingagefeld entleeren? aber den schichten beibehalten?
let groupName = "";

/*/ ///////////////////////////////////////////////////
// Internal APIs
////////////////////////////////////////////////////*/

const createInputFieldComponent = ({ placeholder, onInputCb }) => {
  const input = document.createElement("input");

  input.type = "text";
  input.placeholder = placeholder;

  input.addEventListener("input", (e) => {
    groupName = e.target.value;
  });

  return input;
};

const createTrackingGroupComponent = ({ groupName }) => {
  const trackingGroupWrapper = document.createElement("div");
  trackingGroupWrapper.className = "flex-row";
  trackingGroupWrapper.id = groupName;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = groupName;

  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      if (!selectedGroups.includes(groupName)) {
        selectedGroups.push(groupName);
      }
    } else {
      selectedGroups = selectedGroups.filter((name) => name !== groupName);
    }
    console.log(selectedGroups);
  });

  const newGroup = createGroupComponent({ title: groupName });

  trackingGroupWrapper.appendChild(checkbox);
  trackingGroupWrapper.appendChild(newGroup.element);

  return trackingGroupWrapper;
};

const createDeleteGroupButton = () => {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";

  deleteButton.addEventListener("click", () => {
    console.log("runTracking: delete button press");
    selectedGroups.forEach((groupName) => {
      const matchingElements = document.querySelectorAll(`[id="${groupName}"]`);

      matchingElements.forEach((el) => {
        el.remove();
      });
    });
  });

  return deleteButton;
};

const createTimestampButton = () => {
  const timestampButton = document.createElement("button");
  timestampButton.textContent = "timestamp";

  timestampButton.addEventListener("click", () => {
    console.log("runTracking: timestamp button press");

    selectedGroups.forEach((groupName) => {
      const matchingElements = document.querySelectorAll(`[id="${groupName}"]`);

      matchingElements.forEach((el) => {
        let listElement = el.querySelector("ul");
        console.log(listElement);

        if (listElement === null) return;

        let listItem = document.createElement("li");
        listItem.textContent = "test";

        listElement.appendChild(listItem);
      });
    });
  });

  return timestampButton;
};

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
let selectedGroups = [];

export const runTracking = () => {
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "flex-row"
  const inputField = createInputFieldComponent({
    placeholder: "Enter group name",
  });

  const createButton = document.createElement("button");
  createButton.textContent = "create";

  createButton.addEventListener("click", () => {
    console.log("runTracking: button press");

    if (inputField.value === "") return;

    const groupName = inputField.value;

    const newTrackingGroup = createTrackingGroupComponent({ groupName });

    document.body.appendChild(newTrackingGroup);

    inputField.value = "";
  });

  // editing of the groups

  const timestampButton = createTimestampButton();
  const deleteButton = createDeleteGroupButton();

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(createButton);
  document.body.appendChild(inputWrapper);
  document.body.appendChild(timestampButton);
  document.body.appendChild(deleteButton);
};
