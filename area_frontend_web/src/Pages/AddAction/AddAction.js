import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Stepper from '../../Components/Organisms/Stepper/Stepper';
import InputText from '../../Components/Atoms/Input/Input';
import Button from '../../Components/Atoms/Button/Button';
import authService from '../../Services/authService';
import './AddAction.css';

const AddAction = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [services, setServices] = useState([]);

    const [selectedService, setSelectedService] = useState(null);
    const [actionName, setActionName] = useState('');
    const [actionDescription, setActionDescription] = useState('');
    const [actionType, setActionType] = useState('webhook');
    const [parameters, setParameters] = useState([{ name: '', type: 'text' }]);

    const steps = [
        'Choose Service',
        'Action Details',
        'Parameters'
    ];

    useEffect(() => {
        const fetchServices = async () => {
            const res = await authService.getServices();
            if (res.success) {
                setServices(res.data);
            }
        };
        fetchServices();
    }, []);

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

    const handleAddParameter = () => {
        setParameters([...parameters, { name: '', type: 'text' }]);
    };

    const handleRemoveParameter = (index) => {
        const newParams = parameters.filter((_, i) => i !== index);
        setParameters(newParams);
    };

    const handleParameterChange = (index, field, value) => {
        const newParams = [...parameters];
        newParams[index][field] = value;
        setParameters(newParams);
    };

    const handleSubmit = async () => {
        const actionData = {
            Service: selectedService.name,
            name: actionName,
            description: actionDescription,
            Params: parameters.filter(p => p.name.trim() !== '')
        };

        setIsLoading(true);
        try {
            const response = await authService.createAction(actionData);
            if (response.success) {
                toast.success('Action added successfully!');
                navigate('/services');
            } else {
                toast.error('Failed to add action: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding action:', error);
            toast.error('An error occurred while adding the action.');
        } finally {
            setIsLoading(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return !!selectedService;
            case 1:
                return actionName.trim().length > 0 && actionDescription.trim().length > 0;
            case 2:
                return parameters.every(p => p.name.trim().length > 0);
            default:
                return false;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="step-content">
                        <h2>Select a Service</h2>
                        <div className="services-grid-select">
                            {services.map(service => (
                                <div
                                    key={service.id}
                                    className={`service-card-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedService(service)}
                                >
                                    <img src={service.url_logo} alt={service.name} />
                                    <span>{service.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="step-content">
                        <h2>Action Details</h2>
                        <div className="form-container">
                            <div className="form-field">
                                <label>
                                    Action Name
                                    <span className="required">*</span>
                                </label>
                                <InputText
                                    type="text"
                                    placeholder="e.g., New Email Received"
                                    value={actionName}
                                    onChange={(e) => setActionName(e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    Description
                                    <span className="required">*</span>
                                </label>
                                <textarea
                                    className="description-textarea"
                                    placeholder="Describe what triggers this action..."
                                    value={actionDescription}
                                    onChange={(e) => setActionDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <h2>Define Parameters</h2>
                        <p className="step-description">Define the data that this action will provide.</p>

                        <div className="parameters-list">
                            {parameters.map((param, index) => (
                                <div key={index} className="parameter-row">
                                    <div className="param-field name">
                                        <InputText
                                            type="text"
                                            placeholder="Parameter Name"
                                            value={param.name}
                                            onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="param-field type">
                                        <select
                                            value={param.type}
                                            onChange={(e) => handleParameterChange(index, 'type', e.target.value)}
                                        >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="date">Date</option>
                                            <option value="object">Object</option>
                                        </select>
                                    </div>
                                    <Button
                                        className="remove-param-btn"
                                        onClick={() => handleRemoveParameter(index)}
                                        disabled={parameters.length === 1}
                                        title="Remove parameter"
                                        variant="transparent"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="add-param-btn"
                            onClick={handleAddParameter}
                            variant="transparent"
                        >
                            + Add Parameter
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="add-action-page">
            <div className="add-action-container">
                <h1 className="page-title">Add New Action</h1>

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
                            disabled={!isStepValid() || isLoading}
                            isLoading={isLoading}
                        >
                            Add Action
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
            </div>
        </div>
    );
};

export default AddAction;
