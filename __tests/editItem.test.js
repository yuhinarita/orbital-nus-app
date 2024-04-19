import { render, screen } from '@testing-library/react'
import EditItem from '@/src/app/item/[itemId]/editItem';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { Result } from 'postcss';

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

// data to update with
const newData = {
  itemTitle: "test",
  desc: "test",
  price: 10,
}

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
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(() => ({ ref: 'test'})),
  getDownloadURL: jest.fn(() => newData.imageUrl),
  deleteObject: jest.fn(() => {
    const res = null,
          err = null; 
    return Promise.resolve({ res, err });
  }),
}))

describe('Edit item component', () => {
  it('renders edit item button', () => {
    render(<EditItem item={item} />);
  });

  it('shows correct default texts', async () => {
    const user = userEvent.setup();
    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));
    
    const itemTitle = screen.getByRole('textbox', { name: 'Item Title' });
    const price = screen.getByTestId('price');
    const description = screen.getByRole('textbox', { name: 'Item description' });

    expect(itemTitle.value).toBe(item.itemTitle);
    expect(price.value).toBe(`${item.price}`);
    expect(description.value).toBe(item.desc);
  });

  it('shows correct item preview when changed', async () => {
    const user = userEvent.setup();
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();

    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));

    const file = new File(['test'], 'test.png', {type: 'image/png'});
    const input = screen.getByTestId('upload');

    await user.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files.item(0)).toBe(file);
    expect(input.files.item(0)).toBe(file);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('shows error message when there is an empty field (excluding image file)', async () => {
    const user = userEvent.setup();
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();

    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));
    
    const itemTitle = screen.getByRole('textbox', { name: 'Item Title' });
    const submit = screen.getByRole('button', { name: 'Update' });

    await user.clear(itemTitle);
    await user.click(submit);

    const errMsg = screen.getByText('Missing input field');
    expect(errMsg).toBeInTheDocument();
  });

  it('shows error message when submitted with all fields being the same', async () => {
    const user = userEvent.setup();
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    doc.mockReturnValue(jest.fn());

    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));

    const submit = screen.getByRole('button', { name: 'Update' });
    await user.click(submit);

    const errMsg = screen.getByText('No changes have been made');
    expect(errMsg).toBeInTheDocument();
  });

  it('correctly updates relevant data', async () => {
    const user = userEvent.setup();
    //mocked functions
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    useRouter.mockReturnValue({ refresh: jest.fn() });

    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));

    const submit = screen.getByRole('button', { name: 'Update' });

    const file = new File(['test'], 'test.png', {type: 'image/png'});
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });

    FormData = jest.fn();
    const mockedFormData = {
      get: jest.fn((arg) => {
        if (arg === 'itemTitle') return newData.itemTitle;
        if (arg === 'price') return newData.price;
        if (arg === 'description') return newData.desc;
        if (arg === 'image') return file;
      }),
    };
    FormData.mockReturnValue(mockedFormData);
    await user.click(submit);

    expect(updateDoc.mock.calls[0][1]).toEqual({ itemTitle: newData.itemTitle });
    expect(updateDoc.mock.calls[1][1]).toEqual({ price: newData.price });
    expect(updateDoc.mock.calls[2][1]).toEqual({ desc: newData.desc });
    expect(updateDoc.mock.calls[3][1]).toEqual({ imageUrl: newData.imageUrl });
  });

  it('refreshes page when updated', async () => {
    const user = userEvent.setup();
    //mocked functions
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    const mockRouter = { refresh: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));

    const itemTitle = screen.getByRole('textbox', { name: 'Item Title' });
    const submit = screen.getByRole('button', { name: 'Update' });

    await user.clear(itemTitle);
    await user.type(itemTitle, newData.itemTitle);
    await user.click(submit);

    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it('shows popup when update is successful', async () => {
    const user = userEvent.setup();
    //mocked functions
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    const mockRouter = { refresh: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(
      <EditItem item={item} />
    );
    await user.click(screen.getByRole('button'));

    const itemTitle = screen.getByRole('textbox', { name: 'Item Title' });
    const submit = screen.getByRole('button', { name: 'Update' });

    await user.clear(itemTitle);
    await user.type(itemTitle, newData.itemTitle);
    await user.click(submit);

    const dialog = screen.getByRole('dialog', { name: 'Your item details have been updated!' });
    expect(dialog).toBeInTheDocument();
  });
});