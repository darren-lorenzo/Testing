import React from 'react';
import './Toggle.css';

const Toggle = ({
    checked = false,
    onChange,
    disabled = false,
    label = '',
    className = '',
    ...rest
}) => {
    const handleToggle = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    return (
        <div className={`toggle-wrapper ${className}`.trim()}>
            <label className={`toggle ${disabled ? 'toggle--disabled' : ''}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleToggle}
                    disabled={disabled}
                    className="toggle__input"
                    {...rest}
                />
                <span className="toggle__slider"></span>
            </label>
            {label && <span className="toggle__label">{label}</span>}
        </div>
    );
};

export default Toggle;
