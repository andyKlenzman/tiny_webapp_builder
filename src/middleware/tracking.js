// it can be that this app is so simple, the middleware actuallydoes not need to exist and app can live on the top level.

// import {server} to do add layer

const viewModes = ["streak", "itemList", "editListItems"];
let currentViewMode = "streak";

/*/ ///////////////////////////////////////////////////
// Internal utils 
////////////////////////////////////////////////////*/
const setViewMode = (data, mode) => {
  // Sets the state globally, so new groups are aware of how they should set their classes
  currentViewMode = mode;

  const streakEl = data.querySelectorAll('[data-type="streak"]');
  const itemListEl = data.querySelectorAll('[data-type="itemList"]');

  switch (mode) {
    case "streak":
      console.log("viewSelection: streak");

      streakEl.forEach((el) => {
        el.classList.remove("hidden");
      });

      itemListEl.forEach((el) => {
        el.classList.add("hidden");
      });

      break;

    case "itemList":
      console.log("viewSelection: itemList");

      streakEl.forEach((el) => {
        el.classList.add("hidden");
      });

      itemListEl.forEach((el) => {
        el.classList.remove("hidden");
      });
  }
};

/*/ ///////////////////////////////////////////////////
// Internal component creation  
////////////////////////////////////////////////////*/

const createManualTimestampInput = () => {
  let manualTimestamp = "";

  const manualTimeWrapper = document.createElement("div");
  manualTimeWrapper.classList.add("flex-row");

  const manualTimeButton = document.createElement("button");
  manualTimeButton.textContent = "enter";

  manualTimeButton.addEventListener("click", () => {
    console.log("runTracking: manualTimeButton: press");

    selectedGroups.forEach((groupName) => {
      const matchingElements = document.querySelectorAll(`[id="${groupName}"]`);

      matchingElements.forEach((el) => {
        let listElement = el.querySelector("ul");

        if (listElement === null || manualTimestamp === "") return;

        let listItem = document.createElement("li");
        listItem.textContent = manualTimestamp;

        listElement.appendChild(listItem);
      });
    });
  });

  const manualTimeInput = document.createElement("input");

  manualTimeInput.type = "datetime-local";
  manualTimeInput.addEventListener("input", (e) => {
    const localValue = manualTimeInput.value;
    if (!localValue) return;

    const localDate = new Date(localValue);

    manualTimestamp = localDate.toISOString(); // z. B. "2025-07-26T16:30:00.000Z"
  });

  manualTimeWrapper.append(manualTimeInput, manualTimeButton);

  return manualTimeWrapper;
};

const createGroupComponent = ({ groupName }) => {
  const groupWrapper = document.createElement("div");
  groupWrapper.dataset.type = "group";
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
  groupStreak.dataset.type = "streak";
  groupStreak.textContent = "Streak: 1";

  const groupList = document.createElement("ul");
  groupList.dataset.type = "itemList";

  groupWrapper.appendChild(groupHeading);
  groupWrapper.appendChild(groupStreak);
  groupWrapper.appendChild(groupList);

  setViewMode(groupWrapper, currentViewMode);

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

const createViewSelectDropdown = () => {
  const dropdown = document.createElement("select");

  viewModes.forEach((mode) => {
    const option = document.createElement("option");
    option.textContent = mode;
    option.value = mode;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", (e) => {
    setViewMode(document, e.target.value);
  });

  return dropdown;
};

const createGroupInputComponent = () => {
  let groupName = "";

  let inputWrapper = document.createElement("div");
  let groupList = document.createElement("div");
  // Input field
  const inputHeaderWrapper = document.createElement("div");
  inputHeaderWrapper.className = "flex-row";

  const inputField = document.createElement("input");

  inputField.type = "text";
  inputField.placeholder = "group name";

  inputField.addEventListener("input", (e) => {
    groupName = e.target.value;
  });

  const createButton = document.createElement("button");
  createButton.textContent = "create";

  createButton.addEventListener("click", () => {
    console.log("runTracking: button press");
    if (inputField.value === "") return;

    groupName = inputField.value;

    const newGroup = createGroupComponent({ groupName });

    groupList.append(newGroup);
    groupName = "";
    inputField.value = "";
  });

  inputHeaderWrapper.append(inputField, createButton);
  inputWrapper.append(inputHeaderWrapper, groupList);

  return inputWrapper;
};

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
let selectedGroups = [];

export const runTracking = () => {
  const groupInputComponent = createGroupInputComponent();

  const viewSelectDropdown = createViewSelectDropdown();

  const timestampButton = createTimestampButton();
  const deleteButton = createDeleteGroupButton();
  const manualTimestampField = createManualTimestampInput();

  document.body.append(groupInputComponent, viewSelectDropdown);
  document.body.append(timestampButton, deleteButton, manualTimestampField);
};
