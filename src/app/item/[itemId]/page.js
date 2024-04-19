import { fetchItemData } from "@/src/firebase/firestore/fetch";
import ClientComponent from "./clientComponent";
import { toJSON } from "@/src/firebase/firestore/restAPI";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebase_app from "@/src/firebase/config";
import { useRouter } from 'next/navigation';  

export async function generateStaticParams() {
  const ITEMS = await fetchItemData();

  return ITEMS.map((item) => ({
    itemId: item.itemId,
  }));
}

async function getItem(itemId) {
  const db = getFirestore(firebase_app);
  const docRef = doc(db, "items", `${itemId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

async function getSeller(sellerId) {
  const db = getFirestore(firebase_app);
  const docRef = doc(db, "users", `${sellerId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { itemId } = params;

  const itemObject = await getItem(itemId);
  const sellerObject = await getSeller(itemObject.uid);

  return (
    <ClientComponent item={itemObject} seller={sellerObject} />
  );
}