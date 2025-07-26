// it can be that this app is so simple, the middleware actuallydoes not need to exist and app can live on the top level.
import {
  createGroupComponent,
  createListItemComponent,
} from "../core/ui/atoms/uiAtoms";

// import {server} to do add layer

// Wie kann ich den Eingagefeld entleeren? aber den schichten beibehalten?
let groupName = "";

export const createInputFieldComponent = ({ placeholder, onInputCb }) => {
  const input = document.createElement("input");

  input.type = "text";
  input.placeholder = placeholder;

  input.addEventListener("input", (e) => {
    groupName = e.target.value;
    console.log("onInputCb: groupName: ", groupName);
  });

  return input;
};

export const runTracking = () => {
  const inputWrapper = document.createElement("div");

  const inputField = createInputFieldComponent({
    placeholder: "Enter group name",
  });

  const button = document.createElement("button");
  button.textContent = "Go";

  button.addEventListener("click", () => {
    console.log("runTracking: button press");

    const groupName = inputField.value;
    const newGroup = createGroupComponent({ title: groupName });

    document.body.appendChild(newGroup.element);

    inputField.value = "";


  });

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(button);
  document.body.appendChild(inputWrapper);
};
