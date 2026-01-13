import React from 'react';
import './Stepper.css';

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="stepper-container">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                >
                    <div className="step-counter">
                        {index < currentStep ? '✓' : index + 1}
                    </div>
                    <div className="step-name">{step}</div>
                    {index < steps.length - 1 && <div className="step-line"></div>}
                </div>
            ))}
        </div>
    );
};

export default Stepper;
