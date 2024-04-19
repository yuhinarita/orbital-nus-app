import { render, screen } from '@testing-library/react'
import NavBar from '@/src/app/(navbar)/navbar';
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

describe('Navbar component', () => {
  it('shows website name', () => {
    render(<NavBar />);
    const title = screen.getByText('NUSMarketPlace');
    expect(title).toBeInTheDocument();
  });

  it('goes to home page when clicking website logo', async () => {
    const user = userEvent.setup();
    render(<NavBar />);
    const link = screen.getByRole('link', { name: 'NUSMarketPlace'});
    expect(link).toHaveAttribute('href', '/');
  });

  it('goes to registration page when clicking register', async () => {
    const user = userEvent.setup();
    render(<NavBar />);
    const link = screen.getByRole('link', { name: 'Register'});
    expect(link).toHaveAttribute('href', '/register');
  });

  it('goes to login page when clicking login', async () => {
    const user = userEvent.setup();
    render(<NavBar />);
    const link = screen.getByRole('link', { name: 'Login'});
    expect(link).toHaveAttribute('href', '/login');
  });
});