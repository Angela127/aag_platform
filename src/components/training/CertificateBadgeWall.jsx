// src/components/training/CertificateBadgeWall.jsx
import { useState } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { Download, Share2, Lock, Star, Award, CheckCircle, X } from 'lucide-react';
import styles from './CertificateBadgeWall.module.css';

function CertModal({ cert, onClose }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.certModal}>
        <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>

        {/* Certificate preview */}
        <div className={styles.certPreview} style={{ borderColor: cert.color }}>
          <div className={styles.certBg} />
          <div className={styles.certContent}>
            <div className={styles.certLogo}>
              <span className={styles.certLogoText}>AAG</span>
            </div>
            <p className={styles.certSubtext}>ADVISORS ALLIANCE GROUP</p>
            <p className={styles.certPresents}>This certifies that</p>
            <h2 className={styles.certName}>Financial Advisor</h2>
            <p className={styles.certHas}>has successfully completed and is hereby awarded</p>
            <h1 className={styles.certTitle} style={{ color: cert.color }}>{cert.title}</h1>
            <div className={styles.certBigIcon}>{cert.icon}</div>
            <p className={styles.certDate}>
              {cert.date ? `Issued: ${new Date(cert.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Pending'}
            </p>
            <div className={styles.certSig}>
              <div className={styles.certSigLine} />
              <p>AAG Training Director</p>
            </div>
          </div>
          {/* Corner decorations */}
          <div className={styles.cornerTL} style={{ borderColor: cert.color }} />
          <div className={styles.cornerTR} style={{ borderColor: cert.color }} />
          <div className={styles.cornerBL} style={{ borderColor: cert.color }} />
          <div className={styles.cornerBR} style={{ borderColor: cert.color }} />
        </div>

        <div className={styles.modalActions}>
          <button className="btn btn-secondary">
            <Download size={15} /> Download PDF
          </button>
          <button className="btn btn-secondary">
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ cert, isEarned, onView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.badge} ${!isEarned ? styles.badgeLocked : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isEarned && onView(cert)}
    >
      {/* Glow effect for earned */}
      {isEarned && hovered && (
        <div className={styles.glow} style={{ background: cert.color }} />
      )}

      {/* Icon area */}
      <div
        className={styles.badgeIcon}
        style={isEarned ? { background: `linear-gradient(135deg, ${cert.color}22, ${cert.color}44)`, borderColor: cert.color + '55' } : {}}
      >
        <span className={`${styles.badgeEmoji} ${!isEarned ? styles.emojiLocked : ''}`}>
          {cert.icon}
        </span>
        {!isEarned && (
          <div className={styles.lockOverlay}>
            <Lock size={20} style={{ color: 'white' }} />
          </div>
        )}
      </div>

      {/* Details */}
      <div className={styles.badgeInfo}>
        <h4 className={`${styles.badgeTitle} ${!isEarned ? styles.textLocked : ''}`} style={isEarned ? { color: cert.color } : {}}>
          {cert.title}
        </h4>
        <p className={styles.badgeIssuer}>{cert.issuer}</p>

        {isEarned ? (
          <div className={styles.badgeMeta}>
            <span className={styles.earnedDate}>
              <CheckCircle size={12} style={{ color: 'var(--success)' }} />
              {cert.date ? new Date(cert.date).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' }) : ''}
            </span>
            <div className={styles.cardActions}>
              <button className={styles.smallBtn} title="Download">
                <Download size={13} />
              </button>
              <button className={styles.smallBtn} title="Share">
                <Share2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.lockReq}>{cert.requirements}</p>
        )}
      </div>

      {isEarned && (
        <div className={styles.earnedPill} style={{ background: cert.color }}>
          <Star size={10} fill="white" /> Earned
        </div>
      )}
    </div>
  );
}

export default function CertificateBadgeWall() {
  const { earnedCerts, certificates = [] } = useTraining();
  const [viewCert, setViewCert] = useState(null);

  const earned = certificates.filter(c => earnedCerts.has(c.id));
  const locked = certificates.filter(c => !earnedCerts.has(c.id));

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* Header stats */}
      <div className={styles.statsBar}>
        <div className={styles.statsItem}>
          <Award size={22} style={{ color: 'var(--aag-primary)' }} />
          <div>
            <div className={styles.statsNum}>{earned.length}</div>
            <div className={styles.statsLbl}>Earned</div>
          </div>
        </div>
        <div className={styles.statsDivider} />
        <div className={styles.statsItem}>
          <Lock size={22} style={{ color: 'var(--text-muted)' }} />
          <div>
            <div className={styles.statsNum}>{locked.length}</div>
            <div className={styles.statsLbl}>Locked</div>
          </div>
        </div>
        <div className={styles.statsDivider} />
        <div className={styles.statsItem}>
          <Star size={22} style={{ color: '#d97706' }} />
          <div>
            <div className={styles.statsNum}>{certificates.length}</div>
            <div className={styles.statsLbl}>Total</div>
          </div>
        </div>
        <div className={styles.progressPill}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${certificates.length > 0 ? (earned.length / certificates.length) * 100 : 0}%` }} />
          </div>
          <span>{certificates.length > 0 ? Math.round((earned.length / certificates.length) * 100) : 0}% complete</span>
        </div>
      </div>

      {/* Earned badges */}
      <div>
        <h3 className={styles.sectionTitle}>
          <CheckCircle size={18} style={{ color: 'var(--success)' }} />
          Earned Certificates
        </h3>
        <div className={styles.badgeGrid}>
          {earned.map(cert => (
            <BadgeCard key={cert.id} cert={cert} isEarned onView={setViewCert} />
          ))}
        </div>
      </div>

      {/* Locked badges */}
      <div>
        <h3 className={styles.sectionTitle}>
          <Lock size={18} style={{ color: 'var(--text-muted)' }} />
          Locked — Keep Learning
        </h3>
        <div className={styles.badgeGrid}>
          {locked.map(cert => (
            <BadgeCard key={cert.id} cert={cert} isEarned={false} onView={() => {}} />
          ))}
        </div>
      </div>

      {/* Certificate modal */}
      {viewCert && (
        <CertModal cert={viewCert} onClose={() => setViewCert(null)} />
      )}
    </div>
  );
}
