import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from '../Components/Atoms/Icon/Icon';

describe('Icon Component', () => {
    test('renders image with src and alt', () => {
        render(<Icon src="test.png" alt="Test Icon" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'test.png');
        expect(img).toHaveAttribute('alt', 'Test Icon');
    });

    test('applies size classes', () => {
        const { container } = render(<Icon size="lg" src="test.png" alt="icon" />);
        expect(container.firstChild).toHaveClass('wcp-icon--lg');
    });
});
