import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, blocked: 0, underReview: 0, blacklist: 0 });
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, blRes] = await Promise.all([
          api.get('/transactions?page=0&size=10'),
          api.get('/blacklist?status=ACTIVE&page=0&size=1'),
        ]);
        const content = txRes.data.content || [];
        setStats({
          total: txRes.data.totalElements || 0,
          blocked: content.filter((t) => t.status === 'BLOCKED_AUTO').length,
          underReview: content.filter((t) => t.status === 'UNDER_REVIEW').length,
          blacklist: blRes.data.totalElements || 0,
        });
        setRecentTx(content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner-modern"></div>
        <span className="loading-text">Загрузка данных...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Дашборд</h1>
          <p className="page-subtitle">Обзор системы финансового мониторинга</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card primary">
          <div className="stat-icon primary"><i className="bi bi-arrow-left-right"></i></div>
          <div className="stat-content">
            <div className="stat-value primary">{stats.total}</div>
            <div className="stat-label">Всего транзакций</div>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon danger"><i className="bi bi-shield-x"></i></div>
          <div className="stat-content">
            <div className="stat-value danger">{stats.blocked}</div>
            <div className="stat-label">Заблокировано</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon warning"><i className="bi bi-hourglass-split"></i></div>
          <div className="stat-content">
            <div className="stat-value warning">{stats.underReview}</div>
            <div className="stat-label">На рассмотрении</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon success"><i className="bi bi-exclamation-circle"></i></div>
          <div className="stat-content">
            <div className="stat-value success">{stats.blacklist}</div>
            <div className="stat-label">В санкционном списке</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header-row">
          <h5><i className="bi bi-clock-history" style={{ color: 'var(--accent)' }}></i> Последние транзакции</h5>
          <button className="btn-secondary-sm" onClick={() => navigate('/transactions')}>
            Все транзакции <i className="bi bi-arrow-right"></i>
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Получатель</th>
                <th>Сумма</th>
                <th>Валюта</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className="clickable-row" onClick={() => navigate('/transactions')}>
                  <td className="cell-id">#{tx.id}</td>
                  <td className="cell-name">{tx.clientName}</td>
                  <td>{tx.recipientName}</td>
                  <td className="cell-amount">{tx.amount?.toLocaleString('ru-RU')}</td>
                  <td><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{tx.currency}</span></td>
                  <td><StatusBadge status={tx.status} /></td>
                  <td className="muted">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('ru-RU') : '-'}</td>
                </tr>
              ))}
              {recentTx.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <i className="bi bi-inbox"></i>
                      <p>Транзакции отсутствуют</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

