import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Components/Organisms/Sidebar/Sidebar';

// Mock useAuth
const mockLogout = jest.fn();
jest.mock('../Context/AuthContext', () => ({
    useAuth: () => ({
        logout: mockLogout
    })
}));

describe('Sidebar Organism', () => {
    test('renders navigation links', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={() => { }} />
            </MemoryRouter>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Librairie')).toBeInTheDocument();
    });

    test('calls logout when button clicked', () => {
        render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={() => { }} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Déconnexion'));
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test('applies open class', () => {
        const { container } = render(
            <MemoryRouter>
                <Sidebar isOpen={true} onClose={() => { }} />
            </MemoryRouter>
        );
        // Sidebar component sets this class on the wrapper div
        expect(container.firstChild).toHaveClass('open');
    });
});
