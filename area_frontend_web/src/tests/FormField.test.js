import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from '../Components/Molecules/FormField/FormField';

describe('FormField Molecule', () => {
    test('renders label and input', () => {
        render(<FormField label="Email" placeholder="Enter email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    test('renders password input when type is password', () => {
        const { container } = render(<FormField type="password" label="Password" />);
        // PasswordInput usually renders a container div
        expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    });

    test('shows error message', () => {
        render(<FormField label="Username" error="Username is required" />);
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveClass('wcp-input--error');
    });
});
