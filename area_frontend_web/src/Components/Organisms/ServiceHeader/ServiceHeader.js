import React from 'react';
import { MdLogout } from 'react-icons/md';
import Button from '../../Atoms/Button/Button';
import authService from '../../../Services/authService';
import './ServiceHeader.css';

const ServiceHeader = ({ service, onConnect, onCreateWorkflow }) => {
    const isPublic = !authService.needsAuth(service.service);

    const handleButtonClick = () => {
        if ((service.connection_info || isPublic) && onCreateWorkflow) {
            onCreateWorkflow();
        } else {
            onConnect();
        }
    };

    return (
        <header
            className="service-detail-header"
            style={{ '--header-bg-color': `${service.color}20` }}
        >
            <div className="service-detail-logo-container">
                <img src={service.logo} alt={service.name} className="service-detail-logo" />
            </div>
            <h1 className="service-detail-title">{service.name}</h1>
            <p className="service-detail-description">
                {service.description || `Integrate ${service.name} to automate your work. Combine with other apps to save time and boost productivity.`}
            </p>

            <div className="service-header-actions">
                <Button
                    className="service-connect-btn"
                    style={{
                        backgroundColor: (service.connection_info || isPublic) ? '#125cdbff' : '#F44336',
                        color: 'white'
                    }}
                    onClick={handleButtonClick}
                >
                    {(service.connection_info || isPublic) ? 'Create Workflow' : 'Connect Service'}
                </Button>
                {service.connection_info && !isPublic && (
                    <Button
                        className="service-disconnect-btn"
                        style={{
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            marginLeft: '10px'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onConnect();
                        }}
                        title="Disconnect Service"
                    >
                        <MdLogout size={20} />
                    </Button>
                )}
            </div>
        </header>
    );
};

export default ServiceHeader;
