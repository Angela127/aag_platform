// src/components/training/LearningPath.jsx
import { useState } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { CheckCircle, Lock, PlayCircle, ChevronRight, Lightbulb, TrendingUp, Star } from 'lucide-react';
import styles from './LearningPath.module.css';

const statusConfig = {
  completed:   { icon: CheckCircle, color: 'var(--success)',     bg: '#edf7f2', label: 'Completed',  lineColor: 'var(--success)'    },
  current:     { icon: PlayCircle,  color: 'var(--aag-primary)', bg: '#fef2f2', label: 'In Progress', lineColor: 'var(--aag-primary)' },
  locked:      { icon: Lock,        color: '#9ca3af',             bg: '#f3f4f6', label: 'Locked',     lineColor: '#e5e7eb'            },
};

const categoryColors = {
  ethics:    { bg: '#fef2f2', color: '#991b1b' },
  technical: { bg: '#eff6ff', color: '#1e40af' },
  product:   { bg: '#f0fdf4', color: '#166534' },
};

function PathNode({ lp, course, isLast, onStart }) {
  const cfg = statusConfig[lp.status];
  const Icon = cfg.icon;
  const catCol = categoryColors[course.category] || {};
  const [hover, setHover] = useState(false);

  return (
    <div className={styles.nodeWrapper}>
      {/* Connector line */}
      {!isLast && (
        <div className={styles.connector} style={{ background: cfg.lineColor }} />
      )}

      <div
        className={`${styles.node} ${hover && lp.status !== 'locked' ? styles.nodeHover : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Step bubble */}
        <div className={styles.bubble} style={{ background: cfg.bg, border: `2px solid ${cfg.color}` }}>
          <Icon size={20} style={{ color: cfg.color }} />
        </div>

        {/* Card */}
        <div className={`card ${styles.nodeCard} ${lp.status === 'locked' ? styles.lockedCard : ''}`}>
          <div className={styles.nodeTop}>
            <div className={styles.nodeMeta}>
              <span
                className="badge"
                style={{ background: catCol.bg, color: catCol.color, fontSize: '0.7rem' }}
              >
                {course.category}
              </span>
              <span className={`badge ${lp.status === 'completed' ? 'badge-green' : lp.status === 'current' ? 'badge-red' : 'badge-gray'}`}>
                {cfg.label}
              </span>
            </div>
            <span className={styles.stepNum}>Step {lp.step}</span>
          </div>

          <h4 className={`${styles.nodeTitle} ${lp.status === 'locked' ? styles.lockedText : ''}`}>
            {lp.status === 'locked' && <Lock size={14} style={{ color: '#9ca3af', marginRight: 6 }} />}
            {course.title}
          </h4>
          <p className={styles.nodeDesc}>{course.description}</p>

          <div className={styles.nodeFoot}>
            <div className={styles.nodeTags}>
              <span className={styles.nodeTag}>⏱ {course.duration}</span>
              <span className={styles.nodeTag}>📊 {course.cpd} CPD hrs</span>
            </div>
            {lp.status !== 'locked' ? (
              <button
                className={`btn btn-sm ${lp.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => onStart(course)}
              >
                {lp.status === 'completed' ? 'Review' : 'Continue'}
              </button>
            ) : (
              <span className={styles.lockHint}>Complete previous step to unlock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearningPath() {
  const { openVideo, courses = [], learningPath = [], aiRecommendation } = useTraining();

  const recCourses = (aiRecommendation?.path || []).map(id => courses.find(c => c.id === id)).filter(Boolean);

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <div className={styles.aiBanner}>
          <div className={styles.aiIcon}>
            <Lightbulb size={22} style={{ color: '#d97706' }} />
          </div>
          <div className={styles.aiBody}>
            <div className={styles.aiTitle}>
              <span>AI Learning Recommendation</span>
              {aiRecommendation.score < 100 && (
                <span className={styles.aiScore}>
                  <TrendingUp size={13} /> Score: {aiRecommendation.score}% in {aiRecommendation.weakTopic}
                </span>
              )}
            </div>
            <p className={styles.aiText}>{aiRecommendation.message}</p>
            <div className={styles.aiPath}>
              {recCourses.map((c, i) => (
                <span key={c.id} className={styles.aiPathItem}>
                  <button className={styles.aiCourseBtn} onClick={() => openVideo(c)}>
                    {c.title}
                  </button>
                  {i < recCourses.length - 1 && <ChevronRight size={14} style={{ color: '#9ca3af' }} />}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.aiBadge}>
            <Star size={12} fill="currentColor" />
            AI-Powered
          </div>
        </div>
      )}

      {/* Path header */}
      <div className={styles.pathHeader}>
        <div>
          <h3 className={styles.pathTitle}>Your Learning Journey</h3>
          <p className={styles.pathSub}>
            Personalized based on your quiz performance and completion history
          </p>
        </div>
        <div className={styles.pathProgress}>
          <span>{learningPath.filter(l => l.status === 'completed').length}</span>
          <span style={{ color: 'var(--text-muted)' }}>/ {learningPath.length} completed</span>
        </div>
      </div>

      {/* Roadmap */}
      <div className={styles.roadmap}>
        {learningPath.map((lp, idx) => {
          const course = courses.find(c => c.id === lp.courseId);
          if (!course) return null;
          return (
            <PathNode
              key={lp.id}
              lp={lp}
              course={course}
              isLast={idx === learningPath.length - 1}
              onStart={openVideo}
            />
          );
        })}
      </div>
    </div>
  );
}
