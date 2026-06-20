// src/components/training/CPDDashboard.jsx
import { useEffect, useRef } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { CPD_CATEGORIES, EXPIRING_CERTS } from '../../lib/trainingData.js';
import { AlertTriangle, Clock, CheckCircle, BookOpen, FileText, Video, AlertCircle } from 'lucide-react';
import styles from './CPDDashboard.module.css';

// Animated SVG donut ring
function CPDRing({ earned, required }) {
  const pct = Math.min(earned / required, 1);
  const size = 170;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct);

  return (
    <div className={styles.ringWrapper}>
      <svg width={size} height={size} className={styles.ringSvg}>
        <defs>
          <linearGradient id="cpdGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d23c40" />
            <stop offset="100%" stopColor="var(--aag-primary)" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="var(--aag-primary)" floodOpacity="0.2" />
          </filter>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#f2efea" strokeWidth={stroke - 4}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="url(#cpdGradient)" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={styles.ringArc}
          filter="url(#shadow)"
        />
      </svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringPct}>{Math.round(pct * 100)}%</span>
        <span className={styles.ringEarned}>{earned}</span>
        <span className={styles.ringLabel}>of {required} hrs</span>
      </div>
    </div>
  );
}

function CategoryBar({ cat, earned }) {
  const pct = Math.min(earned / cat.required, 1) * 100;
  return (
    <div className={styles.catRow}>
      <div className={styles.catHeader}>
        <div className={styles.catNameGroup}>
          <span className={styles.catDot} style={{ background: cat.color }} />
          <span className={styles.catLabel}>{cat.label}</span>
        </div>
        <span className={styles.catHours}>
          <strong>{earned}</strong> <span className={styles.hoursSlash}>/</span> {cat.required} hrs
        </span>
      </div>
      <div className={styles.catTrack}>
        <div
          className={styles.catFill}
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cat.color}bb, ${cat.color})` }}
        />
      </div>
    </div>
  );
}

function ExpiryAlert({ cert }) {
  const colorMap = {
    danger:  { indicator: '#dc2626', icon: '#dc2626', bg: '#fef2f2', IconComp: AlertTriangle },
    warning: { indicator: '#d97706', icon: '#d97706', bg: '#fffbeb', IconComp: AlertCircle   },
    info:    { indicator: '#1d5ea8', icon: '#1d5ea8', bg: '#eff6ff', IconComp: Clock          },
  };
  const { indicator, icon, bg, IconComp } = colorMap[cert.severity] || colorMap.info;
  return (
    <div className={styles.alertCardItem} style={{ borderLeftColor: indicator }}>
      <div className={styles.alertIconBadge} style={{ backgroundColor: bg }}>
        <IconComp size={16} style={{ color: icon }} />
      </div>
      <div className={styles.alertBody}>
        <span className={styles.alertTitle}>{cert.name}</span>
        <span className={styles.alertSub}>
          Expires in <strong style={{ color: indicator }}>{cert.expiresInDays} days</strong>
        </span>
      </div>
      <button className={styles.renewBtnPill}>Renew</button>
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
        <div className={styles.ringCard}>
          <div className={styles.cardHeaderCustom}>
            <h3>CPD Progress</h3>
            <span className={styles.badgeRed}>FY 2026</span>
          </div>
          <div className={styles.ringBody}>
            <CPDRing earned={cpdEarned} required={cpdRequired} />
            <div className={styles.ringStatsGrid}>
              <div className={styles.statCardEarned}>
                <div className={styles.statIconEarned}>
                  <CheckCircle size={15} />
                </div>
                <div>
                  <div className={styles.statValue}>{cpdEarned} hrs</div>
                  <div className={styles.statLabel}>Completed</div>
                </div>
              </div>
              <div className={styles.statCardRemaining}>
                <div className={styles.statIconRemaining}>
                  <Clock size={15} />
                </div>
                <div>
                  <div className={styles.statValue}>{Math.max(0, cpdRequired - cpdEarned)} hrs</div>
                  <div className={styles.statLabel}>Remaining</div>
                </div>
              </div>
            </div>
            <div className={styles.deadlineInfo}>
              Deadline: <strong>31 December 2026</strong>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={styles.catCard}>
          <div className={styles.cardHeaderCustom}>
            <h3>Breakdown by Category</h3>
          </div>
          <div className={styles.catBody}>
            <div className={styles.catList}>
              {CPD_CATEGORIES.map(cat => (
                <CategoryBar key={cat.id} cat={cat} earned={categoryHours[cat.id] ?? 0} />
              ))}
            </div>
          </div>
        </div>

        {/* Expiring alerts */}
        <div className={styles.alertCard}>
          <div className={styles.cardHeaderCustom}>
            <h3>Expiring Certifications</h3>
            <span className={styles.badgeRedCount}>{EXPIRING_CERTS.length} alerts</span>
          </div>
          <div className={styles.alertList}>
            {EXPIRING_CERTS.map(cert => (
              <ExpiryAlert key={cert.id} cert={cert} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity Log ── */}
      <div className={styles.logCard}>
        <div className={styles.cardHeaderCustom}>
          <h3>Recent CPD Activity</h3>
          <span className={styles.logTotal}>+{cpdActivity.reduce((s, a) => s + a.hours, 0).toFixed(1)} hrs this period</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {cpdActivity.length > 0 ? (
            <table className={styles.logTable}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Activity</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>CPD Hours</th>
                </tr>
              </thead>
              <tbody>
                {cpdActivity.map(a => {
                  const Icon = typeIcon[a.type] || BookOpen;
                  return (
                    <tr key={a.id} className={styles.logRow}>
                      <td style={{ paddingLeft: '24px' }}>
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
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
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
