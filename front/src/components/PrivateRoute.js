import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, roles }) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles && roles.length > 0) {
    const allowed = roles.some((r) => hasRole(r));
    if (!allowed) {
      return (
        <div style={{ padding: 40 }}>
          <div className="alert-row danger">
            <i className="bi bi-exclamation-triangle-fill"></i>
            Доступ запрещён. У вас нет прав для просмотра этой страницы.
          </div>
        </div>
      );
    }
  }

  return children;
}

