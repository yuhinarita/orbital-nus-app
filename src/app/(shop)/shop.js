import React from 'react';
import ItemCard from './itemCard';
import { fetchItemData } from '@/src/firebase/firestore/fetch';
import './shop.css';

export default async function Shop() {
  const ITEMS = await fetchItemData();
  return (
    <div className="items">
      {ITEMS.map((item) => {
        return (
          <ItemCard
            key={item.itemId}
            item={item}
          />
        )
      })}
    </div>
  )
}

export const revalidate = 0;
