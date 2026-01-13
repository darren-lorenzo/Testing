import React, { useState } from 'react';
import authServiceInstance from '../../Services/authService';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const username = user?.name || 'Utilisateur';
  const servicesConnectedCount = 3;
  const areasCount = 3;

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="topbar__left">Bienvenue {username}</div>
        <div className="topbar__right">
          <button className="profile-btn" aria-label="Mon profil">
            <span className="profile-icon">ðŸ‘¤</span>
            <span className="status-dot" aria-hidden="true"></span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="cta-card" aria-label="Nouvelle automatisation">
          <div>
            <h2 className="cta-title">Nouvelle Automatisation</h2>
            <p className="cta-subtitle">CrÃ©e une AREA en quelques clics Ã  partir de tes services connectÃ©s.</p>
          </div>
          <div className="cta-actions">
            <button className="cta-btn" type="button">CrÃ©er maintenant</button>
          </div>
        </section>

        <section className="cards-grid">
          <section className="big-card big-card--services" aria-label="Mes services">
            <div className="card-icon">
              <span className="card-symbol" aria-hidden="true"></span>
              <div className="ticker-track">
                <span className="ticker-item">services connecté: {servicesConnectedCount}</span>
              </div>
            </div>
            <h2 className="card-title">Mes services</h2>

            <div className="services-list">
              <div className="service-item facebook">
                <span className="service-icon">F</span>
                <div>
                  <div className="service-name">Facebook</div>
                  <div className="service-meta">Social</div>
                </div>
              </div>
              <div className="service-item github">
                <span className="service-icon">G</span>
                <div>
                  <div className="service-name">GitHub</div>
                  <div className="service-meta">Dev</div>
                </div>
              </div>
              <div className="service-item outlook">
                <span className="service-icon">O</span>
                <div>
                  <div className="service-name">Outlook</div>
                  <div className="service-meta">Mail</div>
                </div>
              </div>
            </div>

            <button className="add-service-btn" type="button">Ajouter un service</button>
          </section>

          <section className="big-card big-card--areas" aria-label="Mes AREA">
            <div className="card-icon">
              <span className="card-symbol" aria-hidden="true">ðŸ§©</span>
              <div className="ticker-track">
                <span className="ticker-item">AREAs: {areasCount}</span>
              </div>
            </div>
            <h2 className="card-title">Mes AREA</h2>

            <div className="areas-list">
              <div className="area-item pdf">
                <span className="area-icon">PDF</span>
                <div>
                  <div className="area-name">Enregistrement PDF</div>
                  <div className="area-meta">Issue GitHub â†’ CrÃ©er PDF</div>
                </div>
              </div>
              <div className="area-item photo">
                <span className="area-icon">IMG</span>
                <div>
                  <div className="area-name">TÃ©lÃ©chargement photo</div>
                  <div className="area-meta">Facebook â†’ Drive</div>
                </div>
              </div>
              <div className="area-item mail">
                <span className="area-icon">MAIL</span>
                <div>
                  <div className="area-name">Mail de rÃ©ponses</div>
                  <div className="area-meta">Outlook â†’ Notification</div>
                </div>
              </div>
            </div>

            <button className="add-area-btn" type="button">Ajouter une area</button>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;