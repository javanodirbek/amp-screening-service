import React, { useState, useEffect } from 'react';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel, danger = true }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-modern">
          <h5>
            <div className={`modal-icon ${danger ? 'danger' : 'primary'}`}>
              <i className={`bi bi-${danger ? 'exclamation-triangle' : 'question-circle'}`}></i>
            </div>
            {title || 'Подтверждение'}
          </h5>
          <button className="btn-modal-close" onClick={onCancel}>
            <i className="bi bi-x"></i>
          </button>
        </div>
        <div className="modal-body-modern">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>{message}</p>
        </div>
        <div className="modal-footer-modern">
          <button className="btn-secondary-sm" onClick={onCancel}>Отмена</button>
          <button
            className="btn-primary-sm"
            style={{ background: danger ? 'var(--danger)' : 'var(--accent)' }}
            onClick={onConfirm}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

