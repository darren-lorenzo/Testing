import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../Components/Atoms/Card/Card';

describe('Card Component', () => {
    test('renders children correctly', () => {
        render(<Card>Test Content</Card>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('applies additional classes', () => {
        const { container } = render(<Card className="extra-class">Content</Card>);
        expect(container.firstChild).toHaveClass('atom-card');
        expect(container.firstChild).toHaveClass('extra-class');
    });

    test('passes props to the container', () => {
        render(<Card data-testid="test-card">Content</Card>);
        expect(screen.getByTestId('test-card')).toBeInTheDocument();
    });
});
