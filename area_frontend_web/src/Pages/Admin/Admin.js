import React, { useState } from 'react';
import './admin.css';

const Admin = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users');
  const adminName = user?.name || 'Administrateur';

  // nom mail role nb-services nb-areas

  const users = [
    { name: 'Jean', email: 'jean@example.com', role: 'Admin', services: 3, areas: 5, status: 'Actif', signup: '2025-12-01' },
    { name: 'Alice', email: 'alice@example.com', role: 'User', services: 2, areas: 3, status: 'Actif', signup: '2025-11-18' },
    { name: 'Bob', email: 'bob@example.com', role: 'User', services: 1, areas: 2, status: 'Inactif', signup: '2025-10-22' },
    { name: 'Chloe', email: 'chloe@example.com', role: 'User', services: 4, areas: 6, status: 'Actif', signup: '2025-09-12' },
    { name: 'David', email: 'david@example.com', role: 'User', services: 2, areas: 1, status: 'Actif', signup: '2025-08-08' },
    { name: 'Emma', email: 'emma@example.com', role: 'Admin', services: 5, areas: 7, status: 'Actif', signup: '2025-07-30' },
    { name: 'Fabrice', email: 'fabrice@example.com', role: 'User', services: 3, areas: 2, status: 'Inactif', signup: '2025-06-15' },
    { name: 'Grace', email: 'grace@example.com', role: 'User', services: 6, areas: 4, status: 'Actif', signup: '2025-05-03' },
  ];

  const services = [
    { name: 'GitHub', category: 'Dev', type: 'API', users: 120, arCount: '12/8', status: 'Actif' },
    { name: 'Facebook', category: 'Social', type: 'OAuth', users: 210, arCount: '18/10', status: 'Actif' },
    { name: 'Outlook', category: 'Mail', type: 'API', users: 95, arCount: '9/5', status: 'Actif' },
    { name: 'Twitter/X', category: 'Social', type: 'API', users: 60, arCount: '6/3', status: 'Inactif' },
    { name: 'Google Drive', category: 'Cloud', type: 'API', users: 140, arCount: '11/7', status: 'Actif' },
    { name: 'Slack', category: 'Productivité', type: 'Webhook', users: 75, arCount: '7/4', status: 'Actif' },
    { name: 'Trello', category: 'Gestion', type: 'API', users: 55, arCount: '5/3', status: 'Actif' },
    { name: 'Dropbox', category: 'Cloud', type: 'API', users: 80, arCount: '8/5', status: 'Actif' },
  ];

  const areas = [
    { name: 'Notifier par email', action: 'Nouvelle issue GitHub', reaction: 'Envoyer mail Outlook', user: 'jean@example.com', runs: 432, status: 'Actif', created: '2025-10-10' },
    { name: 'Sauvegarder photos', action: 'Image Facebook', reaction: 'Upload Drive', user: 'alice@example.com', runs: 210, status: 'Actif', created: '2025-09-02' },
    { name: 'Alerte Slack', action: 'PR ouverte GitHub', reaction: 'Message Slack', user: 'emma@example.com', runs: 168, status: 'Actif', created: '2025-08-21' },
    { name: 'Archiver mails', action: 'Mail reçu Outlook', reaction: 'Créer PDF', user: 'bob@example.com', runs: 96, status: 'Inactif', created: '2025-07-19' },
    { name: 'Carte Trello issue', action: 'Issue GitHub', reaction: 'Créer carte Trello', user: 'david@example.com', runs: 121, status: 'Actif', created: '2025-06-05' },
    { name: 'Backup fichiers', action: 'Nouveau fichier Dropbox', reaction: 'Copie Drive', user: 'grace@example.com', runs: 189, status: 'Actif', created: '2025-05-30' },
    { name: 'Tweet to email', action: 'Nouveau tweet', reaction: 'Envoyer mail', user: 'chloe@example.com', runs: 77, status: 'Inactif', created: '2025-04-14' },
    { name: 'Issue to Outlook', action: 'Issue GitHub', reaction: 'Email Outlook', user: 'fabrice@example.com', runs: 134, status: 'Actif', created: '2025-03-11' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">{adminName}</h1>
      </div>

      <section className="control-panel">
        <div className="chart-card">
          <h3>Fréquence d’utilisation des services</h3>
          <div id="chart-services" style={{ height: 220, background: '#ffffff', borderRadius: 12 }} />
        </div>
        <div className="chart-card">
          <h3>AREAs les plus utilisées</h3>
          <div id="chart-areas" style={{ height: 220, background: '#ffffff', borderRadius: 12 }} />
        </div>
      </section>

      <div className="admin-actions">
        <button className={`admin-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Utilisateurs</button>
        <button className={`admin-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
        <button className={`admin-btn ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')}>AREAs</button>
      </div>

      {activeTab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Services</th>
              <th>AREAs</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr className="table-row" key={`user-${idx}`}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.services}</td>
                <td>{u.areas}</td>
                <td>{u.signup}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn edit" title="Modifier">✏️</button>
                    <button className="icon-btn delete" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'services' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Catégorie</th>
              <th>Type</th>
              <th>Utilisateurs</th>
              <th>Actions/Reactions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, idx) => (
              <tr className="table-row" key={`service-${idx}`}>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>{s.type}</td>
                <td>{s.users}</td>
                <td>{s.arCount}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn edit" title="Modifier">✏️</button>
                    <button className="icon-btn delete" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'areas' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom AREA</th>
              <th>Action</th>
              <th>Reaction</th>
              <th>Utilisateur</th>
              <th>Exécutions</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a, idx) => (
              <tr className="table-row" key={`area-${idx}`}>
                <td>{a.name}</td>
                <td>{a.action}</td>
                <td>{a.reaction}</td>
                <td>{a.user}</td>
                <td>{a.runs}</td>
                <td>{a.created}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn edit" title="Modifier">✏️</button>
                    <button className="icon-btn delete" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;