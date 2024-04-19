import firebase_app from "@/src/firebase/config";
import { query, getFirestore, getDocs, collection, orderBy, limit, startAfter } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export async function fetchItemData() {
  const db = getFirestore(firebase_app);

  // Query the first 25 products
  const first = query(collection(db, "items"), 
    orderBy("dateInMilliseconds", "desc"),
    limit(25));
  const docSnapshots = await getDocs(first);
  
  // Get the last visible document
  const lastVisible = docSnapshots.docs[docSnapshots.docs.length - 1];

  // Construct a new query starting at this document,
  // get the next 25 products.

  // const next = query(collection(db, "products"),
  //   orderBy("dateInMilliseconds"),
  //   startAfter(lastVisible),
  //   limit(25));

  const productsJson = docSnapshots.docs.map(doc => doc.data());
  return productsJson;
}