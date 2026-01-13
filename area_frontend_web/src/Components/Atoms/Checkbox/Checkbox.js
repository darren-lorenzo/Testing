import React from 'react';
import './Checkbox.css';

const Checkbox = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    className = '',
    ...rest
}) => {
    const baseClass = "wcp-checkbox";
    const containerClass = `${baseClass}-container ${disabled ? 'wcp-checkbox--disabled' : ''} ${className}`.trim();

    return (
        <label className={containerClass}>
            <input
                type="checkbox"
                className={`${baseClass}__input`}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...rest}
            />
            <span className={`${baseClass}__checkmark`}></span>
            {label && <span className={`${baseClass}__label`}>{label}</span>}
        </label>
    );
};

export default Checkbox;
