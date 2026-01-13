    import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../Services/authService';
import InputText from '../../Components/Atoms/Input/Input';
import Label from '../../Components/Atoms/Label/Label';
import './UseTemplate.css';

const UseTemplate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [actionPlaceholders, setActionPlaceholders] = useState({});
    const [reactionPlaceholders, setReactionPlaceholders] = useState({});
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await authService.getTemplate();
                if (res.success) {
                    const foundTemplate = res.data.find(t => t.id === parseInt(id));
                    if (foundTemplate) {
                        setTemplate(foundTemplate);
                        setName(foundTemplate.name);
                        setDescription(foundTemplate.description);
                        extractPlaceholders(foundTemplate.Params);
                    } else {
                        toast.error('Template not found');
                        navigate('/templates');
                    }
                } else {
                    toast.error('Failed to fetch templates');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error loading template');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id, navigate]);

    const extractPlaceholders = (params) => {
        const extractFromObj = (obj) => {
            const extracted = {};
            const traverse = (o) => {
                for (const key in o) {
                    if (typeof o[key] === 'string') {
                        if (['string', 'number', 'int', 'boolean'].includes(o[key].toLowerCase())) {
                            extracted[key] = '';
                        }
                        const matches = o[key].match(/\{\{([^}]+)\}\}/g);
                        if (matches) {
                            matches.forEach(match => {
                                const variable = match.replace(/\{\{|\}\}/g, '');
                                extracted[variable] = '';
                            });
                        }
                    } else if (typeof o[key] === 'object' && o[key] !== null) {
                        traverse(o[key]);
                    }
                }
            };
            traverse(obj);
            return extracted;
        };

        const actionParams = params.action || {};
        const reactionParams = params.reaction || {};

        const actionExtracted = extractFromObj(actionParams);
        const reactionExtracted = extractFromObj(reactionParams);

        setActionPlaceholders(actionExtracted);
        setReactionPlaceholders(reactionExtracted);
        setFormValues({ ...actionExtracted, ...reactionExtracted });
    };

    const handleInputChange = (variable, value) => {
        setFormValues(prev => ({
            ...prev,
            [variable]: value
        }));
    };

    const replacePlaceholders = (obj, values) => {
        if (typeof obj === 'string') {
            return obj.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
                return values[variable] || match;
            });
        } else if (Array.isArray(obj)) {
            return obj.map(item => replacePlaceholders(item, values));
        } else if (typeof obj === 'object' && obj !== null) {
            const newObj = {};
            for (const key in obj) {
                if (typeof obj[key] === 'string' && ['string', 'number', 'int', 'boolean'].includes(obj[key].toLowerCase()) && values[key] !== undefined) {
                    newObj[key] = values[key];
                } else {
                    newObj[key] = replacePlaceholders(obj[key], values);
                }
            }
            return newObj;
        }
        return obj;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!template) return;

        const filledParams = replacePlaceholders(template.Params, formValues);
        console.log('Filled Params:', filledParams);
        console.log('userId:', authService.getUserID());
        const workflowData = {
            name: name,
            description: description,
            action_id: template.action_id,
            reaction_id: template.reaction_id,
            Params: filledParams,
            services: template.services,
            user_id: authService.getUserID(),
            is_active: false
        };

        try {
            const res = await authService.createWorkflow(workflowData);
            if (res.success) {
                toast.success('Workflow created successfully!');
                navigate('/library');
            } else {
                toast.error(res.error?.message || 'Failed to create workflow');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error creating workflow');
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!template) return null;

    return (
        <div className="use-template-container">
            <div className="use-template-header">
                <h1>Configurer le modèle</h1>
                <p>{template.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="use-template-form">
                <div className="placeholders-section">
                    <h3>Informations Générales</h3>
                    <div className="form-group">
                        <Label>Nom du Workflow</Label>
                        <InputText
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nom du workflow"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <Label>Description</Label>
                        <InputText
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description du workflow"
                        />
                    </div>
                </div>

                <div className="placeholders-section action-section">
                    <h3>
                        <span className="section-icon"></span>
                        Paramètres de l'Action
                    </h3>
                    {Object.keys(actionPlaceholders).length === 0 ? (
                        <p className="no-params">Aucun paramètre à configurer.</p>
                    ) : (
                        Object.keys(actionPlaceholders).map(variable => (
                            <div key={variable} className="form-group">
                                <Label>{variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                                <InputText
                                    type="text"
                                    value={formValues[variable]}
                                    onChange={(e) => handleInputChange(variable, e.target.value)}
                                    placeholder={`Entrez ${variable}`}
                                    required
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="placeholders-section reaction-section">
                    <h3>
                        <span className="section-icon"></span>
                        Paramètres de la Réaction
                    </h3>
                    {Object.keys(reactionPlaceholders).length === 0 ? (
                        <p className="no-params">Aucun paramètre à configurer.</p>
                    ) : (
                        Object.keys(reactionPlaceholders).map(variable => (
                            <div key={variable} className="form-group">
                                <Label>{variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                                <InputText
                                    type="text"
                                    value={formValues[variable]}
                                    onChange={(e) => handleInputChange(variable, e.target.value)}
                                    placeholder={`Entrez ${variable}`}
                                    required
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="create-btn">Créer le Workflow</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/templates')}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default UseTemplate;
