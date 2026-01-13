import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './PasswordInput.css';

const PasswordInput = ({
    type, // destructure to exclude from rest
    placeholder = '••••••••',
    hasError = false,
    value,
    onChange,
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const baseClass = "wcp-password-input";
    const errorClass = hasError ? "wcp-password-input--error" : "";
    const classes = `${baseClass} ${errorClass}`.trim();

    return (
        <div className="wcp-password-input-wrapper">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={classes}
                {...rest}
            />
            <button
                type="button"
                className="wcp-password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    );
};

export default PasswordInput;
