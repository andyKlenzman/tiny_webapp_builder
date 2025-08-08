// test mal den Einheitlichkeit von wahrschiedliche datenbanken.
import { DB, createDB, DB_SOURCES } from "./dataAccessInterface";

const firebaseDB = createDB(DB_SOURCES.firebase);
const browserDB = createDB(DB_SOURCES.browser);

const COLLECTION = "test_collection";
let TEST_DOC = {
  groupName: "test",
  timestamps: ["test", "test"],
};

const testAddAndGetById = async () => {
  return;
};

const testDataAccessInterface = async () => {
  console.log("testData: start");

  console.log("testData: clearing test collection");

  await firebaseDB.deleteAll(COLLECTION);
  await browserDB.deleteAll(COLLECTION);

  console.log("testData: querying deleted collection");

  let firebaseEmptyCol = await firebaseDB.getAll(COLLECTION);
  let browserEmptyCol = await browserDB.getAll(COLLECTION);

  if (firebaseEmptyCol.length === 0 && browserEmptyCol.length === 0) {
    console.log("testData: deleting collection PASS");
  } else {
    console.log("testData: deleting collection FAIL");
  }

  console.log("testData: adding");

  let firebaseDocIdA = await firebaseDB.add(COLLECTION, TEST_DOC);
  let browserDocIdA = await browserDB.add(COLLECTION, TEST_DOC);
  let firebaseDocIdB = await firebaseDB.add(COLLECTION, TEST_DOC);
  let browserDocIdB = await browserDB.add(COLLECTION, TEST_DOC);

  console.log("testData: Querying ");

  let fbDocA = await firebaseDB.getById(COLLECTION, firebaseDocIdA);
  let browsDocA = await browserDB.getById(COLLECTION, browserDocIdA);

  let fbDocB = await firebaseDB.getById(COLLECTION, firebaseDocIdB);
  let browsDocB = await browserDB.getById(COLLECTION, browserDocIdB);

  console.log("testData: firebaseDoc:", fbDocA);
  console.log("testData: browserDoc:", browsDocA);

  if (
    fbDocA.groupName === browsDocA.groupName &&
    fbDocB.timestamps.length === browsDocB.timestamps.length
  ) {
    console.log("testData: PASS");
  } else {
    console.error("testData: FAIL");
  }

  console.log("testData: getWhere");

  let fbGetWhereDoc = await firebaseDB.getWhere(
    COLLECTION,
    "groupName",
    "test"
  );
  let browserGetWhereDoc = await browserDB.getWhere(
    COLLECTION,
    "groupName",
    "test"
  );

  console.log("testData: firebaseDoc:", fbGetWhereDoc);
  console.log("testData: browserDoc:", browserGetWhereDoc);

  if (fbGetWhereDoc.length === browserGetWhereDoc.length) {
    console.log("testData: PASS");
  } else {
    console.error("testData: FAIL");
  }

  console.log("testData: update");

  let firebaseDBupdateDoc = await firebaseDB.update(
    COLLECTION,
    firebaseDocIdA,
    {
      name: "New Name",
    }
  );
  let browserDBUpdateDoc = await browserDB.update(COLLECTION, browserDocIdA, {
    name: "New Name",
  });

  const fbDocAfterUpdateA = await firebaseDB.getById(
    COLLECTION,
    firebaseDocIdA
  );
  const browsDocAfterUpdateA = await browserDB.getById(
    COLLECTION,
    browserDocIdA
  );

  console.log(fbDocAfterUpdateA, browsDocAfterUpdateA);

  if (browsDocAfterUpdateA.name === fbDocAfterUpdateA.name) {
    console.log("testData: PASS");
  } else {
    console.error("testData: FAIL");
  }

  console.log("testData: deleteById");

  const firebaseDBDeleteDocId = await firebaseDB.deleteById(
    COLLECTION,
    firebaseDocIdA
  );
  const browsDBDeleteDocId = await browserDB.deleteById(
    COLLECTION,
    browserDocIdA
  );

  console.log(firebaseDBDeleteDocId, browsDBDeleteDocId);

  const fbFailedDoc = await firebaseDB.getById(
    COLLECTION,
    firebaseDBDeleteDocId
  );
  const browsFailedDoc = await browserDB.getById(
    COLLECTION,
    browsDBDeleteDocId
  );

  await firebaseDB.deleteAll(COLLECTION);
  await browserDB.deleteAll(COLLECTION);


};

export default testDataAccessInterface;
