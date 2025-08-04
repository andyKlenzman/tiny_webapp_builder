import { firebaseDB } from "./databases/firebaseDb.js";
import { browserDb } from "./databases/browserDb.js";

// Alle verfügbaren Datenbanken in einer Map
const DB_SOURCES = {
  firebase: firebaseDB,
  browser: browserDb,
};

// Factory-Funktion für das DB-Interface
export function createDB(source) {
  const db = DB_SOURCES[source];
  if (!db) throw new Error(`Unknown DB source: ${source}`);

  return {
    getAll: db.getAll,
    getById: db.getById,
    getWhere: db.getWhere,
    add: db.add,
    update: db.update,
    deleteById: db.deleteById,
  };
}

// Standard-Export für die Default-Datenbank
export const DB = createDB("browser"); // TODO: Gibt man ein spezieller Name
