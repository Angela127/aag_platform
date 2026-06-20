import { useState, useEffect } from 'react';
import { X, Clock, ChevronRight, Bookmark, Bell, AlertTriangle, Award, Calendar } from 'lucide-react';
import { mockMeetings, mockReminders, mockCPD, mockTopPartner } from '../../lib/mockData.js';
import styles from './MorningBriefingModal.module.css';

export default function MorningBriefingModal({ onClose }) {
  const [tab, setTab] = useState('meetings');
  const todayMeetings = mockMeetings.filter(m => m.date === '2026-06-20');

  const urgencyIcon = (u) => {
    if (u === 'critical') return <AlertTriangle size={14} />;
    if (u === 'high') return <Bell size={14} />;
    return <Clock size={14} />;
  };

  const urgencyColor = { critical: '#dc2626', high: '#d97706', medium: '#2563eb' };

  const cpdPct = Math.round((mockCPD.done / mockCPD.total) * 100);

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Good morning 👋</h2>
            <p className={styles.subtitle}>Here's your briefing for today</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id: 'meetings',  label: 'Meetings', icon: Calendar },
            { id: 'reminders', label: 'Smart Reminders', icon: Bell },
            { id: 'cpd',       label: 'CPD & Partner', icon: Award },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.body}>

          {/* Meetings tab */}
          {tab === 'meetings' && (
            <div className={styles.timeline}>
              {todayMeetings.map((m, i) => (
                <div key={m.id} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}>
                    <span className={styles.timeLabel}>{m.time}</span>
                    <div className={`${styles.dot} ${styles[`dot_${m.type}`]}`} />
                    {i < todayMeetings.length - 1 && <div className={styles.connector} />}
                  </div>
                  <div className={styles.timelineCard}>
                    <div className={styles.meetingClient}>{m.client}</div>
                    <div className={styles.meetingMeta}>
                      <span className={`badge badge-${m.type === 'new' ? 'blue' : m.type === 'followup' ? 'amber' : 'gray'}`}>
                        {m.type === 'new' ? 'New Client' : m.type === 'followup' ? 'Follow-up' : 'Review'}
                      </span>
                      <span className={styles.meetingLoc}>📍 {m.location}</span>
                      <span className={styles.meetingDur}>{m.time} – {m.endTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reminders tab */}
          {tab === 'reminders' && (
            <div className={styles.reminderList}>
              {mockReminders.map(r => (
                <div key={r.id} className={styles.reminderItem}>
                  <div
                    className={styles.urgencyBar}
                    style={{ background: urgencyColor[r.urgency] }}
                  />
                  <div className={styles.reminderContent}>
                    <div className={styles.reminderTop}>
                      <span
                        className={styles.urgencyIcon}
                        style={{ color: urgencyColor[r.urgency] }}
                      >
                        {urgencyIcon(r.urgency)}
                      </span>
                      <strong className={styles.reminderClient}>{r.client}</strong>
                      <span
                        className={`badge ${r.urgency === 'critical' ? 'badge-red' : r.urgency === 'high' ? 'badge-amber' : 'badge-blue'}`}
                        style={{ marginLeft: 'auto' }}
                      >
                        {r.urgency}
                      </span>
                    </div>
                    <p className={styles.reminderMsg}>{r.message}</p>
                    <button className={`btn btn-sm btn-secondary`} style={{ marginTop: 8 }}>
                      {r.action} <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CPD & Partner tab */}
          {tab === 'cpd' && (
            <div className={styles.cpdSection}>
              <div className={styles.cpdCard}>
                <h4>CPD Hours — {mockCPD.cycle}</h4>
                <div className={styles.cpdProgress}>
                  <div className={styles.cpdBar}>
                    <div
                      className={styles.cpdFill}
                      style={{ width: `${cpdPct}%` }}
                    />
                  </div>
                  <div className={styles.cpdLabels}>
                    <span><strong>{mockCPD.done}</strong> hrs completed</span>
                    <span><strong>{mockCPD.total - mockCPD.done}</strong> hrs remaining</span>
                  </div>
                  <p className={styles.cpdNote}>
                    {cpdPct >= 80
                      ? '✅ On track — great progress!'
                      : `⚠️ ${mockCPD.total - mockCPD.done} hours still needed before cycle end.`}
                  </p>
                </div>
              </div>

              <div className={styles.partnerCard}>
                <div className={styles.partnerHeader}>
                  <Bookmark size={16} style={{ color: 'var(--aag-primary)' }} />
                  <span>Partner Recommendation of the Day</span>
                </div>
                <h3>{mockTopPartner.name}</h3>
                <span className="badge badge-blue" style={{ marginBottom: 10 }}>{mockTopPartner.category}</span>
                <p className={styles.partnerRec}>{mockTopPartner.recommendation}</p>
                <div className={styles.partnerMeta}>
                  <span>Commission: <strong>{mockTopPartner.commission}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className={styles.footer}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Snooze 1 hr</button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Dismiss &amp; Start Day</button>
        </div>
      </div>
    </div>
  );
}
