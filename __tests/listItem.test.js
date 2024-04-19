import { render, screen } from '@testing-library/react'
import Page from '@/src/app/dashboard/list/page';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { addDataWithAutoGenId } from '@/src/firebase/firestore/addData';

// sample item data to list
const newData = {
  itemId: 'testId',
  itemTitle: "test",
  dateInMilliseconds: 1,
  date: 'now',
  desc: "test",
  price: 10,
  imageUrl: 'url',
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
  setDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(() => ({ ref: 'test'})),
  getDownloadURL: jest.fn(() => newData.imageUrl),
}))

jest.mock('../src/firebase/firestore/addData', () => ({
  addDataWithAutoGenId: jest.fn(), 
}));

describe('List item page', () => {
  it('renders page', () => {
    render(<Page />);
    const pageTitle = screen.getByRole('heading');
    expect(pageTitle).toBeInTheDocument();
  });

  it('shows text input form', () => {
    const user = userEvent.setup();
    render(
      <Page />
    );
    
    const itemTitle = screen.getByRole('textbox', { name: 'Item Title'});
    const price = screen.getByTestId('price');
    const description = screen.getByRole('textbox', { name: 'Item description' });

    expect(itemTitle).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('shows correct item preview when changed', async () => {
    const user = userEvent.setup();
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();

    render(
      <Page />
    );

    const file = new File(['test'], 'test.png', {type: 'image/png'});
    const input = screen.getByTestId('upload');

    await user.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files.item(0)).toBe(file);
    expect(input.files.item(0)).toBe(file);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('shows error message when there is an empty field (including image file)', async () => {
    const user = userEvent.setup();
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();

    render(
      <Page />
    );
    const submit = screen.getByRole('button', { name: 'Submit' });
    await user.click(submit);

    const errMsg = screen.getByText('Missing input field');
    expect(errMsg).toBeInTheDocument();
  });

  it('correctly submits relevant data', async () => {
    const user = userEvent.setup();
    //mocked functions
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    useRouter.mockReturnValue({ push: jest.fn() });
    addDataWithAutoGenId.mockReturnValue({ id: newData.itemId });
    Date.now = jest.fn(() => newData.dateInMilliseconds);
    const spy = jest
    .spyOn(Date.prototype, 'toISOString')
    .mockImplementation(() => newData.date);

    render(
      <Page />
    );
    const submit = screen.getByRole('button', { name: 'Submit' });

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

    expect(setDoc).toHaveBeenCalledWith(addDataWithAutoGenId(), {
      itemId: newData.itemId,
      itemTitle: newData.itemTitle,
      price: newData.price,
      desc: newData.desc,
      dateInMilliseconds: Date.now(),
      date: new Date().toISOString(),
      uid: userObj.user.uid,
      imageUrl: newData.imageUrl,
    });
  });

  it('shows popup when listing is successful', async () => {
    const user = userEvent.setup();
    //mocked functions
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    useRouter.mockReturnValue({ push: jest.fn() });

    render(
      <Page />
    );
    const submit = screen.getByRole('button', { name: 'Submit' });

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
    const dialog = screen.getByRole('dialog', { name: 'Your item has been listed!' });
    expect(dialog).toBeInTheDocument();
  });
});