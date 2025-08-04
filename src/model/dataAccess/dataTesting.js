// test mal den Einheitlichkeit von wahrschiedliche datenbanken.
import { DB, createDB } from "./dataAccessInterface";

const firebaseDB = createDB("firestore");
const browserDB = createDB("browser");

const COLLECTION = "test_collection";
let TEST_DOC = {
  groupName: "test",
  timestamps: ["test", "test"],
};
// TODO: Prob makes sense to make this one big unit test. After real implementation figure out the best way to organize all functions together

const testAddAndReadData = async (collection, testDoc) => {
  console.log("testAddData: Start");
  // ensure db are in the same state

  // add  the same data

  let firebaseDocId = await firebaseDB.add(collection, testDoc);
  let browserDocId = await browserDB.add(collection, testDoc);

  let fbDoc = await firebaseDB.getById(collection, firebaseDocId);
  let browsDoc = await browserDB.getById(collection, browserDocId);

  firebaseDocId = await firebaseDB.getAll();

  if (fbDoc === browsDoc && fbDoc === testDoc) {
    console.log("testAddData: PASS");
  } else {
    console.error("testAddData: FAIL");
  }

  // return if it is orrect
};

const runDataTests = async () => {
  await testAddAndReadData(COLLECTION, TEST_DOC);
  await testGetAllAndDelete();
};
