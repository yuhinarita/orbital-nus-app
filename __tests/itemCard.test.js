import { render, screen } from '@testing-library/react'
import ItemCard from '@/src/app/(shop)/itemCard';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';

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

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

describe('ItemCard component', () => {
  it('shows item title', () => {
    render(
      <ItemCard itemId={item.itemId} item={item} />
    );
    const title = screen.getByText(item.itemTitle);
    expect(title).toBeInTheDocument();
  });

  it('shows item price', () => {
    render(
      <ItemCard itemId={item.itemId} item={item} />
    );
    const price = screen.getByText("$"+item.price);
    expect(price).toBeInTheDocument();  
  });

  it('shows item image', () => {
    render(
      <ItemCard itemId={item.itemId} item={item} />
    );
    const image = screen.getByRole("img");
    expect(image.src).toContain(item.imageUrl);
  });

  it('goes to correct link when clicked', async () => {
    const user = userEvent.setup();
    const mockRouter = {
      push: jest.fn(),
    }
    useRouter.mockReturnValue(mockRouter);
    render(
      <ItemCard itemId={item.itemId} item={item} />
    );
    await user.click(screen.getByRole('button'));
    expect(mockRouter.push).toHaveBeenCalledWith(`/item/${item.itemId}`);
  })
});