import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from '../Components/Atoms/Divider/Divider';

describe('Divider Component', () => {
    test('renders correctly', () => {
        const { container } = render(<Divider />);
        expect(container.firstChild).toHaveClass('divider');
    });

    test('renders children when provided', () => {
        render(<Divider>OR</Divider>);
        expect(screen.getByText('OR')).toBeInTheDocument();
    });

    test('applies variant and orientation classes', () => {
        const { container } = render(<Divider orientation="vertical" variant="dashed" />);
        expect(container.firstChild).toHaveClass('divider--vertical');
        expect(container.firstChild).toHaveClass('divider--dashed');
    });
});
