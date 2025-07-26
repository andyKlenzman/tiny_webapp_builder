/*////////////////////////////////////////////////////
// Documentation
////////////////////////////////////////////////////*

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
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

