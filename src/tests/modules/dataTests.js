import { DB } from "../../core/data/dataAccessLayer";

/*/ ///////////////////////////////////////////////////
// Defines
////////////////////////////////////////////////////*/
const LABELS = {
  GROUPS: "groups",
  ITEMS: "items",
};

/*/ ///////////////////////////////////////////////////
// Debug Components 
////////////////////////////////////////////////////*/
// TODO: entkoppeln JSON
const showJsonDbContents = async () => {
  let raw_groups = await DB.getAll(LABELS.GROUPS);
  let raw_items = await DB.getAll(LABELS.ITEMS);

  let data = {
    groups: raw_groups,
    items: raw_items,
  };

  let pretty = JSON.stringify(data, null, 2);

  let oldPreview = document.getElementById("json-preview");
  if (oldPreview) oldPreview.remove();

  let jsonPreview = document.createElement("pre");
  jsonPreview.id = "json-preview";
  jsonPreview.textContent = pretty;
  document.body.prepend(jsonPreview);
};

/*/ ///////////////////////////////////////////////////
// Tests
////////////////////////////////////////////////////*/
const runDbTests = async () => {
  console.log("runDbTests: START");

  const groupA = { name: "GroupA" };
  const groupB = { name: "GroupB" };
  const groupC = { name: "GroupC" };
  const groupAId = (await DB.add(LABELS.GROUPS, groupA)).id;
  const groupBId = (await DB.add(LABELS.GROUPS, groupB)).id;
  const groupCId = (await DB.add(LABELS.GROUPS, groupC)).id;

  const itemA = { name: "ItemA" };
  const itemB = { name: "ItemB" };
  const itemC = { name: "ItemC" };
  const itemAId = (await DB.add(LABELS.ITEMS, itemA)).id;
  const itemBId = (await DB.add(LABELS.ITEMS, itemB)).id;
  const itemCId = (await DB.add(LABELS.ITEMS, itemC)).id;

  await DB.deleteById(LABELS.GROUPS, groupAId);
  await DB.deleteById(LABELS.ITEMS, itemAId);

  await showJsonDbContents();

  const foundGroup = await DB.getWhere(LABELS.GROUPS, "name", "GroupB");
  const foundItem = await DB.getWhere(LABELS.ITEMS, "name", "ItemB");

  console.log("getWhere GroupB:", foundGroup);
  console.log("getWhere ItemB:", foundItem);

  await showJsonDbContents();

  console.log("runDbTests: END");
};

/*/ ///////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////*/
const runDataTests = async () => {
  runDbTests();
};

export default runDataTests;
