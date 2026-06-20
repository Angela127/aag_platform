import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import MorningBriefingModal from '../components/dashboard/MorningBriefingModal.jsx';
import MeetingSchedule from '../components/dashboard/MeetingSchedule.jsx';
import SmartReminderPanel from '../components/dashboard/SmartReminderPanel.jsx';
import KanbanBoard from '../components/dashboard/KanbanBoard.jsx';
import SectorNewsDrawer from '../components/dashboard/SectorNewsDrawer.jsx';

import { mockKanban, mockMeetings, mockPipeline } from '../lib/mockData.js';
import { Users, TrendingUp, Calendar, FileText, CheckSquare, Sparkles, Newspaper, LayoutDashboard } from 'lucide-react';
import styles from './AgentDashboard.module.css';

export default function AgentDashboard() {
  const { user, role } = useAuth();
  const [showBriefing, setShowBriefing] = useState(false);
  const [showNewsDrawer, setShowNewsDrawer] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-06-20');
  
  // Shared States
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('aag_meetings');
    return saved ? JSON.parse(saved) : mockMeetings;
  });

  const handleAddMeeting = (newMeeting) => {
    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    localStorage.setItem('aag_meetings', JSON.stringify(updated));
  };
  const [columns, setColumns] = useState({
    todo:       mockKanban.todo,
    inprogress: mockKanban.inprogress,
    done:       mockKanban.done,
  });
  const [pipeline] = useState(mockPipeline);

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

  // Compute dynamic KPI stats
  const totalClients = 127; // Baseline mock number
  const activeLeadsCount = (pipeline.lead || []).length + (pipeline.qualified || []).length;
  const meetingsTodayCount = meetings.filter(m => m.date === selectedDate).length;
  const pendingProposalsCount = (pipeline.proposal || []).length;
  const closedCasesCount = (pipeline.closed || []).length;

  return (
    <div className={styles.page}>
      {/* Morning briefing modal */}
      {showBriefing && (
        <MorningBriefingModal onClose={() => setShowBriefing(false)} />
      )}

      {/* Page Header greeting */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            <LayoutDashboard size={32} className={styles.titleIcon} />
            {greeting}, {displayName}
          </h1>
          <p className={styles.pageDate}>
            {today} · Monitor your smart reminders, daily meetings, client pipelines, and task lists.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className={styles.briefingBtn}
            onClick={() => setShowBriefing(true)}
          >
            <Sparkles size={14} className={styles.sparkleIcon} />
            <span>Morning Briefing</span>
          </button>
          <button
            className={styles.briefingBtn}
            onClick={() => setShowNewsDrawer(true)}
          >
            <Newspaper size={14} style={{ color: 'var(--aag-primary)' }} />
            <span>Sector News</span>
          </button>
        </div>
      </div>

      {/* Custom Dynamic KPI Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
            <Users size={16} />
          </div>
          <div>
            <div className={styles.kpiValue}>{totalClients}</div>
            <div className={styles.kpiLabel}>Total Clients</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
            <TrendingUp size={16} />
          </div>
          <div>
            <div className={styles.kpiValue}>{activeLeadsCount}</div>
            <div className={styles.kpiLabel}>Active Leads</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} style={{ backgroundColor: '#fdf2f8', color: '#9d174d' }}>
            <Calendar size={16} />
          </div>
          <div>
            <div className={styles.kpiValue}>{meetingsTodayCount}</div>
            <div className={styles.kpiLabel}>Meetings Today</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} style={{ backgroundColor: '#f5f3ff', color: '#5b21b6' }}>
            <FileText size={16} />
          </div>
          <div>
            <div className={styles.kpiValue}>{pendingProposalsCount}</div>
            <div className={styles.kpiLabel}>Pending Proposals</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
            <CheckSquare size={16} />
          </div>
          <div>
            <div className={styles.kpiValue}>{closedCasesCount}</div>
            <div className={styles.kpiLabel}>Closed Cases</div>
          </div>
        </div>
      </div>

      {/* Central Two-Column Command Center Workspace */}
      <div className={styles.midGrid}>
        {/* Left Column (65%) */}
        <div className={styles.midLeft}>
          <MeetingSchedule
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            columns={columns}
            meetings={meetings}
            onAddMeeting={handleAddMeeting}
          />
        </div>

        {/* Right Column (35%) */}
        <div className={styles.midRight}>
          <SmartReminderPanel />
        </div>
      </div>


      {/* Task Kanban Board */}
      <div className={styles.kanbanSection}>
        <KanbanBoard
          selectedDate={selectedDate}
          columns={columns}
          setColumns={setColumns}
        />
      </div>

      {showNewsDrawer && (
        <SectorNewsDrawer
          onClose={() => setShowNewsDrawer(false)}
        />
      )}
    </div>
  );
}
