/*////////////////////////////////////////////////////
// Documentation
////////////////////////////////////////////////////*

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
export const createInputFieldComponent = ({
  placeholder,
  onInputCb
}) => {
  const wrapper = document.createElement("div");

  const input = document.createElement("input");

  input.type = "text";
  input.placeholder = placeholder;

  input.addEventListener("input", (e) => {
    onInputCb(e.target.value);
  });

  wrapper.appendChild(input);

  return wrapper;
};

export const createButtonComponent = ({ title, onPressCb }) => {
  const button = document.createElement("button");
  button.textContent = title;
  button.addEventListener("click", (e) => {
    onPressCb();
  });
  return button;
};


// TODO: move me
export const createGroupComponent = ({ title }) => {
  const wrapper = document.createElement("div");
  const heading = document.createElement("h2");
  heading.textContent = title;

  const list = document.createElement("ul");

  wrapper.appendChild(heading);
  wrapper.appendChild(list);

  return {
    element: wrapper,
    addItem: (itemEl) => list.appendChild(itemEl),
    removeItem: (itemEl) => list.removeChild(itemEl),
    clear: () => (list.innerHTML = ""),
  };
};

export const createListItemComponent = ({ title }) => {
  const item = document.createElement("li");
  item.textContent = title;
  return item;
};
