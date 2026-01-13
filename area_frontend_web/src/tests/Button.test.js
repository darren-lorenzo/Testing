import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Components/Atoms/Button/Button';

describe('Button Component', () => {
    test('renders button with correct text', () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('is disabled when disabled prop is true', () => {
        render(<Button disabled>Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: /Click Me/i });
        expect(buttonElement).toBeDisabled();
    });

    test('shows loading state properly', () => {
        render(<Button isLoading>Click Me</Button>);
        const loader = screen.getByText(/loading..../i);
        expect(loader).toBeInTheDocument();
        expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
    });
});
