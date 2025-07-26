// it can be that this app is so simple, the middleware actuallydoes not need to exist and app can live on the top level.

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

const createGroupComponent = ({ groupName }) => {
  const groupWrapper = document.createElement("div");
  groupWrapper.id = groupName;

  const groupHeading = document.createElement("div");
  groupHeading.className = "flex-row";

  const groupTitle = document.createElement("h2");
  groupTitle.textContent = groupName;

  const groupCheckbox = document.createElement("input");
  groupCheckbox.type = "checkbox";
  groupCheckbox.id = groupName; // TODO: gibt es ein besser weg es zu machen?

  groupCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      if (!selectedGroups.includes(groupName)) {
        selectedGroups.push(groupName);
      }
    } else {
      selectedGroups = selectedGroups.filter((name) => name !== groupName);
    }
    console.log(selectedGroups);
  });

  groupHeading.appendChild(groupCheckbox);
  groupHeading.appendChild(groupTitle);

  // TODO: irgendwie mach das erweitbar, also ich es wiklich viel sachen hinzufugen kann
  const groupStreak = document.createElement("p");
  groupStreak.textContent = "Streak: 1";

  const groupList = document.createElement("ul");

  groupWrapper.appendChild(groupHeading);
  groupWrapper.appendChild(groupStreak);
  groupWrapper.appendChild(groupList);

  return groupWrapper;
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
        listItem.textContent = new Date().toISOString();

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
  // input field
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "flex-row";
  const inputField = createInputFieldComponent({
    placeholder: "Enter group name",
  });

  const createButton = document.createElement("button");
  createButton.textContent = "create";

  const groupList = document.createElement("div");

  createButton.addEventListener("click", () => {
    console.log("runTracking: button press");

    if (inputField.value === "") return;

    const groupName = inputField.value;

    const newGroup = createGroupComponent({ groupName });

    groupList.appendChild(newGroup);
    inputField.value = "";
  });

  // editing of the groups

  const timestampButton = createTimestampButton();
  const deleteButton = createDeleteGroupButton();

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(createButton);
  document.body.appendChild(inputWrapper);

  document.body.appendChild(groupList);

  document.body.appendChild(timestampButton);
  document.body.appendChild(deleteButton);
};
