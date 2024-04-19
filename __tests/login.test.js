import { render, screen } from '@testing-library/react'
import Page from '@/src/app/login/page';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';

// sample login info
const loginData = {
  email: "orbital@mail.com",
  password: "orbital",
}

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../src/firebase/auth/login', () => ({
  __esModule: true,
  default: jest.fn((email, password) => {
    const result = null;
    let error = null;
    if (email !== loginData.email || password !== loginData.password) {
      error = true;
    } 
    return Promise.resolve({ result, error });
  }),
}));


describe("Login page", () => {
  it("renders form", () => {
    render(<Page />);
  });

  it("goes to home page when logged in with correct credentials", async () => {
    const user = userEvent.setup();
    const mockRouter = {
      push: jest.fn(),
    }
    useRouter.mockReturnValue(mockRouter);

    render(<Page />);
    const emailField = screen.getByTestId('emailField');
    const passwordField = screen.getByTestId('passwordField');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await user.type(emailField, loginData.email);
    await user.type(passwordField, loginData.password);
    await user.click(loginButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("shows error message when loggin in with incorrect credentials", async () => {
    const user = userEvent.setup();

    render(<Page />);
    const emailField = screen.getByTestId('emailField');
    const passwordField = screen.getByTestId('passwordField');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await user.type(emailField, "test");
    await user.type(passwordField, loginData.password);
    await user.click(loginButton);
    
    const errMsg = screen.getByText('Wrong email or password!');
    expect(errMsg).toBeInTheDocument();
  });

  it("shows error message when logging in with empty fields", async () => {
    const user = userEvent.setup();
    
    render(<Page />);
    const emailField = screen.getByTestId('emailField');
    const passwordField = screen.getByTestId('passwordField');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await user.click(loginButton);    
    const errMsg = screen.getByText('Missing input field');
    expect(errMsg).toBeInTheDocument();
  });

  it("goes to registration page when clicking don't have an account?", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const link = screen.getByRole('link', { name: 'Register here' });
    expect(link).toHaveAttribute('href', '/register');
  });
});