import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('OPERATOR');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Введите логин и пароль'); return; }
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      const msg = err.response?.data?.message?.[0] || err.response?.data?.message || 'Неверный логин или пароль';
      setError(typeof msg === 'string' ? msg : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!username || !password || password.length < 8) {
      setError('Имя и пароль (мин. 8 символов) обязательны'); return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name: username, password, email, role });
      setSuccess(`Пользователь "${username}" создан. Войдите в систему.`);
      setUsername(''); setPassword(''); setEmail('');
      setMode('login');
    } catch (err) {
      const msg = err.response?.data?.message?.[0] || 'Ошибка регистрации';
      setError(typeof msg === 'string' ? msg : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-logo-area">
          <div className="login-emblem">
            <i className="bi bi-shield-fill-check"></i>
          </div>
          <div className="login-logo-text">
            <span className="login-logo-main">АМЛ Скрининг</span>
            <span className="login-logo-sub">Система финансового мониторинга</span>
          </div>
        </div>

        <div className="login-headline">
          <h1>
            Защита от<br />
            <span>финансовых рисков</span>
          </h1>
          <p>
            Автоматизированная система проверки транзакций и клиентов по перечням
            Федеральной службы по финансовому мониторингу.
          </p>
        </div>

        <div className="login-features">
          <div className="login-feature-item">
            <div className="login-feature-icon">
              <i className="bi bi-lightning-charge" style={{ color: '#42A5F5' }}></i>
            </div>
            <span className="login-feature-text">Мгновенная автоматическая проверка транзакций</span>
          </div>
          <div className="login-feature-item">
            <div className="login-feature-icon">
              <i className="bi bi-database-check" style={{ color: '#66BB6A' }}></i>
            </div>
            <span className="login-feature-text">Нечёткое сопоставление по перечням Росфинмониторинга</span>
          </div>
          <div className="login-feature-item">
            <div className="login-feature-icon">
              <i className="bi bi-person-lock" style={{ color: '#FFA726' }}></i>
            </div>
            <span className="login-feature-text">Разграничение доступа по ролям</span>
          </div>
          <div className="login-feature-item">
            <div className="login-feature-icon">
              <i className="bi bi-graph-up-arrow" style={{ color: '#AB47BC' }}></i>
            </div>
            <span className="login-feature-text">Полный аудит проверок и решений</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-box">
          <div className="login-form-header">
            <h2>{mode === 'login' ? 'Вход в систему' : 'Регистрация'}</h2>
            <p>{mode === 'login' ? 'Введите учётные данные для доступа' : 'Создание нового пользователя'}</p>
          </div>

          {error && (
            <div className="alert-modern alert-danger-modern">
              <i className="bi bi-exclamation-circle-fill"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert-modern alert-success-modern">
              <i className="bi bi-check-circle-fill"></i>
              {success}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label-modern">Логин</label>
                <div className="input-wrapper">
                  <i className="bi bi-person input-icon"></i>
                  <input
                    type="text"
                    className="input-modern"
                    placeholder="Введите логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-modern">Пароль</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <i className="bi bi-lock input-icon"></i>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input-modern"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      fontSize: 16, padding: 0, display: 'flex',
                    }}
                  >
                    <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary-modern" disabled={loading}>
                {loading
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> Вход...</>
                  : <><i className="bi bi-box-arrow-in-right"></i> Войти</>
                }
              </button>

              <div className="login-divider" style={{ marginTop: 24 }}>или</div>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button type="button" className="btn-link-modern" onClick={() => { setError(''); setSuccess(''); setMode('register'); }}>
                  Зарегистрировать пользователя
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label-modern">Имя пользователя *</label>
                <div className="input-wrapper">
                  <i className="bi bi-person input-icon"></i>
                  <input
                    type="text" className="input-modern" placeholder="Минимум 3 символа"
                    value={username} onChange={(e) => setUsername(e.target.value)} autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-modern">Пароль *</label>
                <div className="input-wrapper">
                  <i className="bi bi-lock input-icon"></i>
                  <input
                    type="password" className="input-modern" placeholder="Минимум 8 символов"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-modern">Email</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope input-icon"></i>
                  <input
                    type="email" className="input-modern" placeholder="example@mail.ru"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-modern">Роль</label>
                <select className="input-modern" style={{ appearance: 'auto' }} value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="ADMIN">Администратор (ADMIN)</option>
                  <option value="OPERATOR">Оператор (OPERATOR)</option>
                  <option value="COMPLIANCE_OFFICER">Офицер комплаенс (COMPLIANCE_OFFICER)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary-modern" disabled={loading}>
                {loading
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> Создание...</>
                  : <><i className="bi bi-person-plus"></i> Зарегистрировать</>
                }
              </button>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button type="button" className="btn-link-modern" onClick={() => { setError(''); setSuccess(''); setMode('login'); }}>
                  ← Вернуться к входу
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

