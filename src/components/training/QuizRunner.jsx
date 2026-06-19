// src/components/training/QuizRunner.jsx
import { useState } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { CheckCircle, XCircle, RotateCcw, TrendingUp, TrendingDown, ArrowRight, X } from 'lucide-react';
import styles from './QuizRunner.module.css';

function ScoreDonut({ score }) {
  const size = 140;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? '#d97706' : 'var(--aag-primary)';

  return (
    <div className={styles.scoreDonut}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0ede8" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className={styles.scoreCenter}>
        <span className={styles.scoreNum} style={{ color }}>{score}%</span>
        <span className={styles.scoreLabel}>Score</span>
      </div>
    </div>
  );
}

export default function QuizRunner({ quiz, onClose }) {
  const { markQuizComplete } = useTraining();
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'result'
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]); // {qIdx, chosen, correct}

  const questions = quiz.questions;
  const q = questions[current];

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
    setAnswers(prev => [...prev, { qIdx: current, chosen: selected, correct: q.correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      const correctAnswers = answers.filter(a => a.chosen === a.correct).length;
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setPhase('result');
      markQuizComplete(quiz, finalScore);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRetake = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setPhase('quiz');
  };

  const score = answers.length > 0
    ? Math.round((answers.filter(a => a.chosen === a.correct).length / questions.length) * 100)
    : 0;

  const strengths = [];
  const weaknesses = [];
  answers.forEach((a, i) => {
    if (a.chosen === a.correct) strengths.push(questions[i]?.text?.slice(0, 40) + '…');
    else weaknesses.push(questions[i]?.text?.slice(0, 40) + '…');
  });

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{quiz.title}</h3>
            {phase === 'quiz' && (
              <p className={styles.sub}>Question {current + 1} of {questions.length}</p>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {phase === 'quiz' ? (
          <>
            {/* Progress bar */}
            <div className={styles.qProgress}>
              <div
                className={styles.qProgressFill}
                style={{ width: `${((current) / questions.length) * 100}%` }}
              />
            </div>

            <div className={styles.body}>
              {/* Question */}
              <div className={styles.questionBox}>
                <span className={styles.qNum}>Q{current + 1}</span>
                <p className={styles.qText}>{q.text}</p>
              </div>

              {/* Options */}
              <div className={styles.options}>
                {q.options.map((opt, idx) => {
                  let cls = styles.option;
                  if (revealed) {
                    if (idx === q.correct) cls += ` ${styles.optCorrect}`;
                    else if (idx === selected && selected !== q.correct) cls += ` ${styles.optWrong}`;
                    else if (idx !== selected) cls += ` ${styles.optFaded}`;
                  } else if (selected === idx) {
                    cls += ` ${styles.optSelected}`;
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      onClick={() => handleSelect(idx)}
                      disabled={revealed}
                    >
                      <span className={styles.optLetter}>{String.fromCharCode(65 + idx)}</span>
                      <span className={styles.optText}>{opt}</span>
                      {revealed && idx === q.correct && <CheckCircle size={16} className={styles.optIcon} />}
                      {revealed && idx === selected && selected !== q.correct && <XCircle size={16} className={styles.optIconWrong} />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after reveal */}
              {revealed && (
                <div className={`${styles.explanation} ${selected === q.correct ? styles.explCorrect : styles.explWrong}`}>
                  <strong>{selected === q.correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              {!revealed ? (
                <button
                  className="btn btn-primary"
                  disabled={selected === null}
                  onClick={handleReveal}
                >
                  Check Answer
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNext}>
                  {current + 1 >= questions.length ? 'View Results' : 'Next Question'}
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </>
        ) : (
          /* ── Result Screen ── */
          <div className={styles.resultBody}>
            <div className={styles.resultTop}>
              <ScoreDonut score={score} />
              <div className={styles.resultSummary}>
                <h3 className={styles.resultTitle}>
                  {score >= 80 ? '🎉 Excellent Work!' : score >= 60 ? '👍 Good Effort!' : '📚 Keep Practicing!'}
                </h3>
                <p className={styles.resultSub}>
                  You answered <strong>{answers.filter(a => a.chosen === a.correct).length}</strong> of <strong>{questions.length}</strong> questions correctly.
                </p>
                <div className={styles.cpdCredit}>
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  <span>+{quiz.cpd} CPD hours credited to your record</span>
                </div>
              </div>
            </div>

            {/* Strength / Weakness */}
            <div className={styles.swGrid}>
              <div className={styles.swCard} style={{ borderColor: '#86efac' }}>
                <div className={styles.swHeader} style={{ color: 'var(--success)' }}>
                  <TrendingUp size={15} /> Strengths ({strengths.length})
                </div>
                {strengths.length > 0 ? strengths.map((s, i) => (
                  <div key={i} className={styles.swItem}>✓ {s}</div>
                )) : <div className={styles.swEmpty}>—</div>}
              </div>

              <div className={styles.swCard} style={{ borderColor: '#fca5a5' }}>
                <div className={styles.swHeader} style={{ color: 'var(--aag-primary)' }}>
                  <TrendingDown size={15} /> Needs Work ({weaknesses.length})
                </div>
                {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                  <div key={i} className={styles.swItem}>✗ {w}</div>
                )) : <div className={styles.swEmpty}>None — perfect score!</div>}
              </div>
            </div>

            {/* CTA */}
            <div className={styles.resultFoot}>
              <button className="btn btn-secondary" onClick={handleRetake}>
                <RotateCcw size={15} /> Retake Quiz
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Back to Quizzes <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
