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

  async getById(collectionName, id) {
    if (store[collectionName] && store[collectionName][id]) {
      return store[collectionName][id];
    }
    return null;
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

  async update(collectionName, id, data) {
    if (store[collectionName] && store[collectionName][id]) {
      store[collectionName][id] = {
        ...store[collectionName][id],
        ...data,
      };
      save();
      return { id, ...store[collectionName][id] };
    }
    return null;
  },

  async deleteById(collectionName, id) {
    if (store[collectionName]) {
      delete store[collectionName][id];
      save();
    }
    return { id };
  },
};
