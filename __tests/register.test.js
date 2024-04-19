import { render, screen } from '@testing-library/react'
import Page from '@/src/app/register/page';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import addData from '@/src/firebase/firestore/addData';

// sample registration info
const newData = {
  email: "newemail@mail.com",
  password: "newpass",
  username: "newuser",
  uid: 'test',
  avgRating: 0,
  numRatedUsers: 0,
}

const existingData = {
  email: "orbital@mail.com",
  password: "orbital",
}

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../src/firebase/auth/register', () => ({
  __esModule: true,
  default: jest.fn((email, password) => {
    const result = {
      user: {
        email: email,
        uid: newData.uid,
      }
    };
    let error = null;

    if (password.length < 6) {
      error = new Error('password length');
    } else if (email === existingData.email) {
      error = new Error('email taken');
    } else if (!email.includes('@')) {
      error = new Error('incorrect email');
    }
    return Promise.resolve({ result, error });
  }),
}));

jest.mock('../src/firebase/firestore/addData', () => ({
  __esModule: true,
  default: jest.fn((collection, key, obj) => {}),
}));

describe("Register page", () => {
  it("renders form", () => {
    render(<Page />);
  });

  it("shows error message when password length is shorter than 6", async () => {
    const user = userEvent.setup();

    render(<Page />);
    const emailField = screen.getByRole('textbox', { name: 'Email Address' });
    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');
    const button = screen.getByRole('button', { name: 'Register' });

    await user.type(emailField, newData.email);
    await user.type(usernameField, newData.username);
    await user.type(passwordField, "test");
    await user.type(confirmPasswordField, "test");
    await user.click(button);

    const errMsg = screen.getByText('Error: password length');
    expect(errMsg).toBeInTheDocument();
  });

  it("shows error message when email has been taken", async () => {
    const user = userEvent.setup();

    render(<Page />);
    const emailField = screen.getByRole('textbox', { name: 'Email Address' });
    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');
    const button = screen.getByRole('button', { name: 'Register' });

    await user.type(emailField, existingData.email);
    await user.type(usernameField, newData.username);
    await user.type(passwordField, newData.password);
    await user.type(confirmPasswordField, newData.password);
    await user.click(button);

    const errMsg = screen.getByText('Error: email taken');
    expect(errMsg).toBeInTheDocument();
  });

  it("shows error message when email is in incorrect format", async () => {
    const user = userEvent.setup();

    render(<Page />);
    const emailField = screen.getByRole('textbox', { name: 'Email Address' });
    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');
    const button = screen.getByRole('button', { name: 'Register' });

    await user.type(emailField, "testmail.com");
    await user.type(usernameField, newData.username);
    await user.type(passwordField, newData.password);
    await user.type(confirmPasswordField, newData.password);
    await user.click(button);

    const errMsg = screen.getByText('Error: incorrect email');
    expect(errMsg).toBeInTheDocument();
  });

  it("shows error message when password and confirmation password does not match", async () => {
    const user = userEvent.setup();

    render(<Page />);
    const emailField = screen.getByRole('textbox', { name: 'Email Address' });
    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');
    const button = screen.getByRole('button', { name: 'Register' });

    await user.type(emailField, "testmail.com");
    await user.type(usernameField, newData.username);
    await user.type(passwordField, newData.password);
    await user.type(confirmPasswordField, "test");
    await user.click(button);

    const errMsg = screen.getByText('Password does not match');
    expect(errMsg).toBeInTheDocument();
  });

  it("shows error message when register button pressed with empty fields", async () => {
    const user = userEvent.setup();

    render(<Page />);
    const button = screen.getByRole('button', { name: 'Register' });

    await user.click(button);

    const errMsg = screen.getByText('Missing input field');
    expect(errMsg).toBeInTheDocument();
  });

  it("goes to login page when clicking already have an account", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const button = screen.getByRole('link', { name: 'Login' });
    expect(button).toHaveAttribute('href', '/login')
  });

  it("correctly updates the database when registering", async () => {
    const user = userEvent.setup();
    const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    render(<Page />);
    const emailField = screen.getByRole('textbox', { name: 'Email Address' });
    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');
    const button = screen.getByRole('button', { name: 'Register' });

    await user.type(emailField, newData.email);
    await user.type(usernameField, newData.username);
    await user.type(passwordField, newData.password);
    await user.type(confirmPasswordField, newData.password);
    await user.click(button);

    expect(addData).toHaveBeenCalledWith('users', newData.uid, newData);
  });

  it("goes to home page when successfully registered an account", async () => {
    const user = userEvent.setup();
    const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    render(<Page />);
    const emailField = screen.getByRole('textbox', { name: 'Email Address' });
    const usernameField = screen.getByRole('textbox', { name: 'Username' });
    const passwordField = screen.getByTestId('passwordField');
    const confirmPasswordField = screen.getByTestId('confirmPasswordField');
    const button = screen.getByRole('button', { name: 'Register' });

    await user.type(emailField, newData.email);
    await user.type(usernameField, newData.username);
    await user.type(passwordField, newData.password);
    await user.type(confirmPasswordField, newData.password);
    await user.click(button);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});