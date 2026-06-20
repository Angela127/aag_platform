import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Users, ThumbsUp, ListCollapse, Eye, Video, MapPin, Phone, Plus, X } from 'lucide-react';
import clients from '../../data/clients.js';
import styles from './MeetingSchedule.module.css';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const parseDateKey = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getPlatformIcon = (platform) => {
  const iconSize = 13;
  if (platform === 'Google Meet') {
    return (
      <div style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: 5, borderRadius: 4, display: 'inline-flex' }} title="Google Meet">
        <Video size={iconSize} />
      </div>
    );
  }
  if (platform === 'Microsoft Teams') {
    return (
      <div style={{ backgroundColor: '#f3f2f1', color: '#6264a7', padding: 5, borderRadius: 4, display: 'inline-flex' }} title="Microsoft Teams">
        <Video size={iconSize} />
      </div>
    );
  }
  if (platform === 'Phone Call') {
    return (
      <div style={{ backgroundColor: '#eafaf1', color: '#2ecc71', padding: 5, borderRadius: 4, display: 'inline-flex' }} title="Phone Call">
        <Phone size={iconSize} />
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: '#fef5e7', color: '#f39c12', padding: 5, borderRadius: 4, display: 'inline-flex' }} title={platform || 'In-Person'}>
      <MapPin size={iconSize} />
    </div>
  );
};

