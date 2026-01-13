import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../Components/Atoms/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../Context/AuthContext';

// Mock useAuth
jest.mock('../Context/AuthContext', () => ({
    useAuth: jest.fn()
}));

describe('ProtectedRoute Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders loading state', () => {
        useAuth.mockReturnValue({ loading: true });
        render(
            <MemoryRouter>
                <ProtectedRoute />
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders child routes when authenticated', () => {
        useAuth.mockReturnValue({
            loading: false,
            token: 'fake-token',
            hasVisited: true,
            markAsVisited: jest.fn()
        });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to /home on first visit (unauthenticated)', () => {
        const markAsVisited = jest.fn();
        useAuth.mockReturnValue({
            loading: false,
            token: null,
            hasVisited: false,
            markAsVisited
        });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                    <Route path="/home" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Home Page')).toBeInTheDocument();
        expect(markAsVisited).toHaveBeenCalled();
    });

    test('redirects to /login on subsequent visits (unauthenticated)', () => {
        useAuth.mockReturnValue({
            loading: false,
            token: null,
            hasVisited: true,
            markAsVisited: jest.fn()
        });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});
