import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Components/Atoms/Button/Button';
import Card from '../../Components/Atoms/Card/Card';
import FormField from '../../Components/Molecules/FormField/FormField';
import authService from '../../Services/authService';
import { registerValidationSchema } from '../../Utils/validationSchemas';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const validateForm = async () => {
        try {
            await registerValidationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const newErrors = {};
            err.inner.forEach((error) => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        setIsLoading(true);
        setAuthError('');

        const result = await authService.register({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });

        setIsLoading(false);

        if (result.success) {
            navigate('/login');
        } else {
            setAuthError(result.error.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <div className="auth-card__header">
                    <h1 className="auth-card__title">Inscription</h1>
                    <p className="auth-card__subtitle">Créez votre compte pour commencer</p>
                </div>

                <div className="auth-form">
                    <FormField
                        label="Nom d'utilisateur"
                        name="username"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                    />

                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <FormField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <FormField
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />

                    {authError && (
                        <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
                            {authError}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        isLoading={isLoading}
                        onClick={handleSubmit}
                    >
                        S'inscrire
                    </Button>
                </div>

                <p className="toggle-text">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="toggle-link">
                        Se connecter
                    </a>
                </p>
            </Card>
        </div>
    );
};

export default Register;
