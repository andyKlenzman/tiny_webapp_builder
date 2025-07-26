/*////////////////////////////////////////////////////
// Documentation
////////////////////////////////////////////////////*

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/



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
