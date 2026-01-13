import React from 'react';
import Input from '../../Atoms/Input/Input';
import PasswordInput from '../../Atoms/PasswordInput/PasswordInput';
import Label from '../../Atoms/Label/Label';
import './FormField.css';

const FormField = ({ label, error, type, ...props }) => {
    const InputComponent = type === 'password' ? PasswordInput : Input;

    return (
        <div className={`form-field ${error ? 'has-error' : ''}`}>
            {label && <Label className="form-field__label">{label}</Label>}
            <InputComponent type={type} {...props} hasError={!!error} />
            {error && <span className="form-field__error">{error}</span>}
        </div>
    );
};

export default FormField;
