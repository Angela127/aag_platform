// src/components/training/KnowledgeBase.jsx
import { useState, useMemo } from 'react';
import { useTraining } from '../../context/TrainingContext.jsx';
import { Search, FileText, Video, HelpCircle, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import styles from './KnowledgeBase.module.css';

const TYPE_CONFIG = {
  article:         { Icon: FileText,   label: 'Article',         cls: styles.typeArticle  },
  faq:             { Icon: HelpCircle, label: 'FAQ',             cls: styles.typeFaq      },
  video_timestamp: { Icon: Video,      label: 'Video Timestamp', cls: styles.typeVideo    },
};

const HIGHLIGHT_RE = (q) => {
  try { return new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'); }
  catch { return null; }
};

function highlight(text, q) {
  if (!q) return text;
  const re = HIGHLIGHT_RE(q);
  if (!re) return text;
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p)
      ? <mark key={i} className={styles.mark}>{p}</mark>
      : p
  );
}

function ResultCard({ article, query }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TYPE_CONFIG[article.type] || TYPE_CONFIG.article;
  const TypeIcon = tc.Icon;

  return (
    <div className={`${styles.resultCard} ${styles[article.type]}`}>
      <div className={styles.resultTop}>
        <div className={`${styles.typeTag} ${tc.cls}`}>
          <TypeIcon size={12} />
          {tc.label}
        </div>
        <span className={styles.catTag}>{article.category}</span>
      </div>

      <h4 className={styles.resultTitle}>{highlight(article.title, query)}</h4>

      <p className={`${styles.resultSummary} ${expanded ? styles.expanded : ''}`}>
        {highlight(article.summary, query)}
      </p>

      <div className={styles.resultFoot}>
        <div className={styles.tags}>
          {article.tags.map(t => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
        <div className={styles.resultActions}>
          {article.videoId && (
            <button className={styles.actionBtn}>
              <ExternalLink size={12} /> Watch at {article.timestamp}
            </button>
          )}
          <button className={styles.expandBtn} onClick={() => setExpanded(e => !e)}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeBase() {
  const { kbArticles = [] } = useTraining();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const results = useMemo(() => {
    if (!submitted) return [];
    const q = submitted.toLowerCase();
    return kbArticles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );
  }, [submitted, kbArticles]);

  const grouped = useMemo(() => {
    const g = { article: [], faq: [], video_timestamp: [] };
    results.forEach(r => { if (g[r.type]) g[r.type].push(r); });
    return g;
  }, [results]);

  const POPULAR = ['CPF LIFE', 'Suitability Assessment', 'STR filing', 'Keyman insurance', 'ILP', 'Buy-Sell Agreement'];

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmitted(query);
  };

  return (
    <div className={`${styles.page} animate-fadein`}>
      {/* Hero search */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <Zap size={28} style={{ color: 'var(--aag-primary)' }} />
        </div>
        <h2 className={styles.heroTitle}>Knowledge Base Lookup</h2>
        <p className={styles.heroSub}>
          Quickly find articles, FAQ answers, and video timestamps on any financial topic.
        </p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input
              id="kb-search"
              className={styles.searchInput}
              type="text"
              placeholder="e.g. 'CPF LIFE', 'trust nomination', 'keyman valuation'…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className={styles.clearBtn} onClick={() => { setQuery(''); setSubmitted(''); }}>✕</button>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Search
          </button>
        </form>

        {/* Popular topics */}
        <div className={styles.popular}>
          <span className={styles.popularLabel}>Popular:</span>
          {POPULAR.map(p => (
            <button
              key={p}
              className={styles.popularPill}
              onClick={() => { setQuery(p); setSubmitted(p); }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {submitted && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "<em>{submitted}</em>"
          </div>

          {results.length === 0 ? (
            <div className={styles.empty}>
              <Search size={36} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p>No results found. Try a different keyword or browse the Knowledge Library.</p>
            </div>
          ) : (
            <>
              {/* Articles */}
              {grouped.article.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}>
                    <FileText size={14} /> Articles ({grouped.article.length})
                  </div>
                  {grouped.article.map(a => <ResultCard key={a.id} article={a} query={submitted} />)}
                </div>
              )}

              {/* FAQs */}
              {grouped.faq.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}>
                    <HelpCircle size={14} /> FAQs ({grouped.faq.length})
                  </div>
                  {grouped.faq.map(a => <ResultCard key={a.id} article={a} query={submitted} />)}
                </div>
              )}

              {/* Video timestamps */}
              {grouped.video_timestamp.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}>
                    <Video size={14} /> Video Timestamps ({grouped.video_timestamp.length})
                  </div>
                  {grouped.video_timestamp.map(a => <ResultCard key={a.id} article={a} query={submitted} />)}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Empty state - no search yet */}
      {!submitted && (
        <div className={styles.startState}>
          <div className={styles.startGrid}>
            {[
              { icon: '📋', label: 'Articles', count: kbArticles.filter(a => a.type === 'article').length, desc: 'In-depth explanations and guides' },
              { icon: '❓', label: 'FAQs',     count: kbArticles.filter(a => a.type === 'faq').length,     desc: 'Quick answers to common questions' },
              { icon: '🎬', label: 'Video Timestamps', count: kbArticles.filter(a => a.type === 'video_timestamp').length, desc: 'Jump directly to key moments' },
            ].map(s => (
              <div key={s.label} className={styles.startCard}>
                <span className={styles.startEmoji}>{s.icon}</span>
                <div className={styles.startNum}>{s.count}</div>
                <div className={styles.startLabel}>{s.label}</div>
                <div className={styles.startDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
