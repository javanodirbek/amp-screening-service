import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';

const statuses = ['PENDING', 'CHECKING', 'CLEAR', 'BLOCKED_AUTO', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
const currencies = ['RUB', 'USD', 'EUR'];

function MatchScore({ tx }) {
  if (!tx.checkResult) return <span className="muted">—</span>;
  const score = tx.checkResult.matchScore;
  if (score == null) return <span className="muted">—</span>;
  const pct = (score * 100).toFixed(1);
  const isHit = tx.checkResult.result === 'HIT';
  const fillColor = isHit ? 'var(--danger)' : '#4CAF50';
  return (
    <div className="match-score">
      <div className="match-score-bar">
        <div className="match-score-fill" style={{ width: `${Math.min(score * 100, 100)}%`, background: fillColor }}></div>
      </div>
      <span style={{ color: fillColor, fontWeight: 700 }}>{pct}%</span>
    </div>
  );
}

export default function TransactionsPage() {
  const { hasRole } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [globalMessage, setGlobalMessage] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [clients, setClients] = useState([]);
  const [createForm, setCreateForm] = useState({ clientId: '', recipientName: '', recipientPassport: '', amount: '', currency: 'RUB' });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

  const [detailTx, setDetailTx] = useState(null);

  const [approveTx, setApproveTx] = useState(null);
  const [approveComment, setApproveComment] = useState('');
  const [approving, setApproving] = useState(false);

  const [rejectTx, setRejectTx] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/transactions', { params });
      setTransactions(res.data.content || []);
      setPageData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  useEffect(() => {
    const hasChecking = transactions.some((t) => t.status === 'CHECKING');
    if (!hasChecking) return;
    const timer = setTimeout(fetchTransactions, 30000);
    return () => clearTimeout(timer);
  }, [transactions, fetchTransactions]);

  const openCreate = async () => {
    setCreateMsg(null);
    setCreateForm({ clientId: '', recipientName: '', recipientPassport: '', amount: '', currency: 'RUB' });
    try {
      const res = await api.get('/clients');
      setClients(res.data || []);
    } catch (e) {}
    setShowCreate(true);
  };

  const handleCreate = async () => {
    if (!createForm.clientId || !createForm.recipientName.trim() || !createForm.amount) {
      setCreateMsg({ type: 'danger', text: 'Клиент, получатель и сумма обязательны' }); return;
    }
    if (parseFloat(createForm.amount) <= 0) {
      setCreateMsg({ type: 'danger', text: 'Сумма должна быть положительной' }); return;
    }
    setCreating(true);
    try {
      await api.post('/transactions', {
        clientId: parseInt(createForm.clientId),
        recipientName: createForm.recipientName,
        recipientPassport: createForm.recipientPassport,
        amount: parseFloat(createForm.amount),
        currency: createForm.currency,
      });
      setShowCreate(false);
      fetchTransactions();
    } catch (err) {
      setCreateMsg({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка создания' });
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitReview = async (id) => {
    try {
      await api.post(`/transactions/${id}/submit-review`);
      fetchTransactions();
    } catch (err) {
      setGlobalMessage({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка' });
    }
  };

  const handleApprove = async () => {
    if (!approveComment.trim()) return;
    setApproving(true);
    try {
      await api.post(`/transactions/${approveTx.id}/approve`, { comment: approveComment });
      setApproveTx(null); setApproveComment('');
      fetchTransactions();
    } catch (err) {
      setGlobalMessage({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка' });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) return;
    setRejecting(true);
    try {
      await api.post(`/transactions/${rejectTx.id}/reject`, { comment: rejectComment });
      setRejectTx(null); setRejectComment('');
      fetchTransactions();
    } catch (err) {
      setGlobalMessage({ type: 'danger', text: err.response?.data?.message?.[0] || 'Ошибка' });
    } finally {
      setRejecting(false);
    }
  };

  const fetchDetail = async (id) => {
    try {
      const res = await api.get(`/transactions/${id}`);
      setDetailTx(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Транзакции</h1>
          <p className="page-subtitle">Мониторинг и проверка финансовых операций</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary-sm" onClick={fetchTransactions}>
            <i className="bi bi-arrow-clockwise"></i> Обновить
          </button>
          {(hasRole('ADMIN') || hasRole('OPERATOR')) && (
            <button className="btn-primary-sm" onClick={openCreate}>
              <i className="bi bi-plus-lg"></i> Создать транзакцию
            </button>
          )}
        </div>
      </div>

      {globalMessage && (
        <div className={`alert-row ${globalMessage.type}`}>
          <i className="bi bi-exclamation-circle"></i>{globalMessage.text}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={() => setGlobalMessage(null)}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      <div className="content-card">
        <div className="filter-bar">
          <span className="filter-label">Статус:</span>
          <select className="select-modern" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <option value="">Все транзакции</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
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
                  <th>Клиент</th>
                  <th>Получатель</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Совпадение</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="cell-id">#{tx.id}</td>
                    <td className="cell-name">{tx.clientName}</td>
                    <td>{tx.recipientName}</td>
                    <td>
                      <span className="cell-amount">{tx.amount?.toLocaleString('ru-RU')}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{tx.currency}</span>
                    </td>
                    <td><StatusBadge status={tx.status} /></td>
                    <td><MatchScore tx={tx} /></td>
                    <td className="muted">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-icon" title="Детали" onClick={() => fetchDetail(tx.id)}>
                          <i className="bi bi-eye"></i>
                        </button>
                        {tx.status === 'BLOCKED_AUTO' && (
                          <button className="btn-icon warning" title="На проверку" onClick={() => handleSubmitReview(tx.id)}>
                            <i className="bi bi-send"></i>
                          </button>
                        )}
                        {tx.status === 'UNDER_REVIEW' && hasRole('COMPLIANCE_OFFICER') && (
                          <>
                            <button className="btn-icon success" title="Одобрить" onClick={() => { setApproveTx(tx); setApproveComment(''); }}>
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button className="btn-icon danger" title="Отклонить" onClick={() => { setRejectTx(tx); setRejectComment(''); }}>
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan="8">
                    <div className="empty-state">
                      <i className="bi bi-inbox"></i>
                      <p>Транзакции не найдены</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination pageData={pageData} onPageChange={setPage} />
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5><div className="modal-icon primary"><i className="bi bi-plus-lg"></i></div> Создать транзакцию</h5>
              <button className="btn-modal-close" onClick={() => setShowCreate(false)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              {createMsg && <div className="alert-row danger" style={{ marginBottom: 16 }}><i className="bi bi-exclamation-circle"></i>{createMsg.text}</div>}
              <div className="form-row">
                <label className="form-field-label">Клиент *</label>
                <select className="form-select-modern" value={createForm.clientId} onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}>
                  <option value="">Выберите клиента</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-field-label">Получатель *</label>
                <input className="form-input" placeholder="ФИО получателя" value={createForm.recipientName}
                  onChange={(e) => setCreateForm({ ...createForm, recipientName: e.target.value })} />
              </div>
              <div className="form-row">
                <label className="form-field-label">Паспорт получателя</label>
                <input className="form-input" placeholder="0000 000000" value={createForm.recipientPassport}
                  onChange={(e) => setCreateForm({ ...createForm, recipientPassport: e.target.value })} />
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <div>
                  <label className="form-field-label">Сумма *</label>
                  <input type="number" className="form-input" min="0" step="0.01" placeholder="0.00" value={createForm.amount}
                    onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} />
                </div>
                <div>
                  <label className="form-field-label">Валюта</label>
                  <select className="form-select-modern" value={createForm.currency} onChange={(e) => setCreateForm({ ...createForm, currency: e.target.value })} style={{ minWidth: 90 }}>
                    {currencies.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setShowCreate(false)}>Отмена</button>
              <button className="btn-primary-sm" onClick={handleCreate} disabled={creating}>
                {creating ? 'Создание...' : <><i className="bi bi-check-lg"></i> Создать</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailTx && (
        <div className="modal-overlay" onClick={() => setDetailTx(null)}>
          <div className="modal-box wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5><div className="modal-icon primary"><i className="bi bi-receipt"></i></div> Транзакция #{detailTx.id}</h5>
              <button className="btn-modal-close" onClick={() => setDetailTx(null)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              <table className="detail-table">
                <tbody>
                  <tr><td>Статус</td><td><StatusBadge status={detailTx.status} /></td></tr>
                  <tr><td>Клиент</td><td><strong>{detailTx.clientName}</strong></td></tr>
                  <tr><td>Получатель</td><td><strong>{detailTx.recipientName}</strong></td></tr>
                  <tr><td>Паспорт получателя</td><td>{detailTx.recipientPassport || '—'}</td></tr>
                  <tr><td>Сумма</td><td><strong>{detailTx.amount?.toLocaleString('ru-RU')} {detailTx.currency}</strong></td></tr>
                  <tr><td>Создана</td><td>{detailTx.createdAt ? new Date(detailTx.createdAt).toLocaleString('ru-RU') : '—'}</td></tr>
                  {detailTx.reviewedBy && <tr><td>Проверил</td><td>{detailTx.reviewedBy}</td></tr>}
                  {detailTx.reviewComment && <tr><td>Комментарий</td><td style={{ fontStyle: 'italic' }}>"{detailTx.reviewComment}"</td></tr>}
                </tbody>
              </table>

              {detailTx.checkResult && (
                <div className="detail-section">
                  <div className="detail-section-title">
                    <i className="bi bi-shield-check" style={{ color: detailTx.checkResult.result === 'HIT' ? 'var(--danger)' : '#2E7D32' }}></i>
                    Результат автоматической проверки
                  </div>
                  <table className="detail-table">
                    <tbody>
                      <tr><td>Результат</td><td><StatusBadge status={detailTx.checkResult.result} /></td></tr>
                      <tr>
                        <td>Степень совпадения</td>
                        <td>
                          <div className="match-score">
                            <div className="match-score-bar" style={{ width: 80 }}>
                              <div className="match-score-fill" style={{
                                width: `${(detailTx.checkResult.matchScore || 0) * 100}%`,
                                background: detailTx.checkResult.result === 'HIT' ? 'var(--danger)' : '#4CAF50'
                              }}></div>
                            </div>
                            <strong style={{ color: detailTx.checkResult.result === 'HIT' ? 'var(--danger)' : '#2E7D32', fontSize: 15 }}>
                              {detailTx.checkResult.matchScore != null ? (detailTx.checkResult.matchScore * 100).toFixed(1) + '%' : '—'}
                            </strong>
                          </div>
                        </td>
                      </tr>
                      <tr><td>Порог проверки</td><td>{detailTx.checkResult.threshold != null ? (detailTx.checkResult.threshold * 100).toFixed(0) + '%' : '—'}</td></tr>
                      {detailTx.checkResult.matchedEntryName && (
                        <tr>
                          <td>Совпадение с</td>
                          <td><strong style={{ color: 'var(--danger)' }}>{detailTx.checkResult.matchedEntryName}</strong></td>
                        </tr>
                      )}
                      <tr><td>Алгоритм</td><td>{detailTx.checkResult.algorithm || '—'}</td></tr>
                      <tr><td>Дата проверки</td><td>{detailTx.checkResult.checkDate ? new Date(detailTx.checkResult.checkDate).toLocaleString('ru-RU') : '—'}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setDetailTx(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveTx && (
        <div className="modal-overlay" onClick={() => setApproveTx(null)}>
          <div className="modal-box" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5><div className="modal-icon success"><i className="bi bi-check-circle"></i></div> Одобрить транзакцию #{approveTx.id}</h5>
              <button className="btn-modal-close" onClick={() => setApproveTx(null)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Укажите основание для одобрения транзакции. Это действие будет зафиксировано в системе.
              </p>
              <div className="form-row">
                <label className="form-field-label">Комментарий *</label>
                <textarea className="form-textarea" rows={3}
                  placeholder="Укажите основание для одобрения..."
                  value={approveComment} onChange={(e) => setApproveComment(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setApproveTx(null)}>Отмена</button>
              <button className="btn-primary-sm" style={{ background: '#2E7D32' }} onClick={handleApprove} disabled={approving || !approveComment.trim()}>
                {approving ? 'Одобрение...' : <><i className="bi bi-check-lg"></i> Одобрить</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTx && (
        <div className="modal-overlay" onClick={() => setRejectTx(null)}>
          <div className="modal-box" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h5><div className="modal-icon danger"><i className="bi bi-x-circle"></i></div> Отклонить транзакцию #{rejectTx.id}</h5>
              <button className="btn-modal-close" onClick={() => setRejectTx(null)}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body-modern">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Укажите причину отклонения. Транзакция будет заблокирована окончательно.
              </p>
              <div className="form-row">
                <label className="form-field-label">Причина отклонения *</label>
                <textarea className="form-textarea" rows={3}
                  placeholder="Укажите причину отклонения..."
                  value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary-sm" onClick={() => setRejectTx(null)}>Отмена</button>
              <button className="btn-primary-sm" style={{ background: 'var(--danger)' }} onClick={handleReject} disabled={rejecting || !rejectComment.trim()}>
                {rejecting ? 'Отклонение...' : <><i className="bi bi-x-lg"></i> Отклонить</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

