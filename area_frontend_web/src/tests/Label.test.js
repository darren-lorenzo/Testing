import React from 'react';
import { render, screen } from '@testing-library/react';
import Label from '../Components/Atoms/Label/Label';

describe('Label Component', () => {
    test('renders children correctly', () => {
        render(<Label htmlFor="test-input">Test Label</Label>);
        const label = screen.getByText('Test Label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', 'test-input');
    });

    test('shows required asterisk when required prop is true', () => {
        render(<Label required>Required Label</Label>);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('applies custom class', () => {
        const { container } = render(<Label className="custom-class">Label</Label>);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
