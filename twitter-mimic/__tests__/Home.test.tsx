// __tests__/Home.test.tsx
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { useRouter } from 'next/navigation';

// Mock del useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Page', () => {
  it('renders a heading', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
