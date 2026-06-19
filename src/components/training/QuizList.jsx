// src/components/training/QuizList.jsx
import { useState } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import QuizRunner from './QuizRunner.jsx';
import { FileText, CheckCircle, Clock, Award, BarChart2, RotateCcw } from 'lucide-react';
import styles from './QuizList.module.css';

const DIFF_CONFIG = {
  beginner:     { cls: 'badge-green', label: 'Beginner'     },
  intermediate: { cls: 'badge-amber', label: 'Intermediate' },
  advanced:     { cls: 'badge-red',   label: 'Advanced'     },
};

const CAT_COLORS = {
  ethics:    { bg: '#fef2f2', color: '#991b1b' },
  technical: { bg: '#eff6ff', color: '#1e40af' },
  product:   { bg: '#f0fdf4', color: '#166534' },
};

function QuizCard({ quiz, isCompleted, bestScore, onStart }) {
  const diff = DIFF_CONFIG[quiz.difficulty] || DIFF_CONFIG.intermediate;
  const cat  = CAT_COLORS[quiz.category]  || { bg: '#f3f4f6', color: '#374151' };

  return (
    <div className={`card ${styles.quizCard} ${isCompleted ? styles.cardDone : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.cardIcon} style={{ background: cat.bg, color: cat.color }}>
          <FileText size={20} />
        </div>
        <div className={styles.cardBadges}>
          <span className={`badge ${diff.cls}`}>{diff.label}</span>
          {isCompleted && (
            <span className={styles.doneBadge}>
              <CheckCircle size={11} /> Done
            </span>
          )}
        </div>
      </div>

      <h4 className={styles.cardTitle}>{quiz.title}</h4>
      <p className={styles.cardDesc}>{quiz.description}</p>

      <div className={styles.cardMeta}>
        <span><FileText size={13} /> {(quiz.questions || []).length} Qs</span>
        <span><Clock size={13} /> ~{(quiz.questions || []).length * 2} min</span>
        <span><Award size={13} /> {quiz.cpd} CPD</span>
      </div>

      {isCompleted && bestScore !== undefined && bestScore !== null && (
        <div className={styles.scoreBar}>
          <div className={styles.scoreBarFill} style={{ width: `${bestScore}%` }} />
          <span className={styles.scoreBarLabel}>Best: {bestScore}%</span>
        </div>
      )}

      <div className={styles.cardFoot}>
        <span className="badge" style={{ background: cat.bg, color: cat.color, fontSize: '0.72rem' }}>
          {quiz.category}
        </span>
        <button className={`btn btn-primary btn-sm`} onClick={() => onStart(quiz)}>
          {isCompleted ? <><RotateCcw size={13} /> Retake</> : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}

export default function QuizList() {
  const { completedQuizzes, quizzes = [], quizScores = {} } = useTraining();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [filter, setFilter] = useState('all');

  const FILTERS = [
    { key: 'all',       label: 'All Quizzes'  },
    { key: 'not_done',  label: 'Not Completed' },
    { key: 'done',      label: 'Completed'     },
    { key: 'ethics',    label: 'Ethics'        },
    { key: 'technical', label: 'Technical'     },
    { key: 'product',   label: 'Product'       },
  ];

  const filtered = quizzes.filter(q => {
    if (filter === 'all')       return true;
    if (filter === 'done')      return completedQuizzes.has(q.id);
    if (filter === 'not_done')  return !completedQuizzes.has(q.id);
    return q.category === filter;
  });

  const completedCount = quizzes.filter(q => completedQuizzes.has(q.id)).length;

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <BarChart2 size={20} style={{ color: 'var(--aag-primary)' }} />
          <div>
            <div className={styles.statNum}>{completedCount}/{quizzes.length}</div>
            <div className={styles.statLbl}>Completed</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <Award size={20} style={{ color: 'var(--success)' }} />
          <div>
            <div className={styles.statNum}>{quizzes.filter(q => completedQuizzes.has(q.id)).reduce((s, q) => s + q.cpd, 0).toFixed(1)}</div>
            <div className={styles.statLbl}>CPD hrs earned</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <FileText size={20} style={{ color: 'var(--info)' }} />
          <div>
            <div className={styles.statNum}>{quizzes.length - completedCount}</div>
            <div className={styles.statLbl}>Remaining</div>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`${styles.filterPill} ${filter === f.key ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map(q => (
          <QuizCard
            key={q.id}
            quiz={q}
            isCompleted={completedQuizzes.has(q.id)}
            bestScore={quizScores[q.id]}
            onStart={setActiveQuiz}
          />
        ))}
      </div>

      {/* Quiz Runner Modal */}
      {activeQuiz && (
        <QuizRunner quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
      )}
    </div>
  );
}
