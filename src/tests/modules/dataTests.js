import { DB } from "../../core/data/dataAccessLayer";

const groupsCollectionLabel = "groups";
const itemsCollectionLabel = "items";

const runJsonDbTests = async () => {
  console.log("runJsonDbTests: START");
  // add group
  let newGroup = { name: "newGroupA" };
  let { id } = await DB.add(groupsCollectionLabel, newGroup);

  newGroup = { name: "newGroupB" };
  id = await DB.add(groupsCollectionLabel, newGroup);

  console.log("runJsonDbTests: END");
};

const runDataTests = async () => {
  runJsonDbTests();
};

export default runDataTests;

/*/ ///////////////////////////////////////////////////
// Archive
////////////////////////////////////////////////////*/

// // Beispiel-Datenmodell definieren (könnte aus appModels.js kommen)
// const newUser = { name: "Charlie", age: 40 };

// // Hinzufügen
// const { id } = await DB.add("users", newUser);
// console.assert(typeof id === "string", "✅ User wurde hinzugefügt");

// // Alle abrufen
// const allUsers = await DB.getAll("users");
// console.assert(
//   allUsers.some((u) => u.name === "Charlie"),
//   "✅ Neuer User taucht in getAll() auf"
// );

// // Nach Attribut filtern
// const foundUsers = await DB.getWhere("users", "age", 40);
// console.assert(
//   foundUsers.length > 0 && foundUsers[0].name === "Charlie",
//   "✅ getWhere() funktioniert"
// );

// // Löschen
// await DB.deleteById("users", id);
// const afterDelete = await DB.getAll("users");
// console.assert(
//   !afterDelete.some((u) => u.id === id),
//   "✅ User erfolgreich gelöscht"
// );

// const runFirebaseTests = async () => {
//   let res = firebaseGetDocsByCollection(groupsCollectionLabel);
//   console.log("getCollection", res);

//   let docRefA = await firebaseAddDoc(groupsCollectionLabel, { name: "you" });
//   let docRefB = await firebaseAddDoc(groupsCollectionLabel, { name: "hey" });

//   await firebaseDeleteDocsByField("groups", "name", "hey");
// };
