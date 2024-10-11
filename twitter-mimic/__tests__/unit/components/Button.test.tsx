import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/ui/components/Button';

describe('Button component', () => {
    it('should render the button with children text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    })

    it('should apply the custom className', () => {
        render(<Button className='tweet-btn'>Click me</Button>);
        const button = screen.getByText('Click me');
        expect(button).toHaveClass('tweet-btn');
    })

    it('should call onClick when clicked', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        fireEvent.click(screen.getByText('Click me'))

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should pass additional props to button element', () => {
        render(<Button data-testid="disabled-button" disabled>Click me</Button>);
        const button = screen.getByTestId('disabled-button');
        expect(button).toBeDisabled();
    })

    it('should handle aria-disabled correctly', () => {
        render(<Button aria-disabled="true">Disabled Button</Button>)
        const button = screen.getByText('Disabled Button')
        expect(button).toHaveAttribute('aria-disabled', 'true')
        expect(button).toHaveClass('aria-disabled:cursor-not-allowed')
    })
})