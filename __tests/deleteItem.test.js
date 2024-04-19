import { render, screen } from '@testing-library/react';
import Delete from '@/src/app/item/[itemId]/delete';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// sample item
const item = {
  itemId: "yqHeBHXZHG24KE1AYo7h",
  itemTitle: "nike air max",
  date: "2023-06-25T13:28:32.097Z",
  dateInMilliseconds: 1687699712097,
  desc: "Nike Air Max Excee Man's Shoe. Size EU 42.5. Color : Sail/Hemp/Stadium Green/Black. Still brand new with the Nike box.",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/orbital-app-ad114.appspot.com/o/images%2FyqHeBHXZHG24KE1AYo7h.jpg?alt=media&token=a63772a3-7cbf-4201-88ef-c29566bd35b2",
  price: 100,
  uid: "uJEf6YTiBrhJnDfEVgrM7B3ZsEP2",
};

// sample user object for useAuthContext
const userObj = {
  user: {
    uid: "uJEf6YTiBrhJnDfEVgrM7B3ZsEP2",
  }
};

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => userObj),
}));

jest.mock('firebase/firestore', () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

describe('Delete item component', () => {
  it('renders component', () => {
    render(<Delete item={item} />);
  });

  it('shows warning before deleting', async () => {
    const user = userEvent.setup();
    render(<Delete item={item} />);
    await user.click(screen.getByRole('button'));
    const warning = screen.getByRole('heading', { name: 'Are you sure you want to delete this item?' });
    expect(warning).toBeInTheDocument();
  });

  it('successfully deletes item when pressing yes', async () => {
    const user = userEvent.setup();
    render(<Delete item={item} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: 'Yes' }));
    expect(deleteDoc).toHaveBeenCalled();
  });

  it('opens completion popup when successfully deleting item', async () => {
    const user = userEvent.setup();
    render(<Delete item={item} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: 'Yes' }));
    const dialog = screen.getByRole('dialog', { name: 'This item has been removed!' });
    expect(dialog).toBeInTheDocument();
  });

  it('redirects to dashboard after closing popup', async () => {
    const user = userEvent.setup();
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<Delete item={item} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mockRouter.push).toHaveBeenCalledWith(`/dashboard?u=${item.uid}`);
  });
});