import { render, screen } from '@testing-library/react'
import AccountMenu from '@/src/app/(navbar)/accountMenu';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';

// sample user object for useAuthContext
const userObj = {
  user: {
    email: "orbital@mail.com",
    uid: "r4GlPdjHwXf2355HGs8PHagWv493",
  }
};

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

jest.mock('../src/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => userObj),
}))

describe('AccountMenu component', () => {
  it('shows dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const dropdownMenu = screen.getByRole('menu');
    expect(dropdownMenu).toBeInTheDocument();
  });

  it('shows My Account in the list of drop down menu', async () => {
    const user = userEvent.setup();
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const menuItem = screen.getByRole('menuitem', { name: 'My Account' });
    expect(menuItem).toBeInTheDocument();
  });

  it('shows List Item in the list of drop down menu', async () => {
    const user = userEvent.setup();
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const menuItem = screen.getByRole('menuitem', { name: 'List Item' });
    expect(menuItem).toBeInTheDocument();
  });

  it('shows Logout button in the list of drop down menu', async () => {
    const user = userEvent.setup();
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const menuItem = screen.getByRole('menuitem', { name: 'Logout' });
    expect(menuItem).toBeInTheDocument();
  });

  it('goes to dashboard when clicking My Account', async () => {
    const user = userEvent.setup();
    const mockRouter = {
      push: jest.fn(),
    }
    useRouter.mockReturnValue(mockRouter);
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const menuItem = screen.getByRole('menuitem', { name: 'My Account' });
    await user.click(menuItem);
    expect(mockRouter.push).toHaveBeenCalledWith(`/dashboard?u=${userObj.user.uid}`);
  });

  it('goes to listing page when clicking List Item', async () => {
    const user = userEvent.setup();
    const mockRouter = {
      push: jest.fn(),
    }
    useRouter.mockReturnValue(mockRouter);
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const menuItem = screen.getByRole('menuitem', { name: 'List Item' });
    await user.click(menuItem);
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/list');
  });

  it('goes to home page when clicking Logout', async () => {
    const user = userEvent.setup();
    const mockRouter = {
      replace: jest.fn(),
    }
    useRouter.mockReturnValue(mockRouter);
    render(<AccountMenu />);

    await user.click(screen.getByRole('button'));
    const menuItem = screen.getByRole('menuitem', { name: 'Logout' });
    await user.click(menuItem);
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });
});