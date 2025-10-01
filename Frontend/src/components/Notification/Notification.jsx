import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose && onClose(), 300); // Tiempo para la animación
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  if (!visible) return null;

  return (
    <div className={`notification notification-${type} ${visible ? 'notification-show' : 'notification-hide'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </div>
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;