import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdLibraryBooks, MdAdd, MdLogout, MdAccountCircle, MdMenu, MdClose, MdAutoAwesome } from 'react-icons/md';
import { FaPlug, FaBolt, FaRocket, FaAndroid } from 'react-icons/fa';

import Button from '../../Atoms/Button/Button';
import { useAuth } from '../../../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Effet de scroll pour dynamiser la Navbar
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navLinks = [
        { to: "/", icon: <MdDashboard />, label: "Dashboard" },
        { to: "/services", icon: <FaPlug />, label: "Services" },
        { to: "/templates", icon: <MdAutoAwesome />, label: "Templates" },
        { to: "/library", icon: <MdLibraryBooks />, label: "Librairie" },
        { to: "/create", icon: <MdAdd />, label: "Création" },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar__container">
                <div className="navbar__logo" onClick={() => navigate('/')}>
                    <h2>AREA</h2>
                </div>

                <div className={`navbar__links ${isMenuOpen ? 'open' : ''}`}>
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
                            onClick={closeMenu}
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            {React.cloneElement(link.icon, { className: 'navbar__icon' })}
                            {link.label}
                        </NavLink>
                    ))}

                    <div className="navbar__divider mobile-only"></div>

                    <div className="navbar__user-section">
                        <NavLink to="/profil" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                            <MdAccountCircle className="navbar__icon" />
                            Profil
                        </NavLink>
                        <a href="/client.apk" download className="navbar__link navbar__download" onClick={closeMenu}>
                            <FaAndroid className="navbar__icon" />
                            APK
                        </a>
                        <Button onClick={handleLogout} className="navbar__logout" variant="transparent" title="Déconnexion">
                            <MdLogout className="navbar__icon" style={{ margin: 0 }} />
                            <span className="mobile-only" style={{ marginLeft: 10 }}></span>
                        </Button>
                    </div>
                </div>

                <button className="navbar__hamburger" onClick={toggleMenu} aria-label="Menu">
                    {isMenuOpen ? <MdClose /> : <MdMenu />}
                </button>
            </div>
            {isMenuOpen && <div className="navbar__overlay" onClick={closeMenu}></div>}
        </nav>
    );
};

export default Navbar;
