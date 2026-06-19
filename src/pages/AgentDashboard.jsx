import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import MorningBriefingModal from '../components/dashboard/MorningBriefingModal.jsx';
import KPICardRow from '../components/dashboard/KPICardRow.jsx';
import MeetingSchedule from '../components/dashboard/MeetingSchedule.jsx';
import KanbanBoard from '../components/dashboard/KanbanBoard.jsx';
import SmartReminderPanel from '../components/dashboard/SmartReminderPanel.jsx';
import styles from './AgentDashboard.module.css';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [showBriefing, setShowBriefing] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Advisor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Auto-show morning briefing once per day
  useEffect(() => {
    const lastShown = localStorage.getItem('aag_briefing_date');
    const todayStr  = new Date().toISOString().slice(0, 10);
    if (lastShown !== todayStr) {
      setShowBriefing(true);
      localStorage.setItem('aag_briefing_date', todayStr);
    }
  }, []);

  return (
    <div className={styles.page}>
      {/* Morning briefing modal */}
      {showBriefing && (
        <MorningBriefingModal onClose={() => setShowBriefing(false)} />
      )}

      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{greeting}, {displayName}</h1>
          <p className={styles.pageDate}>{today}</p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowBriefing(true)}
        >
          📋 Morning Briefing
        </button>
      </div>

      {/* KPI cards */}
      <section className={styles.section}>
        <KPICardRow />
      </section>

      {/* Calendar + Reminders row */}
      <section className={styles.section}>
        <div className={styles.midGrid}>
          <div className={styles.midLeft}>
            <MeetingSchedule />
          </div>
          <div className={styles.midRight}>
            <SmartReminderPanel />
          </div>
        </div>
      </section>

      {/* Kanban */}
      <section className={styles.section}>
        <KanbanBoard />
      </section>
    </div>
  );
}
