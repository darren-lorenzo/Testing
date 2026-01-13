import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Stepper from '../../Components/Organisms/Stepper/Stepper';
import Accordion from '../../Components/Organisms/Accordion/Accordion';
import Button from '../../Components/Atoms/Button/Button';
import InputText from '../../Components/Atoms/Input/Input';
import Label from '../../Components/Atoms/Label/Label';
import Checkbox from '../../Components/Atoms/Checkbox/Checkbox';
import authService from '../../Services/authService';
import './CreateArea.css';
import Modal from '../../Components/Organisms/Modal/Modal';

const CreateArea = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [services, setServices] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);

    const [actionService, setActionService] = useState(null);
    const [action, setAction] = useState(null);
    const [actionConfig, setActionConfig] = useState({});
    const [actionDetail, setActionDetail] = useState(null);

    const [reactionService, setReactionService] = useState(null);
    const [reaction, setReaction] = useState(null);
    const [reactionConfig, setReactionConfig] = useState({});
    const [reactionDetail, setReactionDetail] = useState(null);

    const [availableActions, setAvailableActions] = useState([]);
    const [availableReactions, setAvailableReactions] = useState([]);

    const [actionParameters, setActionParameters] = useState([]);
    const [reactionParameters, setReactionParameters] = useState([]);

    const [workflowName, setWorkflowName] = useState('');

    const steps = [
        'Name Workflow',
        'Action Service',
        'Choose Action',
        'Configure Action',
        'Reaction Service',
        'Choose Reaction',
        'Configure Reaction',
        'Summary'
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await authService.getServices();
                const userRes = await authService.getUser(authService.getUserID());

                if (res.success && userRes.success) {
                    setUserInfo(userRes.data);
                    const allServices = Array.isArray(res.data) ? res.data : [];
                    const connectedServices = allServices.filter(service => {
                        const serviceKey = (service.service || service.name || '').toLowerCase();
                        const isPublic = !authService.needsAuth(serviceKey);
                        const isConnected = userRes.data?.info?.[serviceKey]?.isConnected || false;
                        return isPublic || isConnected;
                    });
                    setServices(connectedServices);
                }
            } catch (err) {
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const fetchActions = async () => {
            if (actionService) {
                const res = await authService.getServiceById(actionService.id);
                if (res.success) {
                    setAvailableActions(res.data.actions || []);
                }
            }
        };
        fetchActions();
    }, [actionService]);

    useEffect(() => {
        const fetchReactions = async () => {
            if (reactionService) {
                const res = await authService.getServiceById(reactionService.id);
                if (res.success) {
                    setAvailableReactions(res.data.reactions || []);
                }
            }
        };
        fetchReactions();
    }, [reactionService]);

    useEffect(() => {
        const fetchActionParams = async () => {
            if (action && actionService) {
                const res = await authService.getActionByName(action.name);
                if (res.success && res.data && res.data.Params) {
                    setActionDetail(res.data);
                    const formattedParams = Object.entries(res.data.Params).map(([name, type]) => ({
                        name,
                        type: type.toLowerCase(),
                        label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        placeholder: `Enter ${name.replace(/_/g, ' ')}`,
                        required: false
                    }));

                    setActionParameters(formattedParams);

                    const initialConfig = {};
                    formattedParams.forEach(param => {
                        initialConfig[param.name] = param.type === 'checkbox' ? false : '';
                    });
                    setActionConfig(initialConfig);
                } else {
                    setActionParameters([]);
                    setActionConfig({});
                }
            }
        };
        fetchActionParams();
    }, [action, actionService]);

    useEffect(() => {
        const fetchReactionParams = async () => {
            if (reaction && reactionService) {
                const res = await authService.getReactionByName(reaction.name);
                if (res.success && res.data && res.data.Params) {
                    setReactionDetail(res.data);
                    const formattedParams = Object.entries(res.data.Params).map(([name, type]) => ({
                        name,
                        type: type.toLowerCase(),
                        label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        placeholder: `Enter ${name.replace(/_/g, ' ')}`,
                        required: false
                    }));

                    setReactionParameters(formattedParams);

                    const initialConfig = {};
                    formattedParams.forEach(param => {
                        initialConfig[param.name] = param.type === 'checkbox' ? false : '';
                    });
                    setReactionConfig(initialConfig);
                } else {
                    setReactionParameters([]);
                    setReactionConfig({});
                }
            }
        };
        fetchReactionParams();
    }, [reaction, reactionService]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleMoreServices = () => {
        setShowUnsavedModal(true);
    };

    const handleConfirmNavigate = () => {
        setShowUnsavedModal(false);
        navigate('/services');
    };

    const handleCancelModal = () => {
        setShowUnsavedModal(false);
    };

    const handleSubmit = async () => {
        const userId = authService.getUserID();
        const description = `${actionService?.name} ${action?.name} → ${reactionService?.name} ${reaction?.name}`;

        const params = {
            action: {
                [actionService?.name.toLowerCase()]: actionConfig
            },
            reaction: {
                [reactionService?.name.toLowerCase()]: reactionConfig
            }
        };

        const workflowPayload = {
            user_id: parseInt(userId),
            description: description,
            name: workflowName,
            action_id: actionDetail?.id,
            reaction_id: reactionDetail?.id,
            Params: params,
            services: [actionService?.name.toLowerCase(), reactionService?.name.toLowerCase()]
        };

        console.log('Workflow Payload:', workflowPayload);

        const res = await authService.createWorkflow(workflowPayload);

        if (res.success) {
            toast.success('Workflow Created Successfully!');
            navigate('/dashboard');
        } else {
            toast.error(res.error?.message || 'Failed to create workflow');
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="step-content">
                        <h2>Name Your Workflow</h2>
                        <div className="config-form">
                            <Label>Workflow Name</Label>
                            <InputText
                                type="text"
                                placeholder="e.g., Save Gmail attachments to OneDrive"
                                value={workflowName}
                                onChange={e => setWorkflowName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="step-content">
                        <h2>Select a Service for the Action</h2>
                        {services && services.length > 0 ? (
                            <div className="services-grid">
                                {services.map(service => (
                                    <div
                                        key={service.id}
                                        className={`service-card-select ${actionService?.id === service.id ? 'selected' : ''}`}
                                        onClick={() => setActionService(service)}
                                    >
                                        <img src={service.logo} alt={service.name} />
                                        <span>{service.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-items-text">Aucun service disponible.</p>
                        )}
                        <p className="more-services-link" onClick={handleMoreServices}>Plus de services</p>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <h2>Select an Action</h2>
                        <div className="actions-list">
                            {availableActions.map(act => (
                                <div
                                    key={act.name}
                                    className={`action-card ${action?.name === act.name ? 'selected' : ''}`}
                                    onClick={() => setAction(act)}
                                >
                                    <h3>{act.name}</h3>
                                    <p>{act.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <h2>Configure Action: {action?.name}</h2>
                        {actionParameters.length > 0 ? (
                            <div className="parameters-container">
                                {actionParameters.map(param => renderParameterField(param, actionConfig, setActionConfig))}
                            </div>
                        ) : (
                            <p className="no-params">No configuration required for this action.</p>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <h2>Select a Service for the Reaction</h2>
                        {services && services.length > 0 ? (
                            <div className="services-grid">
                                {services.map(service => (
                                    <div
                                        key={service.id}
                                        className={`service-card-select ${reactionService?.id === service.id ? 'selected' : ''}`}
                                        onClick={() => setReactionService(service)}
                                    >
                                        <img src={service.logo} alt={service.name} />
                                        <span>{service.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-items-text">Aucun service disponible.</p>
                        )}
                        <p className="more-services-link" onClick={handleMoreServices}>Plus de services</p>
                    </div>
                );
            case 5:
                return (
                    <div className="step-content">
                        <h2>Select a Reaction</h2>
                        <div className="actions-list">
                            {availableReactions.map(react => (
                                <div
                                    key={react.name}
                                    className={`action-card ${reaction?.name === react.name ? 'selected' : ''}`}
                                    onClick={() => setReaction(react)}
                                >
                                    <h3>{react.name}</h3>
                                    <p>{react.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="step-content">
                        <h2>Configure Reaction: {reaction?.name}</h2>
                        {reactionParameters.length > 0 ? (
                            <div className="parameters-container">
                                {reactionParameters.map(param => renderParameterField(param, reactionConfig, setReactionConfig))}
                            </div>
                        ) : (
                            <p className="no-params">No configuration required for this reaction.</p>
                        )}
                    </div>
                );
            case 7:
                const summaryItems = [
                    {
                        title: 'General',
                        content: (
                            <div className="summary-section">
                                <p><strong>Name:</strong> {workflowName}</p>
                                <p><strong>Description:</strong> {actionService?.name} {action?.name} → {reactionService?.name} {reaction?.name}</p>
                            </div>
                        )
                    },
                    {
                        title: 'Action Details',
                        content: (
                            <div className="summary-section">
                                <p><strong>Service:</strong> {actionService?.name}</p>
                                <p><strong>Action:</strong> {action?.name}</p>
                                <div style={{ marginTop: '10px', paddingLeft: '15px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '5px' }}>Configuration :</p>
                                    {Object.entries(actionConfig).map(([key, val]) => (
                                        <p key={key} style={{ fontSize: '0.9rem' }}>• {key}: <span style={{ color: '#818cf8' }}>{String(val)}</span></p>
                                    ))}
                                </div>
                            </div>
                        )
                    },
                    {
                        title: 'Reaction Details',
                        content: (
                            <div className="summary-section">
                                <p><strong>Service:</strong> {reactionService?.name}</p>
                                <p><strong>Reaction:</strong> {reaction?.name}</p>
                                <div style={{ marginTop: '10px', paddingLeft: '15px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '5px' }}>Configuration :</p>
                                    {Object.entries(reactionConfig).map(([key, val]) => (
                                        <p key={key} style={{ fontSize: '0.9rem' }}>• {key}: <span style={{ color: '#c084fc' }}>{String(val)}</span></p>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                ];
                return (
                    <div className="step-content">
                        <h2>Workflow Summary</h2>
                        <Accordion items={summaryItems} />
                    </div>
                );
            default:
                return null;
        }
    };

    const validateConfig = (parameters, config) => {
        return parameters.every(param => {
            if (!param.required) return true;
            const value = config[param.name];
            if (param.type === 'checkbox') {
                return value === true;
            }
            return value !== undefined && value !== null && String(value).trim() !== '';
        });
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return workflowName.trim().length > 0;
            case 1: return !!actionService;
            case 2: return !!action;
            case 3: return validateConfig(actionParameters, actionConfig);
            case 4: return !!reactionService;
            case 5: return !!reaction;
            case 6: return validateConfig(reactionParameters, reactionConfig);
            case 7: return true;
            default: return false;
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="create-area-page">
            <div className="create-area-container">
                <h1 className="page-title">Create New Workflow</h1>

                <Stepper steps={steps} currentStep={currentStep} />

                <div className="step-container">
                    {renderStepContent()}
                </div>

                <div className="step-actions">
                    <Button
                        variant="secondary"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                    >
                        Back
                    </Button>

                    {currentStep === steps.length - 1 ? (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                        >
                            Create Workflow
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={!isStepValid()}
                        >
                            Next
                        </Button>
                    )}
                </div>
                {/* Custom Modal for unsaved changes */}
                <Modal
                    isOpen={showUnsavedModal}
                    title="Attention"
                    message="Si vous quittez cette page, votre progression ne sera pas enregistrée. Voulez-vous continuer ?"
                    onConfirm={handleConfirmNavigate}
                    onCancel={handleCancelModal}
                />
            </div>
        </div>
    );
};

export default CreateArea;
