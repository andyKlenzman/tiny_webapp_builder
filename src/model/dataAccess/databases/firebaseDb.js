import { db } from "../../../../firebase-config.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

////////////////////////////////////////////////////
// Public API
////////////////////////////////////////////////////
export const firebaseDB = {
  async getAll(collectionName) {
    const q = query(collection(db, collectionName));
    const snap = await getDocs(q);
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return docs;
  },

  async getById(collectionName, id) {
    console.log("FirebaseDb: Not Implemented");
  },

  async getWhere(collectionName, field, value) {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const snap = await getDocs(q);
    return snap;
  },

  async add(collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), data);
    Logger.log("serverAddDoc: Success:", docRef.id);
    return docRef.id;
  },

  async update(collectionName, id, data) {
    console.log("FirebaseDb: Not Implemented");
  },

  async deleteById(collectionName, id) {
    const docRef = doc(db, collectionName, id);

    await deleteDoc(docRef);

    return docRef.id;
  },
};
