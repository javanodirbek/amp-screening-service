import React, { useState, useEffect } from 'react';

export default function Pagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalPages <= 1) return null;

  const { number: current, totalPages, totalElements, size } = pageData;
  const from = current * size + 1;
  const to = Math.min((current + 1) * size, totalElements);

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || (i >= current - 2 && i <= current + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== -1) {
      pages.push(-1);
    }
  }

  return (
    <div className="pagination-row">
      <span className="pagination-info">
        Показано {from}–{to} из {totalElements}
      </span>
      <div className="pagination-controls">
        <button className="page-btn" onClick={() => onPageChange(current - 1)} disabled={current === 0}>
          <i className="bi bi-chevron-left"></i>
        </button>
        {pages.map((p, i) =>
          p === -1 ? (
            <button key={`e-${i}`} className="page-btn" disabled>…</button>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === current ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p + 1}
            </button>
          )
        )}
        <button className="page-btn" onClick={() => onPageChange(current + 1)} disabled={current >= totalPages - 1}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

