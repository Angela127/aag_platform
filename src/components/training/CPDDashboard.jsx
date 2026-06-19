// src/components/training/CPDDashboard.jsx
import { useEffect, useRef } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { CPD_CATEGORIES, EXPIRING_CERTS } from '../../lib/trainingData.js';
import { AlertTriangle, Clock, CheckCircle, BookOpen, FileText, Video, AlertCircle } from 'lucide-react';
import styles from './CPDDashboard.module.css';

// Animated SVG donut ring
function CPDRing({ earned, required }) {
  const pct = Math.min(earned / required, 1);
  const size = 200;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct);

  return (
    <div className={styles.ringWrapper}>
      <svg width={size} height={size} className={styles.ringSvg}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#f0ede8" strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--aag-primary)" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={styles.ringArc}
        />
      </svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringEarned}>{earned}</span>
        <span className={styles.ringLabel}>of {required} hrs</span>
        <span className={styles.ringPct}>{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

function CategoryBar({ cat, earned }) {
  const pct = Math.min(earned / cat.required, 1) * 100;
  return (
    <div className={styles.catRow}>
      <div className={styles.catHeader}>
        <span className={styles.catLabel}>{cat.label}</span>
        <span className={styles.catHours}>{earned} / {cat.required} hrs</span>
      </div>
      <div className={styles.catTrack}>
        <div
          className={styles.catFill}
          style={{ width: `${pct}%`, background: cat.color }}
        />
      </div>
    </div>
  );
}

function ExpiryAlert({ cert }) {
  const colorMap = {
    danger:  { bg: 'var(--danger-bg)',  border: '#fca5a5', icon: '#dc2626', IconComp: AlertTriangle },
    warning: { bg: 'var(--warning-bg)', border: '#fcd34d', icon: '#d97706', IconComp: AlertCircle   },
    info:    { bg: 'var(--info-bg)',    border: '#93c5fd', icon: '#1d5ea8', IconComp: Clock          },
  };
  const { bg, border, icon, IconComp } = colorMap[cert.severity];
  return (
    <div className={styles.alert} style={{ background: bg, borderColor: border }}>
      <IconComp size={16} style={{ color: icon, flexShrink: 0 }} />
      <div className={styles.alertBody}>
        <span className={styles.alertTitle}>{cert.name}</span>
        <span className={styles.alertSub}>
          Expires in <strong>{cert.expiresInDays} days</strong> — renew now to maintain compliance
        </span>
      </div>
      <button className={`btn btn-sm ${styles.renewBtn}`}>Renew</button>
    </div>
  );
}

const typeIcon = { video: Video, quiz: FileText, module: BookOpen };
const typeBadgeClass = { video: 'badge-blue', quiz: 'badge-amber', module: 'badge-green' };

export default function CPDDashboard() {
  const { cpdEarned, cpdRequired, categoryHours, cpdActivity = [] } = useTraining();

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* ── Top row: ring + category bars ── */}
      <div className={styles.topGrid}>
        {/* Donut ring card */}
        <div className={`card ${styles.ringCard}`}>
          <div className="card-header">
            <h3>CPD Progress</h3>
            <span className="badge badge-red">FY 2026</span>
          </div>
          <div className={`card-body ${styles.ringBody}`}>
            <CPDRing earned={cpdEarned} required={cpdRequired} />
            <div className={styles.ringStats}>
              <div className={styles.statPill}>
                <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                <span>{cpdEarned} hrs earned</span>
              </div>
              <div className={styles.statPill}>
                <Clock size={14} style={{ color: 'var(--warning)' }} />
                <span>{Math.max(0, cpdRequired - cpdEarned)} hrs remaining</span>
              </div>
            </div>
            <p className={styles.ringNote}>
              CPD deadline: <strong>31 December 2026</strong>
            </p>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={`card ${styles.catCard}`}>
          <div className="card-header">
            <h3>Breakdown by Category</h3>
          </div>
          <div className="card-body">
            <div className={styles.catList}>
              {CPD_CATEGORIES.map(cat => (
                <CategoryBar key={cat.id} cat={cat} earned={categoryHours[cat.id] ?? 0} />
              ))}
            </div>
            <div className={styles.catLegend}>
              {CPD_CATEGORIES.map(cat => (
                <div key={cat.id} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: cat.color }} />
                  {cat.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expiring alerts */}
        <div className={`card ${styles.alertCard}`}>
          <div className="card-header">
            <h3>Expiring Certifications</h3>
            <span className="badge badge-red">{EXPIRING_CERTS.length} alerts</span>
          </div>
          <div className={`card-body ${styles.alertList}`}>
            {EXPIRING_CERTS.map(cert => (
              <ExpiryAlert key={cert.id} cert={cert} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity Log ── */}
      <div className={`card ${styles.logCard}`}>
        <div className="card-header">
          <h3>Recent CPD Activity</h3>
          <span className={styles.logTotal}>+{cpdActivity.reduce((s, a) => s + a.hours, 0).toFixed(1)} hrs this period</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {cpdActivity.length > 0 ? (
            <table className={styles.logTable}>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>CPD Hours</th>
                </tr>
              </thead>
              <tbody>
                {cpdActivity.map(a => {
                  const Icon = typeIcon[a.type] || BookOpen;
                  return (
                    <tr key={a.id} className={styles.logRow}>
                      <td>
                        <div className={styles.logTitle}>
                          <Icon size={14} />
                          {a.title}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${typeBadgeClass[a.type] || 'badge-gray'}`}>
                          {a.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-gray`} style={{ textTransform: 'capitalize' }}>
                          {a.category}
                        </span>
                      </td>
                      <td className={styles.logDate}>
                        {new Date(a.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={styles.logHrs}>+{a.hours}h</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recent CPD activities recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
