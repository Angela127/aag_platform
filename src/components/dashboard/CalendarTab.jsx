import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Video, Phone, MapPin, X, Calendar as CalendarIcon } from 'lucide-react';
import clients from '../../data/clients.js';
import styles from './CalendarTab.module.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getPlatformIcon = (platform) => {
  const iconSize = 13;
  if (platform === 'Google Meet' || platform === 'Microsoft Teams') {
    return <Video size={iconSize} />;
  }
  if (platform === 'Phone Call') {
    return <Phone size={iconSize} />;
  }
  return <MapPin size={iconSize} />;
};

export default function CalendarTab({ selectedDate, onSelectDate, meetings, setMeetings }) {
  const [cursor, setCursor] = useState(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [client, setClient] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState('30 min');
  const [platform, setPlatform] = useState('Google Meet');
  const [description, setDescription] = useState('');
  const [prepNotes, setPrepNotes] = useState('');

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const toKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  
  const handlePrevMonth = () => setCursor(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCursor(new Date(year, month + 1, 1));

  const selectedDayMeetings = meetings.filter(m => m.date === selectedDate);

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!client.trim() || !title.trim()) return;

    const [h, min] = time.split(':').map(Number);
    const durMin = parseInt(duration) || 30;
    const endMin = (h * 60 + min + durMin);
    const endH = Math.floor(endMin / 60);
    const endM = endMin % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const newMeeting = {
      id: `m_${Date.now()}`,
      date,
      time,
      endTime,
      client: client.trim(),
      type: 'followup',
      location: platform === 'Office' || platform === 'Coffee Shop' ? platform : 'Video Call',
      title: title.trim(),
      duration,
      attendees: 2,
      description: description.trim() || `Consultation session with ${client}`,
      tags: ['Scheduled'],
      platform,
      prepNotes: prepNotes.trim()
    };

    setMeetings(prev => [newMeeting, ...prev]);
    setShowAddModal(false);

    // Reset Form
    setClient('');
    setTitle('');
    setDescription('');
    setPrepNotes('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        
        {/* Left Side: Calendar Grid */}
        <div className={styles.calendarCard}>
          <div className={styles.calHeader}>
            <div className={styles.calMonthGroup}>
              <button onClick={handlePrevMonth} className={styles.navBtn}>
                <ChevronLeft size={18} />
              </button>
              <h2 className={styles.monthTitle}>{MONTHS[month]} {year}</h2>
              <button onClick={handleNextMonth} className={styles.navBtn}>
                <ChevronRight size={18} />
              </button>
            </div>
            
            <button
              onClick={() => {
                setDate(selectedDate);
                setShowAddModal(true);
              }}
              className={styles.addBtn}
            >
              <Plus size={14} />
              <span>Schedule</span>
            </button>
          </div>

          <div className={styles.weekdayGrid}>
            {DAYS.map(d => (
              <div key={d} className={styles.weekdayLabel}>{d.slice(0, 3)}</div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {cells.map((d, i) => {
              if (!d) return <div key={`e-${i}`} className={styles.emptyDay} />;
              
              const key = toKey(d);
              const isSelected = key === selectedDate;
              const dayMeetings = meetings.filter(m => m.date === key);
              const isToday = key === new Date().toISOString().slice(0, 10);

              return (
                <button
                  key={key}
                  onClick={() => onSelectDate(key)}
                  className={`${styles.dayCell} ${isSelected ? styles.selectedCell : ''} ${isToday ? styles.todayCell : ''}`}
                >
                  <span className={styles.dayNumber}>{d}</span>
                  <div className={styles.cellEvents}>
                    {dayMeetings.slice(0, 2).map(m => (
                      <span key={m.id} className={styles.eventDot} title={m.title}>
                        {m.time} {m.client}
                      </span>
                    ))}
                    {dayMeetings.length > 2 && (
                      <span className={styles.moreEvents}>+{dayMeetings.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Agenda Detail */}
        <div className={styles.agendaCard}>
          <div className={styles.agendaHeader}>
            <h3 className={styles.agendaTitle}>Agenda</h3>
            <span className={styles.agendaDate}>
              {new Date(selectedDate).toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>

          <div className={styles.agendaBody}>
            {selectedDayMeetings.length === 0 ? (
              <div className={styles.noEvents}>
                <CalendarIcon size={24} className={styles.noEventsIcon} />
                <p>No meetings scheduled for this day.</p>
                <button
                  onClick={() => {
                    setDate(selectedDate);
                    setShowAddModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 12 }}
                >
                  Schedule One Now
                </button>
              </div>
            ) : (
              <div className={styles.meetingList}>
                {selectedDayMeetings.map(m => (
                  <div key={m.id} className={styles.meetingCard}>
                    <div className={styles.meetingTime}>
                      <Clock size={12} />
                      <span>{m.time} – {m.endTime} ({m.duration})</span>
                    </div>
                    <h4 className={styles.meetingTitle}>{m.title}</h4>
                    <p className={styles.meetingClient}>Client: <strong>{m.client}</strong></p>
                    
                    <div className={styles.meetingPlatform}>
                      <span className={styles.platformBadge}>
                        {getPlatformIcon(m.platform)}
                        <span>{m.platform}</span>
                      </span>
                    </div>

                    {m.prepNotes && (
                      <div className={styles.notesBlock}>
                        <strong>Notes:</strong> {m.prepNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Appointment Creation Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Schedule Client Appointment</h3>
              <button onClick={() => setShowAddModal(false)} className={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateMeeting}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter client name (e.g. John Tan)"
                    value={client}
                    onChange={e => setClient(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Meeting Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Retirement Annuity Review"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Time</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Duration</label>
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                    >
                      <option value="15 min">15 min</option>
                      <option value="30 min">30 min</option>
                      <option value="45 min">45 min</option>
                      <option value="60 min">60 min</option>
                      <option value="90 min">90 min</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Platform / Channel</label>
                    <select
                      value={platform}
                      onChange={e => setPlatform(e.target.value)}
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Microsoft Teams">Microsoft Teams</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Office">Office Meeting</option>
                      <option value="Coffee Shop">Coffee Shop</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Brief Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe agenda..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Preparation Briefing Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Preparation checks for yourself..."
                    value={prepNotes}
                    onChange={e => setPrepNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
