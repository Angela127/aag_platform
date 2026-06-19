// src/components/training/VideoPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  CheckCircle, Maximize2, ChevronRight, BookOpen, List,
  ArrowLeft, Sparkles
} from 'lucide-react';
import styles from './VideoPlayer.module.css';

function ChapterList({ chapters, currentTime, onSeek }) {
  return (
    <div className={styles.chapters}>
      <div className={styles.chapHeader}>
        <List size={15} /> Chapters
      </div>
      {chapters.map((ch, i) => {
        const timeInSec = ch.time.split(':').reduce((acc, t) => acc * 60 + parseInt(t), 0);
        const isActive = i === chapters.findIndex((_, idx) =>
          idx === chapters.length - 1 ||
          (timeInSec <= currentTime && currentTime < (chapters[i + 1]?.time.split(':').reduce((a, t) => a * 60 + parseInt(t), 0) ?? Infinity))
        );
        return (
          <button
            key={i}
            className={`${styles.chapItem} ${isActive ? styles.chapActive : ''}`}
            onClick={() => onSeek(timeInSec)}
          >
            <span className={styles.chapTime}>{ch.time}</span>
            <span className={styles.chapTitle}>{ch.title}</span>
            {isActive && <ChevronRight size={14} className={styles.chapArrow} />}
          </button>
        );
      })}
    </div>
  );
}

export default function VideoPlayer() {
  const { activeVideo, completedVideos, markVideoComplete, openVideo, setActiveTab, courses = [] } = useTraining();
  const course = activeVideo || courses[0];

  if (!course) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>No course selected.</p>
      </div>
    );
  }

  // Fake playback state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => (course.chapters?.length || 4) * 18 * 60);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [marked, setMarked] = useState(() => completedVideos.has(course.id));
  const [showSummary, setShowSummary] = useState(true);
  const intervalRef = useRef(null);

  // Simulate playback ticker
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) { setPlaying(false); return duration; }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, duration]);

  // Reset when course changes
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setMarked(completedVideos.has(course.id));
    setDuration((course.chapters?.length || 4) * 18 * 60);
    clearInterval(intervalRef.current);
  }, [course.id, completedVideos]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMarkComplete = () => {
    markVideoComplete(course);
    setMarked(true);
  };

  const handleSeek = (secs) => {
    setCurrentTime(Math.min(secs, duration));
  };

  const handleSkip = (delta) => {
    setCurrentTime(prev => Math.max(0, Math.min(prev + delta, duration)));
  };

  const isCompleted = marked || completedVideos.has(course.id);

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* Course header */}
      <div className={styles.courseHeader}>
        <button
          className={`btn btn-ghost btn-sm ${styles.backBtn}`}
          onClick={() => setActiveTab('library')}
        >
          <ArrowLeft size={15} /> Library
        </button>
        <div className={styles.courseInfo}>
          <h2 className={styles.courseTitle}>{course.title}</h2>
          <div className={styles.courseMeta}>
            <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{course.category}</span>
            <span className={styles.metaSep}>·</span>
            <span>{course.duration}</span>
            <span className={styles.metaSep}>·</span>
            <span>{course.cpd} CPD hrs</span>
            {isCompleted && (
              <>
                <span className={styles.metaSep}>·</span>
                <span className={styles.completedPill}>
                  <CheckCircle size={12} /> Completed
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: player + side panel */}
      <div className={styles.mainGrid}>
        {/* Left: video + controls */}
        <div className={styles.playerCol}>
          {/* Video screen */}
          <div className={styles.screen} onClick={() => setPlaying(p => !p)}>
            <div className={styles.screenBg}>
              {/* Animated waveform / fake video placeholder */}
              <div className={styles.videoPlaceholder}>
                <div className={styles.vpIcon}>
                  {playing
                    ? <div className={styles.bars}>{[...Array(5)].map((_, i) => <div key={i} className={styles.bar} style={{ animationDelay: `${i * 0.12}s` }} />)}</div>
                    : <Play size={48} style={{ color: 'rgba(255,255,255,.9)' }} />
                  }
                </div>
                <p className={styles.vpTitle}>{course.title}</p>
                <p className={styles.vpSub}>{playing ? 'Playing…' : 'Click to play'}</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className={styles.progress}>
            <div
              className={styles.progressTrack}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                setCurrentTime(pct * duration);
              }}
            >
              {/* Chapter markers */}
              {(course.chapters || []).slice(1).map((ch, i) => {
                const secs = ch.time.split(':').reduce((a, t) => a * 60 + parseInt(t), 0);
                const pct = (secs / duration) * 100;
                return (
                  <div
                    key={i}
                    className={styles.chapterMarker}
                    style={{ left: `${pct}%` }}
                    title={ch.title}
                  />
                );
              })}
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
              <div className={styles.progressThumb} style={{ left: `${progressPct}%` }} />
            </div>
            <div className={styles.timeRow}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.ctrlLeft}>
              <button className={styles.ctrlBtn} onClick={() => handleSkip(-10)} title="Skip back 10s">
                <SkipBack size={18} />
              </button>
              <button
                className={styles.playBtn}
                onClick={() => setPlaying(p => !p)}
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={20} /> : <Play size={20} fill="white" />}
              </button>
              <button className={styles.ctrlBtn} onClick={() => handleSkip(10)} title="Skip forward 10s">
                <SkipForward size={18} />
              </button>
              <button className={styles.ctrlBtn} onClick={() => setMuted(m => !m)}>
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={e => { setVolume(+e.target.value); setMuted(false); }}
                className={styles.volumeSlider}
              />
            </div>
            <div className={styles.ctrlRight}>
              <button
                className={`${styles.ctrlBtn} ${styles.summaryToggle}`}
                onClick={() => setShowSummary(s => !s)}
                title="Toggle summary"
              >
                <BookOpen size={16} /> {showSummary ? 'Hide' : 'Show'} Summary
              </button>
              <button className={styles.ctrlBtn}><Maximize2 size={16} /></button>
            </div>
          </div>

          {/* Mark as Complete */}
          <div className={styles.markWrap}>
            {isCompleted ? (
              <div className={styles.completedMsg}>
                <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                <span>CPD credited — <strong>+{course.cpd} hours</strong> added to your record</span>
              </div>
            ) : (
              <button
                className={`btn btn-primary ${styles.markBtn}`}
                onClick={handleMarkComplete}
              >
                <CheckCircle size={16} />
                Mark as Complete (+{course.cpd} CPD hrs)
              </button>
            )}
          </div>
        </div>

        {/* Right: chapter list + AI summary */}
        <div className={styles.sidePanel}>
          <ChapterList
            chapters={course.chapters || []}
            currentTime={currentTime}
            onSeek={handleSeek}
          />

          {showSummary && (
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <Sparkles size={15} style={{ color: '#7c3aed' }} />
                <span>AI Content Summary</span>
              </div>
              <p className={styles.summaryText}>{course.aiSummary}</p>
              <div className={styles.summaryFooter}>
                Generated by AAG Learning AI • May contain inaccuracies
              </div>
            </div>
          )}

          {/* Related courses */}
          <div className={styles.related}>
            <div className={styles.relatedHeader}>Up Next</div>
            {courses.filter(c => c.id !== course.id && c.category === course.category).slice(0, 2).map(c => (
              <button key={c.id} className={styles.relCard} onClick={() => openVideo(c)}>
                <div className={styles.relInfo}>
                  <span className={styles.relTitle}>{c.title}</span>
                  <span className={styles.relMeta}>{c.duration} · {c.cpd} CPD hrs</span>
                </div>
                <Play size={14} style={{ color: 'var(--aag-primary)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
