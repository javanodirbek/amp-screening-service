import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const listTypes = ['TERRORIST', 'EXTREMIST', 'SANCTIONS_RU', 'SANCTIONS_EU', 'ROSFINMONITORING'];

export default function ImportPage() {
  const [jsonData, setJsonData] = useState(null);
  const [manualRows, setManualRows] = useState([]);
  const [result, setResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const parseFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.entries && Array.isArray(data.entries)) {
          setJsonData(data.entries);
          setMessage(null);
        } else {
          setMessage({ type: 'danger', text: 'JSON должен содержать поле "entries" с массивом' });
        }
      } catch (error) {
        setMessage({ type: 'danger', text: `Ошибка парсинга JSON: ${error.message}` });
      }
    };
    reader.onerror = () => {
      setMessage({ type: 'danger', text: 'Ошибка чтения файла' });
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e) => parseFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); parseFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const doImport = async (entries) => {
    setImporting(true);
    setMessage(null);
    try {
      const res = await api.post('/blacklist/import', { entries });
      setResult(res.data);
      setJsonData(null);
      setManualRows([]);
      setMessage({ type: 'success', text: 'Импорт успешно завершён' });
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      const displayMsg = Array.isArray(errorMsg) ? errorMsg[0] : (errorMsg || err.message || 'Ошибка импорта');
      setMessage({ type: 'danger', text: displayMsg });
    } finally {
      setImporting(false);
    }
  };

  const addRow = () => setManualRows([...manualRows, { fullName: '', birthDate: '', passportNumber: '', listType: 'TERRORIST' }]);
  const updateRow = (i, f, v) => { const u = [...manualRows]; u[i][f] = v; setManualRows(u); };
  const removeRow = (i) => setManualRows(manualRows.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Импорт данных</h1>
          <p className="page-subtitle">Массовая загрузка записей в санкционный список</p>
        </div>
      </div>

      {message && (
        <div className={`alert-row ${message.type}`} style={{ marginBottom: 20 }}>
          <i className={`bi bi-${message.type === 'danger' ? 'exclamation-circle' : 'check-circle'}`}></i>
          {message.text}
        </div>
      )}

      {result && (
        <div className="import-result success" style={{ marginBottom: 20 }}>
          <i className="bi bi-check-circle-fill" style={{ fontSize: 20, flexShrink: 0 }}></i>
          <div>
            <strong>Импорт завершён</strong>
            <div style={{ marginTop: 6, display: 'flex', gap: 20 }}>
              <span>✅ Импортировано: <strong>{result.imported}</strong></span>
              <span>⏭ Пропущено: <strong>{result.skipped}</strong></span>
              <span>❌ Ошибок: <strong>{result.errors}</strong></span>
            </div>
            {result.errorMessages?.length > 0 && (
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                {result.errorMessages.map((m, i) => <li key={i} style={{ fontSize: 12 }}>{m}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* JSON Upload */}
      <div className="content-card" style={{ marginBottom: 20 }}>
        <div className="card-header-row">
          <h5><i className="bi bi-file-earmark-json" style={{ color: 'var(--accent)' }}></i> Загрузка JSON файла</h5>
        </div>
        <div className="card-body-pad">
          <div
            className={`dropzone ${dragOver ? 'active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input id="file-input" type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileInput} />
            <div className="dropzone-icon">
              <i className="bi bi-cloud-upload" style={{ color: dragOver ? 'var(--accent)' : 'var(--text-muted)' }}></i>
            </div>
            <h6>Перетащите JSON файл или нажмите для выбора</h6>
            <p>Поддерживаются файлы .json</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Формат файла:</p>
            <div className="code-block">{`{
  "entries": [
    {
      "fullName": "Иванов Иван Иванович",
      "birthDate": "1980-05-15",
      "passportNumber": "4510 123456",
      "listType": "TERRORIST"
    }
  ]
}`}</div>
          </div>

          {jsonData && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  Предпросмотр: <span style={{ color: 'var(--accent)' }}>{jsonData.length} записей</span>
                </span>
                <button className="btn-primary-sm" onClick={() => doImport(jsonData)} disabled={importing}>
                  {importing ? 'Импорт...' : <><i className="bi bi-upload"></i> Импортировать {jsonData.length} записей</>}
                </button>
              </div>
              <div style={{ maxHeight: 240, overflowY: 'auto', borderRadius: 6, border: '1px solid var(--border)' }}>
                <table className="table-modern">
                  <thead>
                    <tr><th>ФИО</th><th>Дата рождения</th><th>Паспорт</th><th>Тип</th></tr>
                  </thead>
                  <tbody>
                    {jsonData.map((e, i) => (
                      <tr key={i}>
                        <td>{e.fullName}</td>
                        <td>{e.birthDate || '—'}</td>
                        <td>{e.passportNumber || '—'}</td>
                        <td><span style={{ fontSize: 11, fontWeight: 600 }}>{e.listType}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manual Input */}
      <div className="content-card">
        <div className="card-header-row">
          <h5><i className="bi bi-table" style={{ color: 'var(--accent)' }}></i> Ручной ввод</h5>
          <button className="btn-secondary-sm" onClick={addRow}>
            <i className="bi bi-plus-lg"></i> Добавить строку
          </button>
        </div>
        {manualRows.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-table"></i>
            <p>Нажмите "Добавить строку" для ручного ввода</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-modern">
                <thead>
                  <tr><th>ФИО *</th><th>Дата рождения</th><th>Паспорт</th><th>Тип списка *</th><th></th></tr>
                </thead>
                <tbody>
                  {manualRows.map((row, i) => (
                    <tr key={i}>
                      <td><input className="form-input" style={{ minWidth: 200 }} placeholder="Иванов Иван Иванович" value={row.fullName} onChange={(e) => updateRow(i, 'fullName', e.target.value)} /></td>
                      <td><input type="date" className="form-input" value={row.birthDate} onChange={(e) => updateRow(i, 'birthDate', e.target.value)} /></td>
                      <td><input className="form-input" placeholder="0000 000000" value={row.passportNumber} onChange={(e) => updateRow(i, 'passportNumber', e.target.value)} /></td>
                      <td>
                        <select className="form-select-modern" value={row.listType} onChange={(e) => updateRow(i, 'listType', e.target.value)}>
                          {listTypes.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
                        </select>
                      </td>
                      <td>
                        <button className="btn-icon danger" onClick={() => removeRow(i)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary-sm" onClick={() => doImport(manualRows.filter(r => r.fullName.trim()))} disabled={importing}>
                {importing ? 'Импорт...' : <><i className="bi bi-upload"></i> Импортировать всё</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

