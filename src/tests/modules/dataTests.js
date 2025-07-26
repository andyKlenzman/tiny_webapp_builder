import {
  firebaseAddDoc,
  firebaseDeleteDoc,
  firebaseDeleteDocsByField,
  firebaseGetDocsByCollection,
} from "../../data/server/firebase";

const groupsCollectionLabel = "groups";
const itemsCollectionLabel = "items";

const testGetCollection = async () => {
  let res = firebaseGetDocsByCollection(groupsCollectionLabel);
  console.log("getCollection", res);
};

const testAddServerData = async () => {
  // add a group

  let docRefA = await firebaseAddDoc(groupsCollectionLabel, { name: "you" });
  let docRefB = await firebaseAddDoc(groupsCollectionLabel, { name: "hey" });
};

const testDeleteServerData = async () => {
  await firebaseDeleteDocsByField("groups", "name", "hey");
};

//Todo: delete server data

const runDataTests = () => {};

export default runDataTests;
