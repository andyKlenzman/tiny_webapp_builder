import Logger from "./utils/logger.js";
import {ErrorCodes} from "./defines.js";

import { db } from "../firebase-config.js";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

/*////////////////////////////////////////////////////
// Documentation
////////////////////////////////////////////////////*
/**
 * Defines the core data structures and exposes their firebase
 * functions to the main application/ 

 */
/*////////////////////////////////////////////////////
// Constants and DOM References
////////////////////////////////////////////////////*/
Logger.setEnabled(true)

const groupsCollectionLabel= "groups";
const itemsCollectionLabel  = "items";

const form            = document.getElementById("group-form");
const nameInput       = document.getElementById("group-name");
const groupsContainer = document.getElementById("groups-container");


/*////////////////////////////////////////////////////
//
////////////////////////////////////////////////////*/
export const dataAddGroup = async (groupLabel) => {
  try {
    const docRef = await addDoc(collection(db, groupsCollectionLabel), {
      name: groupLabel
    });
    Logger.log("dataAddGroup: Success:", docRef.id);
    return { status: 'ok', id: docRef.id };

  } catch (error) {
    Logger.error("dataAddGroup: Fail:", docRef.id);
    return { status: 'error', errorCode: ErrorCodes.ADD_GROUP_FAILED, details: error.message };
  }
};





