import firebase_app from "../config";
import { getFirestore, doc, setDoc, collection, updateDoc, query, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app)

export default async function addData(collectionName, id, data) {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db, collectionName, id), data, {
            merge: true,
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export function addDataWithAutoGenId(collectionName) {
    return doc(collection(db, collectionName));
}