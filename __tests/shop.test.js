import { render, screen } from '@testing-library/react'
import Shop from '@/src/app/(shop)/shop';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { fetchItemData } from '@/src/firebase/firestore/fetch';
import ItemCard from '@/src/app/(shop)/itemCard';

// sample item
const ITEMS = [{
  itemId: "yqHeBHXZHG24KE1AYo7h",
  itemTitle: "nike air max",
  date: "2023-06-25T13:28:32.097Z",
  dateInMilliseconds: 1687699712097,
  desc: "Nike Air Max Excee Man's Shoe. Size EU 42.5. Color : Sail/Hemp/Stadium Green/Black. Still brand new with the Nike box.",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/orbital-app-ad114.appspot.com/o/images%2FyqHeBHXZHG24KE1AYo7h.jpg?alt=media&token=b6378e76-43e2-456d-8be1-238bc34f138a",
  price: 100,
  uid: "uJEf6YTiBrhJnDfEVgrM7B3ZsEP2",
}];

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../src/firebase/firestore/fetch', () => ({
  fetchItemData: jest.fn(() => ITEMS),
}));

describe('Shop component', () => {
  it("renders all listed items", async () => {
    render(
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
    );
  });
});