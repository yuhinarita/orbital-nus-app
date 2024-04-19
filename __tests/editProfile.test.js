import { render, screen } from '@testing-library/react'
import EditProfile from '@/src/app/dashboard/editProfile';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

// sample user object
const userObj = {
  username: 'testuser', 
  email: 'test@examplemail.com',
  uid: "test",
  password: 'password',
};

// sample new user data
const newData = {
  username: 'testTesting', 
  email: 'test@test.com',
  uid: "test",
  password: 'testpass',
}

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
}));

jest.mock('../src/firebase/auth/passwordUpdate', () => ({
  __esModule: true,
  default: jest.fn(() => {
    const res = null,
          err = null;
    return Promise.resolve({ res, err });
  }),
}));

jest.mock('../src/firebase/auth/emailUpdate', () => ({
  __esModule: true,
  default: jest.fn(() => {
    const res = null,
          err = null;
    return Promise.resolve({ res, err });
  }),
}));

jest.mock('firebase/firestore', () => ({
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

describe('Edit Profile component', () => {
  it('renders component', () => {
    render(<EditProfile user={userObj} />);
  });

  it('shows correct default texts', async () => {
    const user = userEvent.setup();
    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));

    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const emailField = screen.getByRole('textbox', { name: 'Email' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');

    expect(usernameField.value).toBe(userObj.username);
    expect(emailField.value).toBe(userObj.email);
    expect(passwordField.value).toBe(userObj.password);
    expect(confirmPasswordField.value).toBe(userObj.password);
  });

  it('shows error message when there is an empty field', async () => {
    const user = userEvent.setup();
    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));

    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    await user.clear(usernameField);
    await user.click(screen.getByRole('button', { name: 'Update' }))

    const errMsg = screen.getByText('Missing input field');
    expect(errMsg).toBeInTheDocument();
  });

  it('shows error message when no changes are made', async () => {
    const user = userEvent.setup();
    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: 'Update' }))

    const errMsg = screen.getByText('No changes have been made');
    expect(errMsg).toBeInTheDocument();
  });

  it('shows error message when password and confirm password does not match', async () => {
    const user = userEvent.setup();
    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));
    await user.clear(screen.getByTestId('passwordField'));
    await user.type(screen.getByTestId('passwordField'), 'change');
    await user.click(screen.getByRole('button', { name: 'Update' }));

    const errMsg = screen.getByText('Password does not match');
    expect(errMsg).toBeInTheDocument();
  });

  it('correctly updates relevant database', async () => {
    const user = userEvent.setup();
    const mockedRouter = { refresh: jest.fn() };
    useRouter.mockReturnValue(mockedRouter);
    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));

    // mocked form data
    FormData = jest.fn();
    const mockedFormData = {
      get: jest.fn((arg) => {
        if (arg === 'username') return newData.username;
        if (arg === 'email') return newData.email;
        if (arg === 'password') return newData.password;
        if (arg === 'confirmPassword') return newData.password;
      }),
    };
    FormData.mockReturnValue(mockedFormData);

    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(updateDoc.mock.calls[0][1]).toEqual({ username: newData.username });
    expect(updateDoc.mock.calls[1][1]).toEqual({ email: newData.email });
    expect(updateDoc.mock.calls[2][1]).toEqual({ password: newData.password });
  });

  it('refreshes page when updated', async () => {
    const user = userEvent.setup();
    const mockedRouter = { refresh: jest.fn() };
    useRouter.mockReturnValue(mockedRouter);

    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));

    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    await user.clear(usernameField);
    await user.type(usernameField, newData.username);
    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(mockedRouter.refresh).toHaveBeenCalled();
  });

  it('shows popup when update is successful', async () => {
    const user = userEvent.setup();
    const mockedRouter = { refresh: jest.fn() };
    useRouter.mockReturnValue(mockedRouter);

    render(<EditProfile user={userObj} />);
    await user.click(screen.getByRole('button'));

    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    await user.clear(usernameField);
    await user.type(usernameField, newData.username);
    await user.click(screen.getByRole('button', { name: 'Update' }));

    const dialog = screen.getByRole('dialog', { name: 'Your profile has been updated!' });
    expect(dialog).toBeInTheDocument();
  });
});