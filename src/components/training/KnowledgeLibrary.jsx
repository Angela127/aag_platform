// src/components/training/KnowledgeLibrary.jsx
import { useState, useMemo } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { Search, Video, BookOpen, FileText, HelpCircle, Filter, Clock, Award, Play, CheckCircle } from 'lucide-react';
import styles from './KnowledgeLibrary.module.css';

const CATEGORIES = ['All', 'Ethics', 'Technical', 'Product'];

const TYPE_CONFIG = {
  video:    { Icon: Video,     label: 'Video',   cls: styles.typeVideo    },
  module:   { Icon: BookOpen,  label: 'Module',  cls: styles.typeModule   },
  document: { Icon: FileText,  label: 'Document', cls: styles.typeDoc     },
  faq:      { Icon: HelpCircle, label: 'FAQ',    cls: styles.typeFaq     },
};

const DIFFICULTY_BADGE = {
  beginner:     { cls: 'badge-green', label: 'Beginner'     },
  intermediate: { cls: 'badge-amber', label: 'Intermediate' },
  advanced:     { cls: 'badge-red',   label: 'Advanced'     },
};

function ResourceCard({ course, isCompleted, onStart }) {
  const tc = TYPE_CONFIG[course.type] || TYPE_CONFIG.document;
  const TypeIcon = tc.Icon;

  return (
    <div className={`card ${styles.resCard}`}>
      {/* Header strip */}
      <div className={`${styles.cardStrip} ${tc.cls}`}>
        <TypeIcon size={18} />
        <span>{tc.label}</span>
        {isCompleted && (
          <span className={styles.completedBadge}>
            <CheckCircle size={12} /> Done
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <h4 className={styles.cardTitle}>{course.title}</h4>
        <p className={styles.cardDesc}>{course.description}</p>

        {/* Tags */}
        <div className={styles.tagRow}>
          {course.tags.map(t => (
            <span key={t} className={`${styles.tag}`}>{t}</span>
          ))}
        </div>

        {/* Meta */}
        <div className={styles.metaRow}>
          <span className={styles.meta}>
            <Clock size={13} /> {course.duration}
          </span>
          <span className={styles.meta}>
            <Award size={13} /> {course.cpd} CPD hrs
          </span>
        </div>

        <button
          className={`btn btn-primary btn-sm ${styles.startBtn}`}
          onClick={() => onStart(course)}
        >
          <Play size={13} />
          {isCompleted ? 'Review Again' : 'Start Learning'}
        </button>
      </div>
    </div>
  );
}

export default function KnowledgeLibrary() {
  const { completedVideos, openVideo, courses = [] } = useTraining();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const TYPES = ['All', ...Object.keys(TYPE_CONFIG).map(k => TYPE_CONFIG[k].label)];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return courses.filter(c => {
      const matchesQ = !q || c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q));
      const matchesCat = category === 'All' || c.category === category.toLowerCase();
      const matchesType = typeFilter === 'All' || TYPE_CONFIG[c.type]?.label === typeFilter;
      return matchesQ && matchesCat && matchesType;
    });
  }, [query, category, typeFilter, courses]);

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* Search bar */}
      <div className={styles.searchWrap}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search courses, topics, or tags…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            id="library-search"
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <Filter size={14} className={styles.filterIcon} />
          <span className={styles.filterLabel}>Category:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterPill} ${category === cat ? styles.filterActive : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type:</span>
          {TYPES.map(t => (
            <button
              key={t}
              className={`${styles.filterPill} ${typeFilter === t ? styles.filterActive : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className={styles.resultMeta}>
        <span>{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</span>
        {(query || category !== 'All' || typeFilter !== 'All') && (
          <button
            className={styles.clearFilters}
            onClick={() => { setQuery(''); setCategory('All'); setTypeFilter('All'); }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results grid */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map(c => (
            <ResourceCard
              key={c.id}
              course={c}
              isCompleted={completedVideos.has(c.id)}
              onStart={openVideo}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Search size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
          <h4>No results found</h4>
          <p>Try adjusting your search or removing filters.</p>
        </div>
      )}
    </div>
  );
}
