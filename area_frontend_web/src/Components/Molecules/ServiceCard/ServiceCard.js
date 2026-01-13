import React from 'react';
import Card from '../../Atoms/Card/Card';
import Icon from '../../Atoms/Icon/Icon';
import authService from '../../../Services/authService';
import './ServiceCard.css';

const ServiceCard = ({ service, isConnected, onToggle }) => {
    const isPublic = !authService.needsAuth(service.service);

    return (
        <Card
            className="service-card"
            style={{ '--service-color': service.color }}
            onClick={() => onToggle && onToggle(service)}
        >
            <div className="service-logo-container">
                <Icon
                    src={service.logo}
                    alt={`${service.name} logo`}
                    size="md"
                />
            </div>

            <h3 className="service-name">{service.name}</h3>

            <div className={`service-status ${isPublic ? 'public' : isConnected ? 'connected' : 'disconnected'}`}>
                <span className="status-dot"></span>
                {isPublic ? 'Public' : isConnected ? 'Connected' : 'Disconnected'}
            </div>
        </Card>
    );
};

export default ServiceCard;
