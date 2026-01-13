import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from '../Components/Organisms/Accordion/Accordion';

describe('Accordion Organism', () => {
    const items = [
        { title: 'Section 1', content: <p>Content 1</p> },
        { title: 'Section 2', content: <p>Content 2</p> }
    ];

    test('renders all items', () => {
        render(<Accordion items={items} />);
        expect(screen.getByText('Section 1')).toBeInTheDocument();
        expect(screen.getByText('Section 2')).toBeInTheDocument();
        expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    test('toggles sections', () => {
        render(<Accordion items={items} />);

        // Initial state: first item open (logic in component: useState(0))
        const content1 = screen.getByText('Content 1').closest('.accordion-content');
        expect(content1).toHaveStyle('max-height: 1000px'); // Implementation detail check

        // Click second item
        fireEvent.click(screen.getByText('Section 2'));

        // Check first item closed (or closure logic)
        // Since we check styles, we assume it updates state.
        // Wait, the component sets openIndex.

        const content2 = screen.getByText('Content 2').closest('.accordion-content');
        expect(content2).toHaveStyle('max-height: 1000px');
        expect(content1).not.toHaveStyle('max-height: 1000px');
    });
});
