import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const roleConfig = {
  ADMIN: { label: 'Администратор', color: '#7B1FA2', bg: '#F3E5F5' },
  OPERATOR: { label: 'Оператор', color: '#1565C0', bg: '#E3F2FD' },
  COMPLIANCE_OFFICER: { label: 'Офицер комплаенс', color: '#E65100', bg: '#FFF3E0' },
};

export default function UsersPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', password: '', email: '', role: 'OPERATOR' });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const resetForm = () => { setForm({ name: '', password: '', email: '', role: 'OPERATOR' }); setMessage(null); };

  const handleSave = async () => {
    if (!form.name || !form.password || form.password.length < 8) {
      setMessage({ type: 'danger', text: 'Имя и пароль (мин. 8 символов) обязательны' }); return;
    }
    setSaving(true);
    try {
      await api.post('/auth/register', form);
      setMessage({ type: 'success', text: `Пользователь "${form.name}" успешно создан` });
      setShowModal(false);
      resetForm();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка создания' });
    } finally {
      setSaving(false);
    }
  };

  const r = roleConfig[user?.role];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Пользователи системы</h1>
          <p className="page-subtitle">Управление учётными записями сотрудников</p>
        </div>
        <button className="btn-primary-sm" onClick={() => { resetForm(); setShowModal(true); }}>
          <i className="bi bi-person-plus"></i> Добавить пользователя
        </button>
      </div>

      {message && (
        <div className={`alert-row ${message.type}`} style={{ marginBottom: 20 }}>
          <i className={`bi bi-${message.type === 'danger' ? 'exclamation-circle' : 'check-circle'}`}></i>
          {message.text}
        </div>
      )}

      <div className="content-card">
        <div className="card-body-pad">
          {/* Current user info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #42A5F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {user?.username?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{user?.username}</div>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: r?.bg, color: r?.color }}>
                {r?.label}
              </span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 6px rgba(76,175,80,0.6)' }}></div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Активная сессия</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {Object.entries(roleConfig).map(([role, { label, color, bg }]) => (
              <div key={role} style={{ flex: 1, padding: 16, background: bg, borderRadius: 'var(--radius-sm)', border: `1px solid ${color}30` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{role}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5><div className="modal-icon primary"><i className="bi bi-person-plus"></i></div> Добавить пользователя</h5>
              <button className="btn-modal-close" onClick={() => setShowModal(false)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              {message && <div className="alert-row danger" style={{ marginBottom: 16 }}><i className="bi bi-exclamation-circle"></i>{message.text}</div>}
              <div className="form-row">
                <label className="form-field-label">Имя пользователя *</label>
                <input className="form-input" placeholder="Минимум 3 символа" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Пароль *</label>
                <input type="password" className="form-input" placeholder="Минимум 8 символов" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Email</label>
                <input type="email" className="form-input" placeholder="example@mail.ru" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Роль</label>
                <select className="form-select-modern" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {Object.entries(roleConfig).map(([r, { label }]) => <option key={r} value={r}>{label} ({r})</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn-primary-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Создание...' : <><i className="bi bi-check-lg"></i> Создать</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
