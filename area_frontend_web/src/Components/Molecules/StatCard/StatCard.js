import React from 'react';
import Card from '../../Atoms/Card/Card';
import Button from '../../Atoms/Button/Button';
import './StatCard.css';

const StatCard = ({ title, icon, count, children, actionLabel, onAction, className = '' }) => {
    return (
        <Card className={`stat-card ${className}`}>
            <div className="stat-card__header">
                <div className="stat-card__title-group">
                    <span className="stat-card__icon">{icon}</span>
                    <h2 className="stat-card__title">{title}</h2>
                </div>
                {count !== undefined && (
                    <span className="stat-card__count">{count}</span>
                )}
            </div>

            <div className="stat-card__content">
                {children}
            </div>

            {actionLabel && (
                <Button className="stat-card__action" onClick={onAction} variant="transparent">
                    {actionLabel}
                </Button>
            )}
        </Card>
    );
};

export default StatCard;
