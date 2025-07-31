import { Model, VIEW_MODES } from "../model/model";
import {
  createInputElements,
  createGroupElements,
  createGroupEntry,
  createManualTimestampInput,
  createDropdown,
} from "../view/view";

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

const setViefdsawMode = (data, mode) => {
  // Sets the state globally, so new groups are aware of how they should set their classes
  currentViewMode = mode;

  const streakEl = data.querySelectorAll('[data-type="streak"]');
  const itemListEl = data.querySelectorAll('[data-type="itemList"]');

  const itemListCheckboxEl = data.querySelectorAll(
    '[data-type="itemListCheckbox"]'
  );

  resetSelection();

  switch (mode) {
    case "streak":
      console.log("viewSelection: streak");

      streakEl.forEach((el) => {
        el.classList.remove("hidden");
      });

      itemListEl.forEach((el) => {
        el.classList.add("hidden");
      });

      itemListCheckboxEl.forEach((el) => {
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

      itemListCheckboxEl.forEach((el) => {
        el.classList.add("hidden");
      });
      break;

    case "editListItems":
      console.log("viewSelection: itemList");

      streakEl.forEach((el) => {
        el.classList.add("hidden");
      });

      itemListEl.forEach((el) => {
        el.classList.remove("hidden");
      });

      itemListCheckboxEl.forEach((el) => {
        el.classList.remove("hidden");
      });
  }
};

//////////////////////////////////////////////////////
// Controller
//////////////////////////////////////////////////////
const renderApp = async () => {
  const state = await Model.init();
  console.log("renderApp: initialState:", state.groups);

  // TODO: Globalize me
  const dropdown = createDropdown(VIEW_MODES, (newMode) => {
    Model.changeCurrentView(newMode);
  });
  // TODO: move inititial state into render  app view
  const { inputWrapper, inputField, inputButton } = createInputElements();
  const list = document.createElement("div");

  const addTimestampButton = document.createElement("button");
  addTimestampButton.textContent = "addTimestamp";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";

  // Append initial groups
  for (const [id, group] of Object.entries(state.groups)) {
    // Good idea to create a global or accessible/ easi;ly parsable list of this?
    const { groupWrapper, groupEntries } = createGroupElements(
      id,
      group.groupName,
      (id) => Model.toggleGroupSelection(id)
    );
    group.timestamps.forEach((timestamp) => {
      // DRY Code!!! ich kann den Funktion hier einkapseln
      const { entryWrapper } = createGroupEntry(timestamp, () => {
        Model.toggleTimestampSelection(id, timestamp);
      });
      groupEntries.append(entryWrapper);
    });
    list.append(groupWrapper);
  }

  // Add Group Handler
  inputButton.addEventListener("click", async () => {
    const groupName = inputField.value.trim();
    console.log("inputButtonClick: ", groupName);
    if (!groupName) return;

    const id = await Model.addGroup(groupName);
    const { groupWrapper } = createGroupElements(id, groupName, (id) =>
      Model.toggleGroupSelection(id)
    );
    list.append(groupWrapper);
    inputField.value = "";
  });

  // Timestamp handler
  addTimestampButton.addEventListener("click", async () => {
    const { timestamp, updatedGroups } =
      await Model.addTimestampToSelectedGroups();

    updatedGroups.forEach(({ id }) => {
      const groupComponent = list.querySelector(`[id="${id}"]`);
      if (groupComponent) {
        const { entryWrapper } = createGroupEntry(timestamp, () => {
          Model.toggleTimestampSelection(id, timestamp);
        });

        const groupEntries = groupComponent.querySelector("ul");
        if (groupEntries) groupEntries.append(entryWrapper);
      }
    });
  });

  // Delete Handler
  deleteButton.addEventListener("click", async () => {
    await Model.deleteSelectedGroups();
    console.log("deleteButtonClick: deleteSelectedGroups:");

    const state = await Model.deleteSelectedTimestamps();
    console.log("deleteButtonClick: deleteSelectedTimestamps:", state);

    // TODO: kapseln mich in einen Funktion ein
    let newGroups = [];
    for (const [id, group] of Object.entries(state.groups)) {
      const { groupWrapper, groupEntries } = createGroupElements(
        id,
        group.groupName,
        (id) => Model.toggleGroupSelection(id)
      );
      group.timestamps.forEach((timestamp) => {
        const { entryWrapper } = createGroupEntry(timestamp, () => {
          Model.toggleTimestampSelection(id, timestamp);
        });
        groupEntries.append(entryWrapper);
      });
      // Remove all existing group elements before re-rendering
      list.append(groupWrapper);
      newGroups.push(groupWrapper);
    }

    list.innerHTML = "";
    newGroups.forEach((group) => {
      list.append(group);
    });
  });

  const {
    manualTimestampWrapper,
    manualTimestampButton,
    manualTimestampInput,
  } = createManualTimestampInput();

  manualTimestampButton.addEventListener("click", async (e) => {
    console.log("runTracking: manualTimeButton: press");

    const localValue = manualTimestampInput.value;
    if (!localValue) return;

    const localDate = new Date(localValue);
    const manualTimestamp = localDate.toISOString();

    await Model.addTimestampToSelectedGroups(manualTimestamp);

    // TODO: getState here or...??? When to use one or another, clear responsiibilities.
    Model.state.selectedGroups.forEach((groupId) => {
      const matchingElements = document.querySelectorAll(`[id="${groupId}"]`);

      matchingElements.forEach((el) => {
        let listElement = el.querySelector("ul"); // TODO: angleichen mit vorherende Beispiele

        if (listElement === null || manualTimestamp === "") return;

        // TODO: sollte ich Funktionen als einem param weiter geben oder es auf diesem Nivea anfuegen
        let { entryWrapper, entryText } = createGroupEntry(
          manualTimestamp,
          () => {
            Model.toggleTimestampSelection(id, manualTimestamp);
          }
        );

        entryText.textContent = manualTimestamp;
        listElement.append(entryWrapper);
      });
    });
  });

  document.body.append(
    dropdown,
    inputWrapper,
    list,
    deleteButton,
    addTimestampButton,
    manualTimestampWrapper
  );
};
export default renderApp;
