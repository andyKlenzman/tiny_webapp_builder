import {
  createGroupComponent,
  createListItemComponent,
  createButtonComponent,
  createInputFieldComponent,
} from "../../core/ui/atoms/uiAtoms.js";

import "../ui/styles/styles.css";

/*////////////////////////////////////////////////////
// Internal Functions
////////////////////////////////////////////////////*/
let input = "";

const buttonCb = (param) => {
  console.log("buttonCb: Input:", input);
  const newGroup = createGroupComponent({ title: input });
  document.body.appendChild(newGroup.element);
};

const inputFieldCb = (param) => {
  input = param;
  console.log("inputFieldCb: Param:", param, " Input: ", input);
};

const testUIGroupCreation = () => {
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "flex-row";

  const button = createButtonComponent({
    title: "Log something",
    callback: buttonCb,
  });

  const inputField = createInputFieldComponent({
    placeholder: "enter data",
    callback: inputFieldCb,
  });

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(button);

  // const item1 = createListItemComponent({ title: "item1" });
  // const item2 = createListItemComponent({ title: "item2" });
  // const item3 = createListItemComponent({ title: "item3" });

  // group.addItem(item1);
  // group.addItem(item2);
  // group.addItem(item3);

  document.body.appendChild(inputWrapper);
};

/*////////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
const runUITests = () => {
  console.log("runUITests: Start");
  testUIGroupCreation();
};

export default runUITests;
