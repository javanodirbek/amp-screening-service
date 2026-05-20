import React, { useState, useEffect } from 'react';

const config = {
  CLEAR:        { cls: 'badge-success',   label: 'Чисто' },
  APPROVED:     { cls: 'badge-success',   label: 'Одобрено' },
  ACTIVE:       { cls: 'badge-success',   label: 'Активен' },
  BLOCKED_AUTO: { cls: 'badge-danger',    label: 'Заблокирован' },
  REJECTED:     { cls: 'badge-danger',    label: 'Отклонено' },
  HIT:          { cls: 'badge-danger',    label: 'Совпадение' },
  INACTIVE:     { cls: 'badge-secondary', label: 'Неактивен' },
  PENDING:      { cls: 'badge-secondary', label: 'Ожидание' },
  UNDER_REVIEW: { cls: 'badge-warning',   label: 'На проверке' },
  CHECKING:     { cls: 'badge-info',      label: 'Проверка...' },
};

export default function StatusBadge({ status }) {
  const { cls, label } = config[status] || { cls: 'badge-secondary', label: status };
  return <span className={`badge-modern ${cls}`}>{label}</span>;
}

