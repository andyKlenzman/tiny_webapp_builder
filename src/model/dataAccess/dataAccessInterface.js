import { firebaseDB } from "./databases/firebaseDb.js";
import { browserDb } from "./databases/browserDb.js";
/*/ ///////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////*/
const DB_SOURCES = {
  FIREBASE: firebaseDB,
  BROWSER: browserDb,
};

// const backend = SELECTED_DB_MODE === "firebase" ? firebaseBackend : jsonBackend; // TODO: implement me
let database = DB_SOURCES.BROWSER;

//////////////////////////////////////////////////////
// Public API
//////////////////////////////////////////////////////
export const setDBSource = (dbSource) => {
  database = dbSource={}
};
export const DB = {
  getAll: database.getAll,
  getById: database.getById,
  getWhere: database.getWhere,
  add: database.add,
  update: database.update,
  deleteById: database.deleteById,
};
