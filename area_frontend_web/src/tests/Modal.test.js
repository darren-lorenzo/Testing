import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Components/Organisms/Modal/Modal';

describe('Modal Organism', () => {
    test('does not render when closed', () => {
        render(<Modal isOpen={false} title="Test" />);
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    test('renders content when open', () => {
        render(<Modal isOpen={true} title="Confirm" message="Are you sure?" />);
        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button clicked', () => {
        const handleConfirm = jest.fn();
        render(<Modal isOpen={true} onConfirm={handleConfirm} />);
        fireEvent.click(screen.getByText('Continuer'));
        expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when cancel button clicked', () => {
        const handleCancel = jest.fn();
        render(<Modal isOpen={true} onCancel={handleCancel} />);
        fireEvent.click(screen.getByText('Annuler'));
        expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when overlay clicked', () => {
        const handleCancel = jest.fn();
        render(<Modal isOpen={true} onCancel={handleCancel} />);
        // Overlay logic: click outer div
        // The accessible role is dialog
        fireEvent.click(screen.getByRole('dialog'));
        expect(handleCancel).toHaveBeenCalledTimes(1);
    });
});
