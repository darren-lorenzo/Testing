import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TemplateCard from '../../Components/Molecules/TemplateCard/TemplateCard';
import authServiceInstance from '../../Services/authService';
import './Templates.css';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const userID = authServiceInstance.getUserID();
            const [tplResponse, servicesResponse, actionsResponse, reactionsResponse, userResponse] = await Promise.all([
                authServiceInstance.getTemplate(),
                authServiceInstance.getServices(),
                authServiceInstance.getActions(),
                authServiceInstance.getReactions(),
                authServiceInstance.getUser(userID)
            ]);

            if (tplResponse.success && servicesResponse.success) {
                const services = Array.isArray(servicesResponse.data) ? servicesResponse.data : [];
                const actionsData = Array.isArray(actionsResponse.data) ? actionsResponse.data : [];
                const reactionsData = Array.isArray(reactionsResponse.data) ? reactionsResponse.data : [];

                const enrichedTemplates = (Array.isArray(tplResponse.data) ? tplResponse.data : []).map(template => {
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
                if (userResponse.success) {
                    setUserInfo(userResponse.data);
                }
            } else {
                setError(tplResponse.message || "Impossible de récupérer les templates.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUseTemplate = (template) => {
        if (!userInfo || !userInfo.info) {
            toast.error("Impossible de vérifier vos connexions. Veuillez réessayer.");
            return;
        }

        const disconnectedServices = [];
        if (template.services) {
            template.services.forEach(serviceName => {
                const serviceKey = serviceName.toLowerCase();
                // Check if service exists in user info and is connected
                // Note: user info structure seems to be userInfo.info[serviceName].isConnected
                // We need to be careful with casing. The template.services usually has Capitalized names?
                // Let's check ServiceDetail.js again.
                // ServiceDetail.js: const serviceName = serviceRes.data.service.toLowerCase();
                // userInfo?.data?.info?.[serviceName]?.isConnected

                // In Templates.js, template.services contains strings like "Github", "Google", etc.
                // We should try to match case-insensitive or assume lower case keys in userInfo.

                const isPublic = !authServiceInstance.needsAuth(serviceKey);
                const isConnected = userInfo.info[serviceKey]?.isConnected;
                if (!isPublic && !isConnected) {
                    disconnectedServices.push(serviceName);
                }
            });
        }

        if (disconnectedServices.length > 0) {
            toast.error(`Veuillez vous connecter à : ${disconnectedServices.join(', ')}`);
            return;
        }

        navigate(`/template/${template.id}/use`);
    };

    return (
        <div className="templates-page">
            <header className="templates-header">
                <h1>Modèles de Workflow</h1>
                <p>Commencez rapidement avec nos modèles pré-configurés</p>
            </header>
            {error && <p className="error-container">{error}</p>}
            {loading ? (
                <p>Chargement des modèles...</p>
            ) : (
                templates.length === 0 ? (
                    <div className="templates-empty">
                        <p>Aucun modèle disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="workflow-grid">
                        {templates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onUse={handleUseTemplate}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Templates;
