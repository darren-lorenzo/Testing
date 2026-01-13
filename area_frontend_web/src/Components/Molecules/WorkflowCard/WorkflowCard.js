import React from 'react';
import Button from '../../Atoms/Button/Button';
import './WorkflowCard.css';


const WorkflowCard = ({ workflow, onClick, onDelete, onToggleActive }) => {
    const cardStyle = {
        backgroundColor: workflow.color || '#fff',
        color: workflow.color ? '#fff' : 'inherit'
    };

    return (
        <div className="workflow-card" style={cardStyle}>
            <div className="workflow-card-header">
                <div className="header-logos">
                    <span className="header-logo-icon">
                        {workflow.action_name?.logo && (
                            <img
                                src={workflow.action_name.logo}
                                alt={workflow.action_name.name}
                                className="service-logo-img"
                            />
                        )}
                    </span>
                    <span className="logo-separator">→</span>
                    <span className="header-logo-icon">
                        {workflow.reaction_name?.logo && (
                            <img
                                src={workflow.reaction_name.logo}
                                alt={workflow.reaction_name.name}
                                className="service-logo-img"
                            />
                        )}
                    </span>
                </div>
                <div className="status-container">
                    <span className={`workflow-status ${workflow.is_active !== false ? 'status-active' : 'status-inactive'}`}>
                        {workflow.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                    <label className="switch" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={workflow.is_active !== false}
                            onChange={() => onToggleActive(workflow)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <h3 className="workflow-title" style={{ color: workflow.color ? '#fff' : 'inherit' }}>
                {workflow.name}
            </h3>
            <p className="workflow-desc" style={{ color: workflow.color ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                {workflow.description || 'No description'}
            </p>

            <div className="workflow-details glass-effect">
                <div className="detail-item">
                    <span className="label">Trigger</span>
                    <div className="service-info">
                        <span className="value">{workflow.action_name?.name}</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="label">Action</span>
                    <div className="service-info">
                        <span className="value">{workflow.reaction_name?.name}</span>
                    </div>
                </div>
            </div>

            <div className="workflow-card-actions">
                <Button
                    className="card-btn edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                >
                    Modifier
                </Button>
                <Button
                    className="card-btn delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    Supprimer
                </Button>
            </div>
        </div>
    );
};

export default WorkflowCard;
