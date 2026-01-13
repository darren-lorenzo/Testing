import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Components/Atoms/Button/Button';
import Input from '../../Components/Atoms/Input/Input';
import Divider from '../../Components/Atoms/Divider/Divider';
import { useAuth } from '../../Context/AuthContext';
import authService from '../../Services/authService';
import './Profil.css';

const Profil = () => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    surname: ''
  });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (field) => (e) => {
    setPasswords(prev => ({ ...prev, [field]: e.target.value }));
  };

  const isFormValid = passwords.current && passwords.new && passwords.confirm;

  const [avatarUrl, setAvatarUrl] = useState(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userID = authService.getUserID();
        if (!userID) {
          return;
        }
        const response = await authService.getUser(userID);
        if (response.success) {
          setUserData({
            name: response.data.name || '',
            email: response.data.email || '',
            surname: response.data.surname || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const node = avatarRef.current;
    if (!node) return;

    const onPaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            setAvatarUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
            e.preventDefault();
            break;
          }
        }
      }
    };

    node.addEventListener('paste', onPaste);
    return () => {
      node.removeEventListener('paste', onPaste);
    };
  }, []);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    console.log('Mise à jour du mot de passe...');
  };

  if (loading) {
    return <div className="loading-container">Chargement du profil...</div>;
  }



  return (
    <div className="profil-page">
      <div className="profil-topbar">
        <Button
          className="topbar-back-btn"
          aria-label="Retour"
          onClick={() => navigate(-1)}
          title="Retour à la page précédente"
          variant="transparent"
        >
          ‹
        </Button>
        <span className="profil-topbar-title">Mon Profil</span>
      </div>

      <div
        className="profil-avatar-large"
        aria-label="Photo de profil"
        ref={avatarRef}
        tabIndex={0}
        title="Collez (Ctrl+V / Cmd+V) une image ici"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="profil-avatar-img" />
        ) : (
          <span className="profil-avatar-initials">
            {userData.name ? userData.name.charAt(0).toUpperCase() : '👤'}
          </span>
        )}
      </div>

      <div className="profil-container">
        <div className="profil-content">
          <div className="profil-field">
            <label className="field-label">Email</label>
            <Input
              type="email"
              value={userData.email}
              readOnly
              placeholder="Votre email"
            />
          </div>

          {/* Nom */}
          <div className="profil-field">
            <label className="field-label">Nom</label>
            <Input
              type="text"
              placeholder="Votre nom"
              value={userData.name}
              readOnly
            />
          </div>

          <Divider spacing="lg" />

          <form className="profil-password-form" onSubmit={handlePasswordUpdate}>
            <h3 className="section-title">Changer le mot de passe</h3>

            <div className="profil-field">
              <label className="field-label">Mot de passe actuel</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={handlePasswordChange('current')}
              />
            </div>

            <div className="profil-field">
              <label className="field-label">Nouveau mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.new}
                onChange={handlePasswordChange('new')}
              />
            </div>

            <div className="profil-field">
              <label className="field-label">Confirmer le nouveau mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={handlePasswordChange('confirm')}
              />
            </div>

            <div className="profil-actions">
              <Button type="submit" variant="primary" disabled={!isFormValid}>
                Mettre à jour le mot de passe
              </Button>
            </div>
          </form>
        </div>

        <div className="logout-container">
          <Button onClick={handleLogout} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profil;