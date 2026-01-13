import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdLibraryBooks, MdAdd, MdLogout, MdClose, MdAccountCircle } from 'react-icons/md';
import { FaPlug, FaBolt, FaRocket, FaList, FaAndroid } from 'react-icons/fa';

import Button from '../../Atoms/Button/Button';
import Divider from '../../Atoms/Divider/Divider';
import { useAuth } from '../../../Context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar__close" onClick={onClose}>
                <MdClose />
            </button>

            <div className="sidebar__logo">
                <h2>AREA</h2>
            </div>

            <nav className="sidebar__nav">
                <NavLink
                    to="/create"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <MdAdd className="sidebar__icon" />
                    Création
                </NavLink>

                <Divider spacing="md" />

                <NavLink
                    to="/"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <MdDashboard className="sidebar__icon" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/services"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <FaPlug className="sidebar__icon" />
                    Services
                </NavLink>

                <NavLink
                    to="/library"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <MdLibraryBooks className="sidebar__icon" />
                    Librairie
                </NavLink>

                <NavLink
                    to="/add-service"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <FaPlug className="sidebar__icon" />
                    Ajouter un service
                </NavLink>

                <NavLink
                    to="/add-action"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <FaBolt className="sidebar__icon" />
                    Ajouter une action
                </NavLink>

                <NavLink
                    to="/add-reaction"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <FaRocket className="sidebar__icon" />
                    Ajouter une réaction
                </NavLink>
            </nav>
            <div className="sidebar__footer">
                <NavLink
                    to="/profil"
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                >
                    <MdAccountCircle className="sidebar__icon" />
                    Profil
                </NavLink>
                <a href="/client.apk" download className="sidebar__link sidebar__download">
                    <FaAndroid className="sidebar__icon" />
                    Télécharger l'APK
                </a>
                <Button onClick={handleLogout} className="sidebar__logout" variant="transparent">
                    <MdLogout className="sidebar__icon" />
                    Déconnexion
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
