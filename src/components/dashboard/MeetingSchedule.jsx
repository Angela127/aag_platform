import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { mockMeetings, calendarEvents } from '../../lib/mockData.js';
import styles from './MeetingSchedule.module.css';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MiniCalendar({ selectedDate, onSelectDate }) {
  const [cursor, setCursor] = useState(new Date(selectedDate));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const toKey = (d) => `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles.miniCal}>
      <div className={styles.calHeader}>
        <button className={styles.calNav} onClick={() => setCursor(new Date(year, month - 1, 1))}>
          <ChevronLeft size={15} />
        </button>
        <span className={styles.calMonth}>{MONTHS[month]} {year}</span>
        <button className={styles.calNav} onClick={() => setCursor(new Date(year, month + 1, 1))}>
          <ChevronRight size={15} />
        </button>
      </div>
      <div className={styles.calGrid}>
        {DAYS.map(d => <div key={d} className={styles.calDayLabel}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const key = toKey(d);
          const count = calendarEvents[key] || 0;
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          return (
            <button
              key={key}
              className={`${styles.calCell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectDate(key)}
            >
              {d}
              {count > 0 && <span className={styles.dot} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am–5pm

const typeColors = {
  review:   { bg: '#ede9fe', border: '#8b5cf6', text: '#6d28d9' },
  new:      { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
  followup: { bg: '#fef3c7', border: '#f59e0b', text: '#b45309' },
};

export default function MeetingSchedule() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayKey);

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Meeting Schedule</h3>
      </div>

      <div className={styles.layout}>
        {/* Mini Calendar */}
        <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        {/* Timeline */}
        <div className={styles.timelineWrap}>
          <p className={styles.timelineDate}>
            Today's Timeline — {new Date().toLocaleDateString('en-SG', { weekday:'long', day:'numeric', month:'long' })}
          </p>
          <div className={styles.timeline}>
            {HOURS.map(h => {
              const hStr = `${String(h).padStart(2,'0')}:00`;
              const meetings = mockMeetings.filter(m => parseInt(m.time) === h);
              return (
                <div key={h} className={styles.timeRow}>
                  <span className={styles.timeLabel}>{hStr}</span>
                  <div className={styles.timeContent}>
                    {meetings.map(m => {
                      const colors = typeColors[m.type] || typeColors.review;
                      return (
                        <div
                          key={m.id}
                          className={styles.meetingBlock}
                          style={{ background: colors.bg, borderLeft: `3px solid ${colors.border}` }}
                        >
                          <span style={{ fontWeight: 600, color: colors.text, fontSize:'0.8125rem' }}>{m.client}</span>
                          <span style={{ fontSize:'0.75rem', color:'#6b7280' }}>
                            <Clock size={11} style={{ verticalAlign:'middle', marginRight:3 }} />
                            {m.time}–{m.endTime} · {m.location}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
