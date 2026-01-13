import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatCard from '../Components/Molecules/StatCard/StatCard';

describe('StatCard Molecule', () => {
    test('renders title and count', () => {
        render(<StatCard title="Total Users" count={100} icon={<span>Icon</span>} />);
        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    test('renders action button and handles click', () => {
        const handleAction = jest.fn();
        render(<StatCard title="Stats" actionLabel="View More" onAction={handleAction} />);

        const button = screen.getByText('View More');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(handleAction).toHaveBeenCalledTimes(1);
    });

    test('renders children content', () => {
        render(<StatCard title="Chart"><div>Chart Content</div></StatCard>);
        expect(screen.getByText('Chart Content')).toBeInTheDocument();
    });
});
