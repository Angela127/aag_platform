// src/pages/TrainingPage.jsx
import { useTraining, TrainingProvider } from '../context/TrainingContext.jsx';
import CPDDashboard from '../components/training/CPDDashboard.jsx';
import LearningPath from '../components/training/LearningPath.jsx';
import KnowledgeLibrary from '../components/training/KnowledgeLibrary.jsx';
import VideoPlayer from '../components/training/VideoPlayer.jsx';
import QuizList from '../components/training/QuizList.jsx';
import CertificateBadgeWall from '../components/training/CertificateBadgeWall.jsx';
import KnowledgeBase from '../components/training/KnowledgeBase.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './TrainingPage.module.css';
import {
  BarChart2, Map, Library, Play, FileText,
  Award, Search, GraduationCap, Clock
} from 'lucide-react';

const TABS = [
  { key: 'dashboard', label: 'CPD Dashboard',    Icon: BarChart2, Component: CPDDashboard        },
  { key: 'path',      label: 'Learning Path',     Icon: Map,       Component: LearningPath        },
  { key: 'library',   label: 'Knowledge Library', Icon: Library,   Component: KnowledgeLibrary    },
  { key: 'player',    label: 'Video Player',      Icon: Play,      Component: VideoPlayer         },
  { key: 'quizzes',   label: 'Quizzes',           Icon: FileText,  Component: QuizList            },
  { key: 'badges',    label: 'Certificates',      Icon: Award,     Component: CertificateBadgeWall },
  { key: 'kb',        label: 'Knowledge Base',    Icon: Search,    Component: KnowledgeBase       },
];

function LoadingSpinner() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'50vh', gap: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #ffe4d1',
        borderTopColor: '#870105',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color:'#5a5a5a', fontSize:'0.875rem' }}>Loading Training Academy data…</p>
    </div>
  );
}

function TrainingPageInner() {
  const { user } = useAuth();
  const { activeTab, setActiveTab, cpdEarned, cpdRequired, loading } = useTraining();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Advisor';
  const ActiveComponent = TABS.find(t => t.key === activeTab)?.Component || CPDDashboard;

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <GraduationCap size={22} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Training & CPD</h1>
            <p className={styles.pageSub}>
              Professional development for {displayName}
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.cpdPill}>
            <Clock size={14} />
            <span className={styles.cpdPillNums}>
              <strong>{cpdEarned}</strong>/{cpdRequired} hrs
            </span>
            <div className={styles.cpdPillBar}>
              <div
                className={styles.cpdPillFill}
                style={{ width: `${(cpdEarned / cpdRequired) * 100}%` }}
              />
            </div>
            <span className={styles.cpdPillLabel}>CPD</span>
          </div>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className={styles.tabNav}>
        <div className={styles.tabScroll}>
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(key)}
              id={`tab-${key}`}
            >
              <Icon size={15} className={styles.tabIcon} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className={styles.tabContent} key={activeTab}>
        <ActiveComponent />
      </div>
    </div>
  );
}

export default function TrainingPage() {
  return (
    <TrainingProvider>
      <TrainingPageInner />
    </TrainingProvider>
  );
}
