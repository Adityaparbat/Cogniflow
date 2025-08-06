import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isOnline: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOnline }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            📚 Genrate
          </Link>
          
          <nav className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/subject/english" className="nav-link">
              English
            </Link>
            <Link to="/subject/hindi" className="nav-link">
              Hindi
            </Link>
            <Link to="/subject/math" className="nav-link">
              Math
            </Link>
            
            <div className="status-indicator">
              <div className={`status-dot ${!isOnline ? 'offline' : ''}`}></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 