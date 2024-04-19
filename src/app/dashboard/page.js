import ClientComponent from "./clientComponent";
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore";
import firebase_app from "@/src/firebase/config";

async function getUser(uid) {
  const db = getFirestore(firebase_app);
  const docRef = doc(db, "users", `${uid}`);
  const docSnap = await getDoc(docRef);
  const userJSON = docSnap.data();
  return userJSON;

  // const res = await fetch(`https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`, 
  // { 
  //   method: 'GET',
  //   cache: 'no-cache',
  // });
  // return res.json();
}

async function fetchUserItems(uid) {
  const db = getFirestore(firebase_app);
  const data = query(collection(db, "items"),
                      where("uid", "==", uid),
                      orderBy("dateInMilliseconds", "desc"),
                      limit(25));
  const docSnapshots = await getDocs(data);

  const itemsJson = docSnapshots.docs.map(doc => doc.data());
  console.log('user listed items fetched');
  console.log(itemsJson);
  return itemsJson;
}

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  const uid = searchParams.u;
  const userObject = await getUser(uid)
  const itemsJSON = await fetchUserItems(uid);

  return(
    <ClientComponent user={userObject} items={itemsJSON} />
  );
}