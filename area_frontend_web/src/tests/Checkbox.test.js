import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../Components/Atoms/Checkbox/Checkbox';

describe('Checkbox Component', () => {
    test('renders with label', () => {
        render(<Checkbox label="Accept Terms" onChange={() => { }} />);
        expect(screen.getByText('Accept Terms')).toBeInTheDocument();
    });

    test('handles checked state', () => {
        render(<Checkbox checked readOnly />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    test('calls onChange when clicked', () => {
        const handleChange = jest.fn();
        render(<Checkbox onChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('is disabled when disabled prop is true', () => {
        render(<Checkbox disabled />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });
});
