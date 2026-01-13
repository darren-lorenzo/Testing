import React from 'react';
import Button from '../../Atoms/Button/Button';
import './TemplateCard.css';

const TemplateCard = ({ template, onUse }) => {
    const cardStyle = {
        backgroundColor: template.color || '#fff',
        color: template.color ? '#fff' : 'inherit'
    };

    return (
        <div className="workflow-card template-card" style={cardStyle}>
            <div className="workflow-card-header">
                <div className="header-logos">
                    <span className="header-logo-icon">
                        {template.action_name?.logo && (
                            <img
                                src={template.action_name.logo}
                                alt={template.action_name.name}
                                className="service-logo-img"
                            />
                        )}
                    </span>
                    <span className="logo-separator">→</span>
                    <span className="header-logo-icon">
                        {template.reaction_name?.logo && (
                            <img
                                src={template.reaction_name.logo}
                                alt={template.reaction_name.name}
                                className="service-logo-img"
                            />
                        )}
                    </span>
                </div>
            </div>

            <h3 className="workflow-title" style={{ color: template.color ? '#fff' : 'inherit' }}>
                {template.name}
            </h3>
            <p className="workflow-desc" style={{ color: template.color ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                {template.description || 'No description'}
            </p>

            <div className="workflow-details glass-effect">
                <div className="detail-item">
                    <span className="label">Trigger</span>
                    <div className="service-info">
                        <span className="value">{template.action_name?.name || 'Unknown Action'}</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="label">Action</span>
                    <div className="service-info">
                        <span className="value">{template.reaction_name?.name || 'Unknown Reaction'}</span>
                    </div>
                </div>
            </div>

            <div className="workflow-card-actions">
                <Button
                    className="card-btn use-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUse(template);
                    }}
                >
                    Utiliser ce modèle
                </Button>
            </div>
        </div>
    );
};

export default TemplateCard;
