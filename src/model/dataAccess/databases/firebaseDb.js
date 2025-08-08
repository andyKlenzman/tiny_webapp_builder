import { db } from "../../../../firebase-config.js";
import {
  collection,
  addDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

////////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////
export const firebaseDB = {
  async getAll(collectionName) {
    try {
      const q = query(collection(db, collectionName));
      const snap = await getDocs(q);
      let docs = {};

      for (const doc of snap.docs) {
        docs[doc.id] = {...doc.data()}
      }
      return docs;
    } catch (error) {
      console.error("firebaseDB: getAll:", error);
      return null;
    }
  },
  async getById(collectionName, id) {
    try {
      console.log("firebaseDb: getById:", collectionName, "id:", id);

      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error("firebaseDB: getById:", error);
    }
  },

  async getWhere(collectionName, field, value) {
    try {
      const q = query(
        collection(db, collectionName),
        where(field, "==", value)
      );
      const snap = await getDocs(q);

      const results = snap.docs.map((doc) => ({
        ...doc.data(),
      }));

      return results;
    } catch (error) {
      console.error("firebaseDB: getWhere:", error);
    }
  },

  async add(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error("firebaseDB: add:", error);
    }
  },

  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return null;
      }

      await updateDoc(docRef, data);

      const updatedSnap = await getDoc(docRef);

      return updatedSnap.data();
    } catch (error) {
      console.error("firebaseDB: update:", error);
    }
  },

  async deleteAll(collectionName) {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);

      // TODO: fuegen length sanity check hinzu max 200 zB

      const deletePromises = snapshot.docs.map((document) =>
        deleteDoc(doc(db, collectionName, document.id))
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("firebaseDB: deleteAll:", error);
    }
  },

  async deleteById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);

      await deleteDoc(docRef);

      return docRef.id;
    } catch (error) {
      console.error("firebaseDB: deleteById:", error);
    }
  },
};
