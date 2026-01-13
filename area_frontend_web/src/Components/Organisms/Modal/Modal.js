import React, { useEffect } from 'react';
import Button from '../../Atoms/Button/Button';
import './Modal.css';

/**
 * Reusable modal component.
 * Props:
 * - isOpen (bool): whether the modal is visible
 * - title (string): modal title
 * - message (string): body text
 * - onConfirm (func): called when user confirms
 * - onCancel (func): called when user cancels or clicks outside
 */
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel && onCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <Button variant="secondary" onClick={onCancel}>Annuler</Button>
                    <Button variant="primary" onClick={onConfirm}>Continuer</Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
