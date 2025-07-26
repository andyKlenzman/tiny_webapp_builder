import Logger from "../../utils/logger.js";
import { ErrorCodes } from "../../defines.js";

import { db } from "../../../firebase-config.js";

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
Logger.setEnabled(true);

/*////////////////////////////////////////////////////
// Add
////////////////////////////////////////////////////*/
export const firebaseAddDoc = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    Logger.log("serverAddDoc: Success:", docRef.id);
    return { status: "ok", id: docRef.id };
  } catch (error) {
    Logger.error("serverAddDoc: Fail:", docRef.id);
    return {
      status: "error",
      errorCode: ErrorCodes.ADD_DOC_FAILED,
      details: error.message,
    };
  }
};

/*////////////////////////////////////////////////////
// Get
////////////////////////////////////////////////////*/
export const firebaseGetDocsByCollection = async (collectionName) => {
  const q = query(collection(db, collectionName));

  try {
    const snap = await getDocs(q);
    Logger.log("serverGetDocsByCollection: Success");
    // Die Dokumente als Array zurückgeben
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { status: "ok", docs };
  } catch (error) {
    Logger.log("serverGetDocsByCollection: Fail");
    return {
      status: "error",
      errorCode: ErrorCodes.GET_DOCS_FAILED,
      details: error.message,
    };
  }
};

export const firebaseGetDocsByField = async (
  collectionName,
  searchField,
  fieldCriteria
) => {
  const q = query(
    collection(db, collectionName),
    where(searchField, "==", fieldCriteria)
  );

  try {
    const snap = await getDocs(q);
    Logger.log("serverGetMatchingDocs: Success");
  } catch (error) {
    Logger.log("serverGetMatchingDocs: Fail");
    return {
      status: "error",
      errorCode: ErrorCodes.GET_DOCS_FAILED,
      details: error.message,
    };
  }
};

/*////////////////////////////////////////////////////
// Delete
////////////////////////////////////////////////////*/

// Löscht alle Dokumente in einer Collection, die einem bestimmten Feldwert entsprechen
export const firebaseDeleteDocsByField = async (
  collectionName,
  searchField,
  fieldCriteria
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(searchField, "==", fieldCriteria)
    );
    const snap = await getDocs(q);

    const deletePromises = snap.docs.map((docSnap) =>
      deleteDoc(doc(db, collectionName, docSnap.id))
    );

    await Promise.all(deletePromises);

    Logger.log(
      `serverDeleteDocsByField: Success: Deleted ${snap.docs.length} docs`
    );
    return { status: "ok", deletedCount: snap.docs.length };
  } catch (error) {
    Logger.error("serverDeleteDocsByField: Fail");
    return {
      status: "error",
      errorCode: ErrorCodes.DELETE_DOC_FAILED,
      details: error.message,
    };
  }
};

// TODO: delete by field?
export const firebaseDeleteDoc = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);

    await deleteDoc(docRef);

    Logger.log("serverDeleteDoc: Success:", docRef.id);
    return { status: "ok", id: docRef.id };
  } catch (error) {
    Logger.error("serverDeleteDoc: Fail:", docRef.id);
    return {
      status: "error",
      errorCode: ErrorCodes.DELETE_DOC_FAILED,
      details: error.message,
    };
  }
};
