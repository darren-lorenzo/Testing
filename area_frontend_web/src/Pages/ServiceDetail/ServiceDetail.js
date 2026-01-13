import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../Services/authService';
import ServiceHeader from '../../Components/Organisms/ServiceHeader/ServiceHeader';
import Button from '../../Components/Atoms/Button/Button';
import TemplateCard from '../../Components/Molecules/TemplateCard/TemplateCard';
import './ServiceDetail.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [service, setService] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;
    const userID = authService.getUserID();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [serviceRes, userInfo, tplResponse, servicesResponse, actionsResponse, reactionsResponse] = await Promise.all([
                authService.getServiceById(id),
                authService.getUser(userID),
                authService.getTemplate(),
                authService.getServices(),
                authService.getActions(),
                authService.getReactions()
            ]);

            if (serviceRes.success) {
                setService(serviceRes.data);
                console.log(serviceRes.data);
                const serviceName = serviceRes.data.service.toLowerCase();
                const serviceDisplayName = serviceRes.data.name?.toLowerCase();
                const isConnected = userInfo?.data?.info?.[serviceName]?.isConnected;
                setService(prev => ({ ...prev, connection_info: isConnected }));

                if (tplResponse.success && servicesResponse.success) {
                    const services = Array.isArray(servicesResponse.data) ? servicesResponse.data : [];
                    const actionsData = Array.isArray(actionsResponse.data) ? actionsResponse.data : [];
                    const reactionsData = Array.isArray(reactionsResponse.data) ? reactionsResponse.data : [];

                    const enrichedTemplates = (Array.isArray(tplResponse.data) ? tplResponse.data : [])
                        .filter(t => t.services && (t.services.includes(serviceName) || t.services.includes(serviceDisplayName)))
                        .map(template => {
                            const actionInfo = actionsData.find(a => a.id === template.action_id);
                            const reactionInfo = reactionsData.find(r => r.id === template.reaction_id);

                            const actionServiceKey = template.services?.[0];
                            const reactionServiceKey = template.services?.[1];

                            const actionServiceInfo = services.find(s =>
                                s.service === actionServiceKey ||
                                s.name?.toLowerCase() === actionServiceKey
                            );
                            const reactionServiceInfo = services.find(s =>
                                s.service === reactionServiceKey ||
                                s.name?.toLowerCase() === reactionServiceKey
                            );

                            return {
                                ...template,
                                color: actionServiceInfo?.color || '#fff',
                                action_name: {
                                    name: actionInfo?.name || 'Unknown Action',
                                    logo: actionServiceInfo?.logo || ''
                                },
                                reaction_name: {
                                    name: reactionInfo?.name || 'Unknown Reaction',
                                    logo: reactionServiceInfo?.logo || ''
                                }
                            };
                        });
                    setTemplates(enrichedTemplates);
                }
            } else {
                setError('Service not found');
            }
        } catch (err) {
            setError('An error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [id, userID]);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'success') {
            toast.success('Service connected successfully!');
            setSearchParams({});
        } else if (status === 'failed') {
            toast.error('Service connection failed');
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    console.log('userID', userID);
    const handleConnection = async () => {
        if (!service) return;

        if (!service.connection_info) {
            window.location.href = `${API_URL}/api/auth/${service.service.toLowerCase()}?userId=${userID}&plateforme=web`;
            return;
        }

        try {
            const response = await authService.disconnectService(service.service);
            if (response.success) {
                setService(prev => ({ ...prev, connection_info: false }));
                toast.success(`Disconnected from ${service.name}`);
            } else {
                toast.error(response.error.message || 'Failed to disconnect');
            }
        } catch (err) {
            toast.error('An error occurred during disconnection');
        }
    };

    const handleCreateWorkflow = () => {
        navigate('/create', { state: { serviceId: service.id } });
    };

    if (isLoading) return <div className="loading-container">Loading...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!service) return <div className="error-container">Service not found</div>;

    return (
        <div className="service-detail-page">
            <div className="service-detail-container">
                <ServiceHeader
                    service={service}
                    onConnect={handleConnection}
                    onCreateWorkflow={handleCreateWorkflow}
                />

                <div className="create-workflow-container">
                    <Button
                        className="create-custom-btn"
                        onClick={handleCreateWorkflow}
                        disabled={authService.needsAuth(service.service) && !service.connection_info}
                    >
                        + Create Custom Workflow with {service.name}
                    </Button>
                </div>

                {templates.length > 0 && (
                    <div className="service-templates-section">
                        <h2>Modèles disponibles avec {service.name}</h2>
                        <div className="workflows-grid">
                            {templates.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onUse={(t) => {
                                        if (authService.needsAuth(service.service) && !service.connection_info) {
                                            toast.error(`Veuillez vous connecter à ${service.name} pour utiliser ce modèle`);
                                            return;
                                        }
                                        navigate(`/template/${t.id}/use`);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default ServiceDetail;