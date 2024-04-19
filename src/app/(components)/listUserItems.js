'use client';

import firebase_app from "@/src/firebase/config";
import { collection, getFirestore, limit, orderBy, query, where, getDocs} from "firebase/firestore";

import ItemCard from "../(shop)/itemCard";
import '../(shop)/shop.css';
import { Box } from '@mui/material';

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

export default async function ListUserItems({ items }) {
  const itemData = items;

  return(
    <Box
      minWidth='90vw'
      className="items"
    >
      {itemData.map((item) => {
        return (
          <ItemCard
            key={item.itemId}
            item={item}
          />
        )
      })}
    </Box>
  );
}