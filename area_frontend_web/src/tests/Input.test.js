import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Components/Atoms/Input/Input';

describe('Input Component', () => {
    test('renders input with placeholder', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    test('handles value change', () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Value' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('shows error state', () => {
        render(<Input hasError />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('wcp-input--error');
    });

    test('renders correct type', () => {
        const { container } = render(<Input type="email" />);
        const input = container.querySelector('input');
        expect(input).toHaveAttribute('type', 'email');
    });
});
