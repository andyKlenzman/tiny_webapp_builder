// import { firebaseBackend } from "./databases/firebase.js";
import { jsonDatabase } from "./databases/jsonDatabase.js";

/*/ ///////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////*/
const DB_MODE = {
  // FIREBASE: "firebase", // TODO: implement me!
  JSON_DB: "jsonDb",
};

const SELECTED_DB_MODE = DB_MODE.JSON_DB;
// const backend = SELECTED_DB_MODE === "firebase" ? firebaseBackend : jsonBackend; // TODO: implement me
const database = jsonDatabase;

//////////////////////////////////////////////////////
// Public API
//////////////////////////////////////////////////////
export const DB = {
  getAll: database.getAll,
  getById: database.getById,
  getWhere: database.getWhere,
  add: database.add,
  update: database.update,
  deleteById: database.deleteById,
  
};
