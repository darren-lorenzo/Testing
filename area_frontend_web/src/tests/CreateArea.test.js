import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateArea from '../Pages/CreateArea/CreateArea';
import authService from '../Services/authService';

// Mock authService
jest.mock('../Services/authService', () => ({
    getServices: jest.fn(),
    getServiceById: jest.fn(),
    getActionByName: jest.fn(),
    getReactionByName: jest.fn(),
    createWorkflow: jest.fn(),
    getUserID: jest.fn(),
    getUser: jest.fn()
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

describe('CreateArea Integration Test', () => {
    // Dummy Data
    const mockServices = [
        { id: 1, name: 'Google', logo: 'google.png' },
        { id: 2, name: 'Spotify', logo: 'spotify.png' }
    ];

    const mockActions = [
        { name: 'Receive Email', description: 'Triggers when email received' }
    ];

    const mockReactions = [
        { name: 'Add Track', description: 'Adds a track to playlist' }
    ];

    const mockActionDetails = {
        id: 101,
        name: 'Receive Email',
        Params: {
            subject: 'string',
            important: 'checkbox'
        }
    };

    const mockReactionDetails = {
        id: 202,
        name: 'Add Track',
        Params: {
            playlist_id: 'string'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        authService.getUserID.mockReturnValue(1);
        authService.getUser.mockResolvedValue({
            success: true,
            data: {
                info: {
                    google: { isConnected: true },
                    spotify: { isConnected: true }
                }
            }
        });
        authService.getServices.mockResolvedValue({ success: true, data: mockServices });
        authService.getServiceById.mockImplementation((id) => {
            if (id === 1) return Promise.resolve({ success: true, data: { actions: mockActions } }); // Google
            if (id === 2) return Promise.resolve({ success: true, data: { reactions: mockReactions } }); // Spotify
            return Promise.resolve({ success: false });
        });
        authService.getActionByName.mockResolvedValue({ success: true, data: mockActionDetails });
        authService.getReactionByName.mockResolvedValue({ success: true, data: mockReactionDetails });
        authService.createWorkflow.mockResolvedValue({ success: true });
    });

    const fillStep = async (stepIndex) => {
        // Helper to advance steps
        const nextButton = screen.getByText(stepIndex === 7 ? 'Create Workflow' : 'Next');
        fireEvent.click(nextButton);
    };

    test('completes the full workflow creation wizard', async () => {
        render(
            <MemoryRouter>
                <CreateArea />
            </MemoryRouter>
        );

        // Step 0: Name Workflow
        await waitFor(() => expect(screen.getByText('Name Your Workflow')).toBeInTheDocument());
        fireEvent.change(screen.getByPlaceholderText('e.g., Save Gmail attachments to OneDrive'), {
            target: { value: 'My Test Workflow' }
        });
        fireEvent.click(screen.getByText('Next'));

        // Step 1: Action Service
        await waitFor(() => expect(screen.getByText('Select a Service for the Action')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Google'));
        fireEvent.click(screen.getByText('Next'));

        // Step 2: Choose Action
        await waitFor(() => expect(screen.getByText('Select an Action')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Receive Email'));
        fireEvent.click(screen.getByText('Next'));

        // Step 3: Configure Action
        await waitFor(() => expect(screen.getByText('Configure Action: Receive Email')).toBeInTheDocument());
        fireEvent.change(screen.getByPlaceholderText('Enter subject'), { target: { value: 'Hello' } });
        fireEvent.click(screen.getByLabelText('Important')); // Checkbox
        fireEvent.click(screen.getByText('Next'));

        // Step 4: Reaction Service
        await waitFor(() => expect(screen.getByText('Select a Service for the Reaction')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Spotify'));
        fireEvent.click(screen.getByText('Next'));

        // Step 5: Choose Reaction
        await waitFor(() => expect(screen.getByText('Select a Reaction')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Add Track'));
        fireEvent.click(screen.getByText('Next'));

        // Step 6: Configure Reaction
        await waitFor(() => expect(screen.getByText('Configure Reaction: Add Track')).toBeInTheDocument());
        fireEvent.change(screen.getByPlaceholderText('Enter playlist id'), { target: { value: 'playlist-123' } });
        fireEvent.click(screen.getByText('Next'));

        // Step 7: Summary
        await waitFor(() => expect(screen.getByText('Workflow Summary')).toBeInTheDocument());
        expect(screen.getByText('My Test Workflow')).toBeInTheDocument();

        // Submit
        fireEvent.click(screen.getByText('Create Workflow'));

        await waitFor(() => {
            expect(authService.createWorkflow).toHaveBeenCalledWith({
                user_id: 1,
                description: 'Google Receive Email → Spotify Add Track',
                name: 'My Test Workflow',
                action_id: 101,
                reaction_id: 202,
                Params: {
                    action: {
                        google: { subject: 'Hello', important: true }
                    },
                    reaction: {
                        spotify: { playlist_id: 'playlist-123' }
                    }
                },
                services: ['google', 'spotify']
            });
        });
    });
});
