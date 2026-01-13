import React from "react";
import Button from "../../Components/Atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import './Home.css'
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="homepage">
      <div className="homepage__content">
        <h1 className="homepage__title">ACTION-REACTION</h1>
        <p className="homepage__subtitle">
          Automatisez vos services en toute simplicité
        </p>

        <div className="homepage__actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRegister}
          >
            S'inscrire
          </Button>
          <a href="/client.apk" download className="homepage__download-btn">
            Télécharger l'APK
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
