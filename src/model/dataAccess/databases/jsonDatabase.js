const STORAGE_KEY = "json_file_db";

let store = load();

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {}; // kein { groups: {}, posts: {} }
}

function save() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export const jsonDatabase = {
  async getAll(collectionName) {
    return store[collectionName] || {};
  },

  async getWhere(collectionName, field, value) {
    const collection = store[collectionName] || {};
    return Object.entries(collection)
      .filter(([_, doc]) => doc[field] === value)
      .map(([id, doc]) => ({ id, ...doc }));
  },

  async add(collectionName, data) {
    const id = crypto.randomUUID();
    console.log(id, store);

    if (!store[collectionName]) store[collectionName] = {};

    store[collectionName][id] = data;
    save();
    return { id };
  },

  async deleteById(collectionName, id) {
    if (store[collectionName]) {
      delete store[collectionName][id];
      save();
    }
    return { id };
  },
};
