import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceHeader from '../Components/Organisms/ServiceHeader/ServiceHeader';

describe('ServiceHeader Organism', () => {
    const mockService = {
        name: 'Spotify',
        logo: 'spotify.png',
        description: 'Music for everyone',
        color: '#1DB954',
        connection_info: null
    };

    test('renders service info', () => {
        render(<ServiceHeader service={mockService} />);
        expect(screen.getByText('Spotify')).toBeInTheDocument();
        expect(screen.getByText('Music for everyone')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('alt', 'Spotify');
    });

    test('shows Connect button when not connected', () => {
        render(<ServiceHeader service={mockService} />);
        expect(screen.getByText('Connect Service')).toBeInTheDocument();
    });

    test('shows Create Workflow button when connected', () => {
        const connectedService = { ...mockService, connection_info: true };
        render(<ServiceHeader service={connectedService} />);
        expect(screen.getByText('Create Workflow')).toBeInTheDocument();
    });

    test('calls onConnect when Connect clicked', () => {
        const handleConnect = jest.fn();
        render(<ServiceHeader service={mockService} onConnect={handleConnect} />);
        fireEvent.click(screen.getByText('Connect Service'));
        expect(handleConnect).toHaveBeenCalledTimes(1);
    });
});
