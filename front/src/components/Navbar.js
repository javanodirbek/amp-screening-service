import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const initials = user?.username?.slice(0, 2).toUpperCase() || '??';

  const roleLabel = {
    ADMIN: 'Администратор',
    OPERATOR: 'Оператор',
    COMPLIANCE_OFFICER: 'Офицер комплаенс',
  }[user?.role] || user?.role;

  return (
    <nav className="navbar-top">
      <div className="navbar-brand-area">
        <div className="navbar-emblem">
          <i className="bi bi-shield-fill-check"></i>
        </div>
        <div className="navbar-title">
          <Link to="/dashboard" className="navbar-title-main">
            АМЛ Скрининг
          </Link>
          <span className="navbar-title-sub">Финансовый мониторинг</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-datetime">
          <span>{time.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            {time.toLocaleTimeString('ru-RU')}
          </span>
        </div>

        <div className="navbar-user-pill">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{roleLabel}</span>
          </div>
        </div>

        <button className="btn-logout" onClick={logout}>
          <i className="bi bi-box-arrow-right"></i>
          Выйти
        </button>
      </div>
    </nav>
  );
}

