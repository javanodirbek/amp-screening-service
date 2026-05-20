import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ClientsPage() {
  const { hasRole } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detailClient, setDetailClient] = useState(null);
  const [form, setForm] = useState({ fullName: '', birthDate: '', passportNumber: '', inn: '', phone: '', email: '' });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const resetForm = () => {
    setForm({ fullName: '', birthDate: '', passportNumber: '', inn: '', phone: '', email: '' });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!form.fullName) { setMessage({ type: 'danger', text: 'ФИО обязательно' }); return; }
    setSaving(true);
    try {
      await api.post('/clients', form);
      setShowModal(false);
      resetForm();
      fetchClients();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка' });
    } finally {
      setSaving(false);
    }
  };

  const statusColor = { ACTIVE: '#2E7D32', BLOCKED: '#C62828', PENDING_REVIEW: '#E65100' };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner-modern"></div>
        <span className="loading-text">Загрузка клиентов...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Клиенты</h1>
          <p className="page-subtitle">База данных клиентов организации</p>
        </div>
        <div className="page-header-actions">
          {(hasRole('ADMIN') || hasRole('OPERATOR')) && (
            <button className="btn-primary-sm" onClick={() => { resetForm(); setShowModal(true); }}>
              <i className="bi bi-person-plus"></i> Добавить клиента
            </button>
          )}
        </div>
      </div>

      <div className="content-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Паспорт</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Статус</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="cell-id">#{c.id}</td>
                  <td className="cell-name">{c.fullName}</td>
                  <td>{c.passportNumber || <span className="muted">—</span>}</td>
                  <td>{c.phone || <span className="muted">—</span>}</td>
                  <td>{c.email || <span className="muted">—</span>}</td>
                  <td>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                      background: c.status === 'ACTIVE' ? '#E8F5E9' : '#FFEBEE',
                      color: statusColor[c.status] || '#546E7A',
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="muted">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
                  <td>
                    <button className="btn-icon" title="Просмотр" onClick={() => setDetailClient(c)}>
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan="8">
                  <div className="empty-state">
                    <i className="bi bi-people"></i>
                    <p>Клиенты не найдены</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5>
                <div className="modal-icon primary"><i className="bi bi-person-plus"></i></div>
                Добавить клиента
              </h5>
              <button className="btn-modal-close" onClick={() => setShowModal(false)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              {message && <div className="alert-row danger" style={{ marginBottom: 16 }}><i className="bi bi-exclamation-circle"></i>{message.text}</div>}
              {[
                { label: 'ФИО *', field: 'fullName', type: 'text', placeholder: 'Иванов Иван Иванович' },
                { label: 'Дата рождения', field: 'birthDate', type: 'date', placeholder: '' },
                { label: 'Номер паспорта', field: 'passportNumber', type: 'text', placeholder: '0000 000000' },
                { label: 'ИНН', field: 'inn', type: 'text', placeholder: '123456789012' },
                { label: 'Телефон', field: 'phone', type: 'text', placeholder: '+7 000 000-00-00' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'example@mail.ru' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field} className="form-row">
                  <label className="form-field-label">{label}</label>
                  <input type={type} className="form-input" placeholder={placeholder} value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn-primary-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Сохранение...' : <><i className="bi bi-check-lg"></i> Сохранить</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailClient && (
        <div className="modal-overlay" onClick={() => setDetailClient(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5>
                <div className="modal-icon primary"><i className="bi bi-person-badge"></i></div>
                {detailClient.fullName}
              </h5>
              <button className="btn-modal-close" onClick={() => setDetailClient(null)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              <table className="detail-table">
                <tbody>
                  {[
                    ['ID', `#${detailClient.id}`],
                    ['ФИО', detailClient.fullName],
                    ['Дата рождения', detailClient.birthDate || '—'],
                    ['Паспорт', detailClient.passportNumber || '—'],
                    ['ИНН', detailClient.inn || '—'],
                    ['Телефон', detailClient.phone || '—'],
                    ['Email', detailClient.email || '—'],
                    ['Статус', detailClient.status],
                    ['Создан', detailClient.createdAt ? new Date(detailClient.createdAt).toLocaleString('ru-RU') : '—'],
                  ].map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setDetailClient(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