function MiniCalendar({ selectedDate, onSelectDate, columns, meetings }) {
  const [cursor, setCursor] = useState(() => parseDateKey(selectedDate));

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
          <ChevronLeft size={16} />
        </button>
        <span className={styles.calMonth}>{MONTHS[month]} {year}</span>
        <button className={styles.calNav} onClick={() => setCursor(new Date(year, month + 1, 1))}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={styles.calGrid}>
        {DAYS.map(d => <div key={d} className={styles.calDayLabel}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const key = toKey(d);
          
          // Dynamic activity calculation: meetings + Kanban tasks due on this date
          const meetingsCount = meetings.filter(m => m.date === key).length;
          const tasksCount = columns
            ? Object.values(columns).flat().filter(t => t.dueDate === key).length
            : 0;
          const count = meetingsCount + tasksCount;
 
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

export default function MeetingSchedule({ selectedDate, onSelectDate, columns, meetings = [], onAddMeeting }) {
  const selectedMeetings = meetings.filter(m => m.date === selectedDate);
  const formattedDate = parseDateKey(selectedDate).toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const [readyMeetings, setReadyMeetings] = useState({});
  const [expandedNotes, setExpandedNotes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    time: '10:00',
    endTime: '11:00',
    platform: 'Google Meet',
    location: '',
    description: '',
    attendees: 2,
    tags: '',
    prepNotes: ''
  });

  const handleToggleReady = (id) => {
    setReadyMeetings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleNotes = (id) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = (start, end) => {
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const mins = (eh * 60 + em) - (sh * 60 + sm);
      if (mins > 0) {
        if (mins >= 60) {
          const hrs = (mins / 60).toFixed(mins % 60 === 0 ? 0 : 1);
          return `${hrs} hr${hrs === '1' ? '' : 's'}`;
        }
        return `${mins} min`;
      }
    } catch (e) {}
    return '30 min';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client.trim()) return;

    const newEvent = {
      id: `m-${Date.now()}`,
      date: selectedDate,
      title: formData.title,
      client: formData.client,
      time: formData.time,
      endTime: formData.endTime,
      platform: formData.platform === 'Custom' ? formData.location : formData.platform,
      duration: calculateDuration(formData.time, formData.endTime),
      attendees: Number(formData.attendees) || 2,
      description: formData.description || 'No description provided.',
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      prepNotes: formData.prepNotes || 'Review client history before the session.'
    };

    onAddMeeting(newEvent);
    setIsModalOpen(false);
    setFormData({
      title: '',
      client: '',
      time: '10:00',
      endTime: '11:00',
      platform: 'Google Meet',
      location: '',
      description: '',
      attendees: 2,
      tags: '',
      prepNotes: ''
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Meeting Schedule</h3>
        <button className={styles.addEventBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={14} />
          <span>Add Event</span>
        </button>
      </div>

      <div className={styles.layout}>
        {/* Mini Calendar */}
        <MiniCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} columns={columns} meetings={meetings} />

        {/* Timeline */}
        <div className={styles.timelineWrap}>
          <p className={styles.timelineDate}>
            Timeline for {formattedDate}
          </p>

          {selectedMeetings.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border)',
              marginBottom: 16
            }}>
              📅 No meetings scheduled for this day.
            </div>
          )}

          <div className={styles.meetingList}>
            {selectedMeetings.map(m => {
              const isReady = !!readyMeetings[m.id];
              const showNotes = !!expandedNotes[m.id];

              // Check if client is registered in database to resolve link
              const clientObj = clients.find(c => c.name === m.client);
              const targetUrl = clientObj ? `/clients/${clientObj.id}` : '/clients';

              return (
                <div key={m.id} className={styles.meetingCardItem}>
                  <div className={styles.meetingCardHeader}>
                    {getPlatformIcon(m.platform)}
                    <h4 className={styles.meetingCardTitle}>{m.title || `Meeting with ${m.client}`}</h4>
                  </div>

                  <div className={styles.meetingMetaRow}>
                    <span className={styles.meetingMetaItem}>
                      <Clock size={13} />
                      {m.time} – {m.endTime} ({m.duration || '30 min'})
                    </span>
                    <span className={styles.meetingMetaItem}>
                      <Users size={13} />
                      {m.attendees || 2} attendees
                    </span>
                  </div>

                  <p className={styles.meetingDesc}>{m.description}</p>

                  <div className={styles.meetingTagsRow}>
                    <span className={styles.meetingTagBadge} style={{ fontWeight: 600, color: 'var(--aag-primary)' }}>
                      👤 {m.client}
                    </span>
                    {m.tags && m.tags.map(tag => (
                      <span key={tag} className={styles.meetingTagBadge}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={styles.meetingCardActions}>
                    <button
                      onClick={() => handleToggleReady(m.id)}
                      className={`${styles.meetingActionBtn} ${isReady ? styles.readyActive : ''}`}
                      title={isReady ? 'Ready for the meeting' : 'Mark as ready'}
                    >
                      <ThumbsUp size={13} />
                      {isReady ? "Ready!" : "I'm ready"}
                    </button>
                    <button
                      onClick={() => handleToggleNotes(m.id)}
                      className={`${styles.meetingActionBtn} ${showNotes ? styles.notesActive : ''}`}
                      title="Skim prep notes"
                    >
                      <ListCollapse size={13} />
                      Skim notes
                    </button>
                    <Link
                      to={targetUrl}
                      className={styles.meetingEyeBtn}
                      title={`View ${m.client}'s profile`}
                    >
                      <Eye size={13} />
                    </Link>
                  </div>

                  {showNotes && (
                    <div className={styles.meetingNotesSection}>
                      <div className={styles.meetingNotesTitle}>Preparation Briefing</div>
                      <div className={styles.meetingNotesText}>{m.prepNotes || 'No specific prep notes. Review client history before the session.'}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Schedule New Event</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.label} htmlFor="title">Event Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. Portfolio Review & Rebalancing"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="client">Client Name *</label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. John Tan"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="attendees">Attendees</label>
                    <input
                      type="number"
                      id="attendees"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="1"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="time">Start Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="endTime">End Time *</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="platform">Platform / Channel *</label>
                    <select
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Microsoft Teams">Microsoft Teams</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Office">Office / In-Person</option>
                      <option value="Coffee Shop">Coffee Shop</option>
                      <option value="Custom">Custom Location</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. Portfolio, Savings"
                    />
                  </div>

                  {formData.platform === 'Custom' && (
                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                      <label className={styles.label} htmlFor="location">Custom Location *</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="e.g. Meeting Room 3B"
                        required
                      />
                    </div>
                  )}

                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.label} htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      placeholder="Brief details of the meeting..."
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.label} htmlFor="prepNotes">Preparation Notes</label>
                    <textarea
                      id="prepNotes"
                      name="prepNotes"
                      value={formData.prepNotes}
                      onChange={handleInputChange}
                      className={styles.textarea}
                      placeholder="Notes for advisor checklist before meeting..."
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
