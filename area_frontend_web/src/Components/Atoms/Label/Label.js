import React from 'react';
import './Label.css';

const Label = ({ children, htmlFor, className = '', required = false, ...props }) => {
    return (
        <label htmlFor={htmlFor} className={`atom-label ${className}`} {...props}>
            {children}
            {required && <span className="atom-label-required">*</span>}
        </label>
    );
};

export default Label;
