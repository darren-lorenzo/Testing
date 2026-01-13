import React from 'react';
import { render, screen } from '@testing-library/react';
import Stepper from '../Components/Organisms/Stepper/Stepper';

describe('Stepper Organism', () => {
    const steps = ['Step 1', 'Step 2', 'Step 3'];

    test('renders all steps', () => {
        render(<Stepper steps={steps} currentStep={0} />);
        steps.forEach(step => {
            expect(screen.getByText(step)).toBeInTheDocument();
        });
    });

    test('marks current step as active', () => {
        const { container } = render(<Stepper steps={steps} currentStep={1} />);
        // Step 1 (index 0) completed
        // Step 2 (index 1) active
        // Step 3 (index 2) inactive

        // We verify visual indicators or classes.
        // Implementation uses classes: active, completed
        const items = container.querySelectorAll('.step-item');
        expect(items[1]).toHaveClass('active');
        expect(items[0]).toHaveClass('completed');
    });
});
