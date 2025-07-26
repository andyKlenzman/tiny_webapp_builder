// it can be that this app is so simple, the middleware actuallydoes not need to exist and app can live on the top level.
import {
  createButtonComponent,
  createInputFieldComponent,
  createGroupComponent,
  createListItemComponent,
} from "../core/ui/atoms/uiAtoms";

// import {server} to do add layer

// Wie kann ich den Eingagefeld entleeren? aber den schichten beibehalten?
let groupName = "";

const onInputCb = (params, context) => {
  groupName = params;
  console.log("onInputCb: groupName: ", groupName);
};

const onPressCb = () => {
  console.log("onPressCn: ", groupName);

  const newGroup = createGroupComponent({ title: groupName });

  document.body.appendChild(newGroup.element);
  groupName = "";

  // TODO: Kann ich eingabe irgendwie hier zurucksetzen?
};

export const runTracking = () => {
  const inputWrapper = document.createElement("div");

  const inputField = createInputFieldComponent({
    placeholder: "Enter group name",
    onInputCb,
  });
  const button = createButtonComponent({ title: "Go", onPressCb });

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(button);

  document.body.appendChild(inputWrapper);
};
