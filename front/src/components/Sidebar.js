import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
  >
    <i className={`bi bi-${icon}`}></i>
    <span>{label}</span>
    {badge && <span className="link-badge">{badge}</span>}
  </NavLink>
);

export default function Sidebar() {
  const { hasRole } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-section-label">Навигация</div>

      <NavItem to="/dashboard" icon="speedometer2" label="Дашборд" />
      <NavItem to="/transactions" icon="arrow-left-right" label="Транзакции" />
      <NavItem to="/blacklist" icon="shield-exclamation" label="Санкционный список" />

      {(hasRole('ADMIN') || hasRole('OPERATOR')) && (
        <NavItem to="/clients" icon="people" label="Клиенты" />
      )}

      <div className="sidebar-divider" />

      <div className="sidebar-section-label">Управление</div>

      {hasRole('ADMIN') && (
        <NavItem to="/import" icon="cloud-upload" label="Импорт JSON" />
      )}

      {hasRole('ADMIN') && (
        <NavItem to="/users" icon="person-gear" label="Пользователи" />
      )}

      <div className="sidebar-bottom">
        <div className="sidebar-threshold">
          <div className="threshold-dot"></div>
          <span className="threshold-text">Порог скрининга</span>
          <span className="threshold-value">80%</span>
        </div>
      </div>
    </aside>
  );
}

