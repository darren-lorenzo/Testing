import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceCard from '../Components/Molecules/ServiceCard/ServiceCard';

describe('ServiceCard Molecule', () => {
    const mockService = {
        id: 1,
        name: 'Google',
        logo: 'google.png',
        color: '#4285F4',
        service: 'google'
    };

    test('renders service details', () => {
        render(<ServiceCard service={mockService} isConnected={true} />);
        expect(screen.getByText('Google')).toBeInTheDocument();
        expect(screen.getByText('Connected')).toBeInTheDocument();
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('alt', 'Google logo');
    });

    test('shows disconnected status', () => {
        render(<ServiceCard service={mockService} isConnected={false} />);
        expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    test('handles click', () => {
        const handleToggle = jest.fn();
        render(<ServiceCard service={mockService} onToggle={handleToggle} />);

        // Find the card container
        // Since Card renders children, we try to click something distinctive inside or we assume role (but Card is a div)
        // We can use the service name as click target or container
        fireEvent.click(screen.getByText('Google'));
        expect(handleToggle).toHaveBeenCalledWith(mockService);
    });
});
