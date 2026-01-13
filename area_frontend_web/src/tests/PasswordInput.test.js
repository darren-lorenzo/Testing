import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from '../Components/Atoms/PasswordInput/PasswordInput';

describe('PasswordInput Component', () => {
    test('renders with default placeholder', () => {
        render(<PasswordInput />);
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    test('toggles password visibility', () => {
        render(<PasswordInput />);
        const input = screen.getByPlaceholderText('••••••••');
        const toggleButton = screen.getByRole('button');

        // Initially password type
        expect(input).toHaveAttribute('type', 'password');

        // Click to show password
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'text');

        // Click to hide password
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'password');
    });

    test('shows error state', () => {
        render(<PasswordInput hasError />);
        const input = screen.getByPlaceholderText('••••••••');
        expect(input).toHaveClass('wcp-password-input--error');
    });

    test('calls onChange handler', () => {
        const handleChange = jest.fn();
        render(<PasswordInput onChange={handleChange} />);
        const input = screen.getByPlaceholderText('••••••••');
        fireEvent.change(input, { target: { value: 'password123' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
