import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkflowCard from '../Components/Molecules/WorkflowCard/WorkflowCard';

describe('WorkflowCard Molecule', () => {
    const mockWorkflow = {
        id: 1,
        name: 'My Workflow',
        description: 'Auto reply',
        is_active: true,
        action_name: {
            name: 'Receive Email',
            logo: 'gmail.png'
        },
        reaction_name: {
            name: 'Send Slack',
            logo: 'slack.png'
        },
        color: '#ff0000'
    };

    test('renders workflow details', () => {
        render(<WorkflowCard workflow={mockWorkflow} />);
        expect(screen.getByText('My Workflow')).toBeInTheDocument();
        expect(screen.getByText('Auto reply')).toBeInTheDocument();
        expect(screen.getByText('Receive Email')).toBeInTheDocument();
        expect(screen.getByText('Send Slack')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    test('renders inactive state', () => {
        const inactiveWorkflow = { ...mockWorkflow, is_active: false };
        render(<WorkflowCard workflow={inactiveWorkflow} />);
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    test('handles edit action', () => {
        const handleEdit = jest.fn();
        render(<WorkflowCard workflow={mockWorkflow} onClick={handleEdit} />);

        const editBtn = screen.getByText('Modifier');
        fireEvent.click(editBtn);
        expect(handleEdit).toHaveBeenCalledTimes(1);
    });

    test('handles delete action', () => {
        const handleDelete = jest.fn();
        render(<WorkflowCard workflow={mockWorkflow} onDelete={handleDelete} />);

        const deleteBtn = screen.getByText('Supprimer');
        fireEvent.click(deleteBtn);
        expect(handleDelete).toHaveBeenCalledTimes(1);
    });
});
