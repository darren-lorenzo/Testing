import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import WorkflowCard from '../../Components/Molecules/WorkflowCard/WorkflowCard';
import authServiceInstance from '../../Services/authService';
import Button from '../../Components/Atoms/Button/Button';
import Modal from '../../Components/Organisms/Modal/Modal';
import './Library.css';

const Library = () => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = authServiceInstance.getUserID();

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const [wfResponse, servicesResponse, actionsResponse, reactionsResponse] = await Promise.all([
                authServiceInstance.getWorkflows(userId),
                authServiceInstance.getServices(),
                authServiceInstance.getActions(),
                authServiceInstance.getReactions()
            ]);

            if (wfResponse.success && servicesResponse.success) {
                const services = Array.isArray(servicesResponse.data) ? servicesResponse.data : [];
                const actionsData = Array.isArray(actionsResponse.data) ? actionsResponse.data : [];
                const reactionsData = Array.isArray(reactionsResponse.data) ? reactionsResponse.data : [];

                const enrichedWorkflows = (Array.isArray(wfResponse.data) ? wfResponse.data : []).map(workflow => {
                    const actionInfo = actionsData.find(a => a.id === workflow.action_id);
                    const reactionInfo = reactionsData.find(r => r.id === workflow.reaction_id);

                    const actionServiceKey = workflow.services?.[0];
                    const reactionServiceKey = workflow.services?.[1];

                    const actionServiceInfo = services.find(s =>
                        s.service === actionServiceKey ||
                        s.name?.toLowerCase() === actionServiceKey
                    );
                    const reactionServiceInfo = services.find(s =>
                        s.service === reactionServiceKey ||
                        s.name?.toLowerCase() === reactionServiceKey
                    );

                    const [actionName, reactionName] = workflow.description.split(" → ");


                    return {
                        ...workflow,
                        color: actionServiceInfo?.color || 'rgba(253, 252, 252, 1)',
                        action_name: {
                            name: actionName || 'Action inconnue',
                            logo: actionServiceInfo?.logo || ''
                        },
                        reaction_name: {
                            name: reactionName || 'Réaction inconnue',
                            logo: reactionServiceInfo?.logo || ''
                        }
                    };
                });
                setWorkflows(enrichedWorkflows);
            } else {
                setError(wfResponse.message || "Impossible de récupérer les workflows.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditWorkflow = (workflow) => {
        navigate(`/workflow/${workflow.id}/edit`);
    };

    const handleCreateWorkflow = () => {
        navigate('/create');
    };

    const [workflowToDelete, setWorkflowToDelete] = useState(null);

    const handleDeleteClick = (workflow) => {
        setWorkflowToDelete(workflow);
    };

    const handleToggleActive = async (workflow) => {
        const newStatus = !workflow.is_active;
        try {
            const res = await authServiceInstance.updateWorkflow(workflow.id, { is_active: newStatus });
            if (res.success) {
                setWorkflows(workflows.map(w =>
                    w.id === workflow.id ? { ...w, is_active: newStatus } : w
                ));
                toast.success(`Workflow ${newStatus ? 'activé' : 'désactivé'} avec succès`);
            } else {
                toast.error(res.error?.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const confirmDelete = async () => {
        if (!workflowToDelete) return;
        try {
            const res = await authServiceInstance.deleteWorkflow(workflowToDelete.id);
            if (res.success) {
                setWorkflows(workflows.filter(w => w.id !== workflowToDelete.id));
                toast.success('Workflow supprimé avec succès');
            } else {
                toast.error(res.error?.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la suppression');
        } finally {
            setWorkflowToDelete(null);
        }
    };

    const cancelDelete = () => {
        setWorkflowToDelete(null);
    };

    return (
        <div className="library-page">
            <header className="library-header">
                <h1>Ma Librairie</h1>
                <p>Gérez vos workflows et automatisations AREA</p>
            </header>
            {error && <p className="error-container">{error}</p>}
            {loading ? (
                <p>Chargement des workflows...</p>
            ) : (
                workflows.length === 0 ? (
                    <div className="library-empty">
                        <p>Vous n'avez aucun workflow pour le moment.</p>
                        <Button
                            onClick={handleCreateWorkflow}
                            variant="primary"
                            label="Créer un workflow"
                        />
                    </div>
                ) : (
                    <div className="workflow-grid">
                        {workflows.map((workflow) => (
                            <WorkflowCard
                                key={workflow.id}
                                workflow={workflow}
                                onClick={() => handleEditWorkflow(workflow)}
                                onDelete={() => handleDeleteClick(workflow)}
                                onToggleActive={handleToggleActive}
                            />
                        ))}
                    </div>
                )
            )}
            <Modal
                isOpen={!!workflowToDelete}
                title="Supprimer le workflow"
                message="Voulez-vous vraiment supprimer ce workflow ? Cette action est irréversible."
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default Library;
