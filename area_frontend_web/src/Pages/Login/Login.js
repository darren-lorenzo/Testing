import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import Button from "../../Components/Atoms/Button/Button";
import InputText from "../../Components/Atoms/Input/Input";
import PasswordInput from "../../Components/Atoms/PasswordInput/PasswordInput";
import './Login.css'
import Checkbox from "../../Components/Atoms/Checkbox/Checkbox";
import { useAuth } from "../../Context/AuthContext";
import { loginValidationSchema } from '../../Utils/validationSchemas';
import { useEffect } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

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
      await loginValidationSchema.validate(formData, { abortEarly: false });
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

    const result = await login({
      email: formData.email,
      password: formData.password
    });

    setIsLoading(false);

    if (result.success) {
      console.log('Login successful:', result.data);
      navigate('/');
    } else {
      setAuthError(result.error.message || 'Erreur de connexion');
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <div className="login-card__header">
            <h1 className="login-card__title">Connexion</h1>
            <p className="login-card__subtitle">
              Bienvenue ! Connectez-vous à votre compte
            </p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label className="form-group__label">Email</label>
              <InputText
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                hasError={errors.email}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-group__label">Mot de passe</label>
              <PasswordInput
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                hasError={errors.password}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {authError && (
              <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <div className="login-options">
              <Checkbox
                label="Se souvenir de moi"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            </div>

            <Button
              variant="primary"
              isLoading={isLoading}
              onClick={handleSubmit}
            >
              Se connecter
            </Button>
          </div>

          <p className="register-text">
            Vous n'avez pas de compte ?{' '}
            <a href="/register" className="register-link">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;