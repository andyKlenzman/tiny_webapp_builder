import {
  firebaseAddDoc,
  firebaseDeleteDoc,
  firebaseDeleteDocsByField,
  firebaseGetDocsByCollection,
} from "../../core/data/firebase";

const groupsCollectionLabel = "groups";
const itemsCollectionLabel = "items";

const runDataTests = async () => {



  let res = firebaseGetDocsByCollection(groupsCollectionLabel);
  console.log("getCollection", res);

  let docRefA = await firebaseAddDoc(groupsCollectionLabel, { name: "you" });
  let docRefB = await firebaseAddDoc(groupsCollectionLabel, { name: "hey" });

  await firebaseDeleteDocsByField("groups", "name", "hey");
};

export default runDataTests;
