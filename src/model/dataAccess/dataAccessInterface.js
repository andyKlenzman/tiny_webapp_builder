import { firebaseDB } from "./databases/firebaseDb.js";
import { browserDb } from "./databases/browserDb.js";

export const DB_SOURCES = {
  firebase: "firebase",
  browser: "browser",
};

// Factory-Funktion für das DB-Interface
export function createDB(source) {
  let db;
  switch (source) {
    case DB_SOURCES.browser:
      db = browserDb;
      break;
    case DB_SOURCES.firebase:
      db = firebaseDB;
      break;
    default:
      console.error(`createDB: Unknown DB source`);
      return;
  }

  return {
    getAll: db.getAll,
    getById: db.getById,
    getWhere: db.getWhere,
    add: db.add,
    update: db.update,
    deleteAll: db.deleteAll,
    deleteById: db.deleteById,
  };
}

// Standard-Export für die Default-Datenbank
export const DB = createDB(DB_SOURCES.browser); // TODO: Gibt man ein spezieller Name
