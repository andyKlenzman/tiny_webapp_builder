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
      if (!groupArray.includes(groupName)) {
        groupArray.push(groupName);
      }
    } else {
      groupArray = groupArray.filter((name) => name !== groupName);
    }
    console.log(groupArray);
  });

  const newGroup = createGroupComponent({ title: groupName });

  trackingGroupWrapper.appendChild(checkbox);
  trackingGroupWrapper.appendChild(newGroup.element);

  return trackingGroupWrapper;
};

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
let groupArray = [];

export const runTracking = () => {
  const inputWrapper = document.createElement("div");

  const inputField = createInputFieldComponent({
    placeholder: "Enter group name",
  });

  const createButton = document.createElement("button");
  createButton.textContent = "Go";

  createButton.addEventListener("click", () => {
    console.log("runTracking: button press");

    if (inputField.value === "") {
      return;
    }

    const groupName = inputField.value;

    const newTrackingGroup = createTrackingGroupComponent({ groupName });

    document.body.appendChild(newTrackingGroup);

    inputField.value = "";
  });

  // editing of the groups

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";

  deleteButton.addEventListener("click", () => {
    console.log("runTracking: delete button press");
    groupArray.forEach((groupName) => {
      const matchingElements = document.querySelectorAll(`[id="${groupName}"]`);

      matchingElements.forEach((el) => {
        el.remove();
      });
    });
  });

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(createButton);
  document.body.appendChild(inputWrapper);
  document.body.appendChild(deleteButton);
};
