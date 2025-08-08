const STORAGE_KEY = "json_file_db";

let store = load();

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export const browserDb = {
  async getAll(collectionName) {
    const collection = store[collectionName] || {};
    return collection;
  },

  async getById(collectionName, id) {
    if (store[collectionName] && id in store[collectionName]) {
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
    if (!store[collectionName]) store[collectionName] = {};

    store[collectionName][id] = data;
    save();

    return id;
  },

  async update(collectionName, id, data) {
    if (store[collectionName] && store[collectionName][id]) {
      store[collectionName][id] = {
        ...store[collectionName][id],
        ...data,
      };
      save();
      return store[collectionName][id];
    }
    return null;
  },

  async deleteAll(collectionName) {
    if (store[collectionName]) {
      delete store[collectionName];
      save();
    }
    return;
  },

  async deleteById(collectionName, id) {
    if (store[collectionName]) {
      delete store[collectionName][id];
      save();
    }
    return id;
  },
};
