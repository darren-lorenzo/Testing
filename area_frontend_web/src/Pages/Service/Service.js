import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import ServiceCard from '../../Components/Molecules/ServiceCard/ServiceCard';
import './Service.css';

const ServicePage = () => {
    const [services, setServices] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {

                const results = await authService.getServices();
                if (results.success) {
                    setServices(Array.isArray(results.data) ? results.data : []);
                } else {
                    setError(results.error ? results.error.message : 'Error fetching services');
                }

                const res = await authService.getUser(authService.getUserID());
                if (res.success) {
                    setUserInfo(res.data);
                    console.log(res.data);
                } else {
                    setError(res.error ? res.error.message : 'Error fetching user');
                }

            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleServiceClick = (service) => {
        navigate(`/service/${service.id}`);
    };

    if (isLoading) {
        return <div className="service-page__loading">Chargement des services...</div>;
    }

    if (error) {
        return <div className="service-page__error">{error}</div>;
    }

    return (
        <div className="service-page">
            <header className="service-page__header">
                <h1 className="service-page__title">Explore Services</h1>
                <p className="service-page__subtitle">Connectez vos apps</p>
            </header>

            <main className="service-list">
                {services.length > 0 ? (
                    services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isConnected={userInfo?.info?.[service?.service?.charAt(0).toLowerCase() + service?.service?.slice(1)]?.isConnected || false}
                            onToggle={handleServiceClick}
                        />
                    ))
                ) : (
                    <div className="service-page__empty" style={{ display: 'flex' }}>
                        <div className="service-page__empty-icon">🔌</div>
                        <h3>Aucun service disponible</h3>
                        <p>Revenez plus tard, nos techniciens travaillent sur de nouvelles intégrations !</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ServicePage;
