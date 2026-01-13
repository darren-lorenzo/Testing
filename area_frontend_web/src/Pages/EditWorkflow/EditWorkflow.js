import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../Services/authService';
import InputText from '../../Components/Atoms/Input/Input';
import Label from '../../Components/Atoms/Label/Label';
import Checkbox from '../../Components/Atoms/Checkbox/Checkbox';
import './EditWorkflow.css';

const EditWorkflow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [workflow, setWorkflow] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [actionParams, setActionParams] = useState([]);
    const [reactionParams, setReactionParams] = useState([]);
    const [actionConfig, setActionConfig] = useState({});
    const [reactionConfig, setReactionConfig] = useState({});
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        const fetchWorkflowData = async () => {
            try {
                const wfRes = await authService.getWorkflowById(id);
                if (!wfRes.success) {
                    toast.error(wfRes.error?.message || 'Failed to fetch workflow');
                    navigate('/library');
                    return;
                }
                const wfData = wfRes.data;
                setWorkflow(wfData);
                setName(wfData.name || '');
                setDescription(wfData.description || '');

                const actionServiceName = wfData.services?.[0];
                const reactionServiceName = wfData.services?.[1];

                let initialActionConfig = {};
                let initialReactionConfig = {};

                if (wfData.action_id) {
                    const actionsRes = await authService.getActions();
                    if (actionsRes.success) {
                        const matchedAction = actionsRes.data.find(a => a.id === wfData.action_id);
                        if (matchedAction && matchedAction.Params) {
                            const formattedDetails = formatParams(matchedAction.Params);
                            setActionParams(formattedDetails);

                            if (actionServiceName) {
                                const config = wfData.Params?.action?.[actionServiceName] || wfData.Params?.[actionServiceName];
                                if (config) {
                                    setActionConfig(config);
                                    initialActionConfig = config;
                                }
                            }
                        }
                    }
                }

                if (wfData.reaction_id) {
                    const reactionsRes = await authService.getReactions();
                    if (reactionsRes.success) {
                        const matchedReaction = reactionsRes.data.find(r => r.id === wfData.reaction_id);
                        if (matchedReaction && matchedReaction.Params) {
                            const formattedDetails = formatParams(matchedReaction.Params);
                            setReactionParams(formattedDetails);

                            if (reactionServiceName) {
                                const config = wfData.Params?.reaction?.[reactionServiceName] || wfData.Params?.[reactionServiceName];
                                if (config) {
                                    setReactionConfig(config);
                                    initialReactionConfig = config;
                                }
                            }
                        }
                    }
                }

                setInitialValues({
                    name: wfData.name || '',
                    description: wfData.description || '',
                    actionConfig: initialActionConfig,
                    reactionConfig: initialReactionConfig
                });

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkflowData();
    }, [id, navigate]);

    const formatParams = (paramsObj) => {
        return Object.entries(paramsObj).map(([name, type]) => ({
            name,
            type: type.toLowerCase(),
            label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            placeholder: `Enter ${name.replace(/_/g, ' ')}`,
            required: false
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!workflow || !workflow.services) {
            toast.error('Workflow data is incomplete');
            return;
        }

        const actionServiceName = workflow.services[0];
        const reactionServiceName = workflow.services[1];

        const updatedParams = {
            action: { [actionServiceName]: actionConfig },
            reaction: { [reactionServiceName]: reactionConfig }
        };

        const payload = {
            user_id: workflow.user_id,
            name,
            description,
            action_id: workflow.action_id,
            reaction_id: workflow.reaction_id,
            Params: updatedParams,
            services: workflow.services
        };

        try {
            const res = await authService.updateWorkflow(id, payload);
            if (res.success) {
                toast.success('Workflow updated successfully');
                navigate('/library');
            } else {
                toast.error(res.error?.message || 'Failed to update workflow');
            }
        } catch (error) {
            toast.error('Failed to update workflow');
        }
    };

    const renderParameterField = (param, config, setConfig) => {
        const value = config[param.name] || '';

        const handleChange = (e) => {
            const newValue = param.type === 'checkbox' ? e.target.checked : e.target.value;
            setConfig({ ...config, [param.name]: newValue });
        };

        switch (param.type) {
            case 'string':
            case 'text':
            case 'number':
            case 'time':
                return (
                    <div key={param.name} className="config-form">
                        <Label required={param.required}>{param.label}</Label>
                        <InputText
                            type={param.type === 'string' ? 'text' : param.type}
                            placeholder={param.placeholder}
                            value={value}
                            onChange={handleChange}
                            required={param.required}
                        />
                    </div>
                );
            case 'textarea':
                return (
                    <div key={param.name} className="config-form">
                        <Label required={param.required}>{param.label}</Label>
                        <textarea
                            className="form-control"
                            placeholder={param.placeholder}
                            value={value}
                            onChange={handleChange}
                            required={param.required}
                            rows={4}
                        />
                    </div>
                );
            case 'boolean':
                return (
                    <div key={param.name} className="config-form">
                        <Label required={param.required}>{param.label}</Label>
                        <select
                            className="form-control"
                            value={value}
                            onChange={handleChange}
                            required={param.required}
                        >
                            <option value="">Sélectionner</option>
                            <option value="true">Oui</option>
                            <option value="false">Non</option>
                        </select>
                    </div>
                );
            case 'select':
                return (
                    <div key={param.name} className="config-form">
                        <Label required={param.required}>{param.label}</Label>
                        <select
                            className="form-control"
                            value={value}
                            onChange={handleChange}
                            required={param.required}
                        >
                            <option value="">Select an option</option>
                            {param.options && param.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={param.name} className="config-form checkbox-field">
                        <Checkbox
                            label={param.label}
                            checked={value}
                            onChange={handleChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!workflow) return <div className="loading-container">Workflow not found</div>;

    const hasChanges = () => {
        if (!initialValues) return false;
        return (
            name !== initialValues.name ||
            description !== initialValues.description ||
            JSON.stringify(actionConfig) !== JSON.stringify(initialValues.actionConfig) ||
            JSON.stringify(reactionConfig) !== JSON.stringify(initialValues.reactionConfig)
        );
    };

    return (
        <div className="edit-workflow-container">
            <div className="edit-header">
                <h1>Edit Workflow</h1>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label>Workflow Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>

                {actionParams.length > 0 && (
                    <>
                        <h3 className="section-title">Action Parameters ({workflow.action_name?.name || workflow.action_name})</h3>
                        <div className="params-grid">
                            {actionParams.map(param =>
                                renderParameterField(param, actionConfig, setActionConfig)
                            )}
                        </div>
                    </>
                )}

                {reactionParams.length > 0 && (
                    <>
                        <h3 className="section-title">Reaction Parameters ({workflow.reaction_name?.name || workflow.reaction_name})</h3>
                        <div className="params-grid">
                            {reactionParams.map(param =>
                                renderParameterField(param, reactionConfig, setReactionConfig)
                            )}
                        </div>
                    </>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className={`save-btn ${!hasChanges() ? 'disabled' : ''}`}
                        disabled={!hasChanges()}
                    >
                        Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/workflows')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditWorkflow;
