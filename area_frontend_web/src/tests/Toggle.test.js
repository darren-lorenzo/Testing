import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toggle from '../Components/Atoms/Toggle/Toggle';

describe('Toggle Component', () => {
    test('renders with label', () => {
        render(<Toggle label="Notification" />);
        expect(screen.getByText('Notification')).toBeInTheDocument();
    });

    test('handles change events', () => {
        const handleChange = jest.fn();
        render(<Toggle checked={false} onChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');

        fireEvent.click(checkbox);
        // The component calls onChange(!checked)
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    test('is disabled', () => {
        render(<Toggle disabled />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });
});
