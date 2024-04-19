import { render, screen } from '@testing-library/react'
import ClientComponent from '@/src/app/item/[itemId]/clientComponent';
import '@testing-library/jest-dom'

// sample item
const item = {
  itemId: "yqHeBHXZHG24KE1AYo7h",
  itemTitle: "nike air max",
  date: "2023-06-25T13:28:32.097Z",
  dateInMilliseconds: 1687699712097,
  desc: "Nike Air Max Excee Man's Shoe. Size EU 42.5. Color : Sail/Hemp/Stadium Green/Black. Still brand new with the Nike box.",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/orbital-app-ad114.appspot.com/o/images%2FyqHeBHXZHG24KE1AYo7h.jpg?alt=media&token=b6378e76-43e2-456d-8be1-238bc34f138a",
  price: 100,
  uid: "uJEf6YTiBrhJnDfEVgrM7B3ZsEP2",
};

// sample user object for useAuthContext
const userObj = {
  user: {
    email: "orbital@mail.com",
    uid: "r4GlPdjHwXf2355HGs8PHagWv493",
    username: 'orbital',
    avgRating: 4.3,
    numRatedUsers: 3,
  }
};

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../src/app/item/[itemId]/chat', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => userObj),
}));

describe('Item page', () => {
  it('shows item info', () => {
    render(
      <ClientComponent item={item} seller={userObj.user} />
    );
    const itemTitle = screen.getByText(item.itemTitle);
    const price = screen.getByText('$'+item.price);
    const desc = screen.getByText(item.desc);
    const image = screen.getByRole('img');

    expect(itemTitle).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(desc).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });
});