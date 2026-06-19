import { AlertTriangle, Bell, Clock, Phone, Mail, Eye, CalendarPlus } from 'lucide-react';
import { mockReminders } from '../../lib/mockData.js';
import styles from './SmartReminderPanel.module.css';

const URGENCY_CONFIG = {
  critical: { label: 'Critical', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', Icon: AlertTriangle },
  high:     { label: 'High',     color: '#d97706', bg: '#fffbeb', border: '#fcd34d', Icon: Bell },
  medium:   { label: 'Medium',   color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', Icon: Clock },
};

const ACTION_ICONS = {
  Call:     Phone,
  Email:    Mail,
  View:     Eye,
  Schedule: CalendarPlus,
};

export default function SmartReminderPanel() {
  const sorted = [...mockReminders].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2 };
    return order[a.urgency] - order[b.urgency];
  });

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Smart Reminders</h3>
          <span className={styles.count}>{sorted.length} alerts</span>
        </div>
        <span className={`badge badge-red`}>{sorted.filter(r => r.urgency === 'critical').length} critical</span>
      </div>

      <div className={styles.list}>
        {sorted.map(r => {
          const cfg = URGENCY_CONFIG[r.urgency];
          const ActionIcon = ACTION_ICONS[r.action] || Bell;
          return (
            <div
              key={r.id}
              className={styles.item}
              style={{ borderColor: cfg.border, background: cfg.bg }}
            >
              <div className={styles.itemHeader}>
                <cfg.Icon size={14} style={{ color: cfg.color, flexShrink: 0 }} />
                <span className={styles.clientName}>{r.client}</span>
                <span
                  className={styles.urgencyLabel}
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
              <p className={styles.message}>{r.message}</p>
              <button
                className={styles.actionBtn}
                style={{ color: cfg.color, borderColor: cfg.border }}
              >
                <ActionIcon size={13} />
                {r.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
