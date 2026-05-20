import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

const listTypes = ['TERRORIST', 'EXTREMIST', 'SANCTIONS_RU', 'SANCTIONS_EU', 'ROSFINMONITORING'];

const listTypeLabel = {
  TERRORIST: 'Терроризм',
  EXTREMIST: 'Экстремизм',
  SANCTIONS_RU: 'Санкции РФ',
  SANCTIONS_EU: 'Санкции ЕС',
  ROSFINMONITORING: 'Росфинмониторинг',
};

export default function BlacklistPage() {
  const { hasRole } = useAuth();
  const [entries, setEntries] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [detailEntry, setDetailEntry] = useState(null);
  const [form, setForm] = useState({ fullName: '', birthDate: '', passportNumber: '', inn: '', listType: 'TERRORIST' });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.listType = typeFilter;
      const res = await api.get('/blacklist', { params });
      setEntries(res.data.content || []);
      setPageData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, [page, statusFilter, typeFilter]);

  const resetForm = () => {
    setForm({ fullName: '', birthDate: '', passportNumber: '', inn: '', listType: 'TERRORIST' });
    setMessage(null);
  };

  const openAdd = () => { setEditingEntry(null); resetForm(); setShowModal(true); };

  const openEdit = (e) => {
    setEditingEntry(e);
    setForm({ fullName: e.fullName || '', birthDate: e.birthDate || '', passportNumber: e.passportNumber || '', inn: e.inn || '', listType: e.listType || 'TERRORIST' });
    setMessage(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) { setMessage({ type: 'danger', text: 'ФИО обязательно' }); return; }
    setSaving(true);
    try {
      if (editingEntry) {
        await api.patch(`/blacklist/${editingEntry.id}`, form);
      } else {
        await api.post('/blacklist', form);
      }
      setShowModal(false);
      resetForm();
      fetchEntries();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка сохранения' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/blacklist/${confirmDelete.id}`);
      setConfirmDelete(null);
      fetchEntries();
    } catch (err) {
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Санкционный список</h1>
          <p className="page-subtitle">Перечни Росфинмониторинга и международных санкций</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary-sm" onClick={fetchEntries}>
            <i className="bi bi-arrow-clockwise"></i> Обновить
          </button>
          {hasRole('ADMIN') && (
            <button className="btn-primary-sm" onClick={openAdd}>
              <i className="bi bi-plus-lg"></i> Добавить запись
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`alert-row ${message.type}`}>
          <i className={`bi bi-${message.type === 'danger' ? 'exclamation-circle' : 'check-circle'}`}></i>
          {message.text}
        </div>
      )}

      <div className="content-card">
        <div className="filter-bar">
          <span className="filter-label">Фильтр:</span>
          <select className="select-modern" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <option value="">Все статусы</option>
            <option value="ACTIVE">Активные</option>
            <option value="INACTIVE">Неактивные</option>
          </select>
          <select className="select-modern" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
            <option value="">Все типы</option>
            {listTypes.map((lt) => <option key={lt} value={lt}>{listTypeLabel[lt]}</option>)}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="loading-center" style={{ padding: 48 }}>
              <div className="spinner-modern"></div>
            </div>
          ) : (
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ФИО / Наименование</th>
                  <th>Паспорт</th>
                  <th>ИНН</th>
                  <th>Тип списка</th>
                  <th>Статус</th>
                  <th>Добавил</th>
                  <th>Дата добавления</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="clickable-row" onClick={() => setDetailEntry(e)}>
                    <td className="cell-id">#{e.id}</td>
                    <td className="cell-name">{e.fullName}</td>
                    <td>{e.passportNumber || <span className="muted">—</span>}</td>
                    <td>{e.inn || <span className="muted">—</span>}</td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', background: '#EEF2FF', color: '#3730A3', borderRadius: 4 }}>
                        {listTypeLabel[e.listType] || e.listType}
                      </span>
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td className="muted">{e.addedBy || '—'}</td>
                    <td className="muted">{e.addedAt ? new Date(e.addedAt).toLocaleDateString('ru-RU') : '—'}</td>
                    <td onClick={(ev) => ev.stopPropagation()}>
                      <div className="actions-cell">
                        {(hasRole('ADMIN') || hasRole('COMPLIANCE_OFFICER')) && (
                          <button className="btn-icon" title="Редактировать" onClick={() => openEdit(e)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                        {hasRole('ADMIN') && e.status === 'ACTIVE' && (
                          <button className="btn-icon danger" title="Деактивировать" onClick={() => setConfirmDelete(e)}>
                            <i className="bi bi-archive"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr><td colSpan="9">
                    <div className="empty-state">
                      <i className="bi bi-shield-slash"></i>
                      <p>Записи не найдены</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination pageData={pageData} onPageChange={setPage} />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5>
                <div className="modal-icon primary">
                  <i className={`bi bi-${editingEntry ? 'pencil' : 'plus-lg'}`}></i>
                </div>
                {editingEntry ? 'Редактировать запись' : 'Добавить запись'}
              </h5>
              <button className="btn-modal-close" onClick={() => setShowModal(false)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              {message && (
                <div className="alert-row danger" style={{ marginBottom: 16 }}>
                  <i className="bi bi-exclamation-circle"></i>{message.text}
                </div>
              )}
              <div className="form-row">
                <label className="form-field-label">ФИО / Наименование *</label>
                <input className="form-input" placeholder="Иванов Иван Иванович" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Дата рождения</label>
                <input type="date" className="form-input" value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Номер паспорта</label>
                <input className="form-input" placeholder="0000 000000" value={form.passportNumber}
                  onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">ИНН</label>
                <input className="form-input" placeholder="123456789012" maxLength={12} value={form.inn}
                  onChange={(e) => setForm({ ...form, inn: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Тип списка *</label>
                <select className="form-select-modern" value={form.listType}
                  onChange={(e) => setForm({ ...form, listType: e.target.value })}>
                  {listTypes.map((lt) => <option key={lt} value={lt}>{listTypeLabel[lt]}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn-primary-sm" onClick={handleSave} disabled={saving}>
                {saving ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> Сохранение...</> : <><i className="bi bi-check-lg"></i> Сохранить</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailEntry && (
        <div className="modal-overlay" onClick={() => setDetailEntry(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5>
                <div className="modal-icon primary"><i className="bi bi-person-vcard"></i></div>
                Запись #{detailEntry.id}
              </h5>
              <button className="btn-modal-close" onClick={() => setDetailEntry(null)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              <table className="detail-table">
                <tbody>
                  <tr><td>ФИО</td><td><strong>{detailEntry.fullName}</strong></td></tr>
                  <tr><td>Дата рождения</td><td>{detailEntry.birthDate || '—'}</td></tr>
                  <tr><td>Паспорт</td><td>{detailEntry.passportNumber || '—'}</td></tr>
                  <tr><td>ИНН</td><td>{detailEntry.inn || '—'}</td></tr>
                  <tr><td>Тип списка</td><td>{listTypeLabel[detailEntry.listType] || detailEntry.listType}</td></tr>
                  <tr><td>Статус</td><td><StatusBadge status={detailEntry.status} /></td></tr>
                  <tr><td>Добавил</td><td>{detailEntry.addedBy || '—'}</td></tr>
                  <tr><td>Дата добавления</td><td>{detailEntry.addedAt ? new Date(detailEntry.addedAt).toLocaleString('ru-RU') : '—'}</td></tr>
                  <tr><td>Обновлён</td><td>{detailEntry.updatedAt ? new Date(detailEntry.updatedAt).toLocaleString('ru-RU') : '—'}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setDetailEntry(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={!!confirmDelete}
        title="Деактивировать запись"
        message={`Запись "${confirmDelete?.fullName}" будет деактивирована. Она останется в базе со статусом INACTIVE.`}
        onConfirm={handleDeactivate}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

