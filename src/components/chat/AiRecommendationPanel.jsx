import { BookOpen, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './ChatWidget.module.css';

const categoryLabels = {
  comprehensive: 'Comprehensive Financial Planning',
  retirement: 'Retirement Planning',
  estate: 'Estate Planning',
  wealth: 'Strategic Wealth & Investment',
  private: 'Private Client Advisory (HNW)',
  corporate: 'Corporate Solutions & Employee Benefits'
};

export default function AiRecommendationPanel({ 
  loadingContext, 
  contextData,
  activeCategory
}) {
  const categoryTitle = categoryLabels[activeCategory] || 'Financial Advisory';

  // Filter Tier 2 & 3 indicators based on category relevance
  const getRelevantIndicators = () => {
    if (!contextData.tier2And3) return [];
    
    // Estate planning cares about legal stats, showing inflation/OPR as secondary
    // Wealth / Private cares about STI, KLCI, OPR, SORA
    // Corporate solutions cares about inflation, OPR
    if (activeCategory === 'estate') {
      return contextData.tier2And3.filter(item => item.key === 'inflation_my');
    }
    if (activeCategory === 'wealth' || activeCategory === 'private') {
      return contextData.tier2And3.filter(item => 
        ['bnm_opr', 'mas_sora', 'fbm_klci', 'sti_index'].includes(item.key)
      );
    }
    return contextData.tier2And3.filter(item => 
      ['bnm_opr', 'mas_sora', 'inflation_my', 'inflation_sg'].includes(item.key)
    );
  };

  const relevantIndicators = getRelevantIndicators();

  return (
    <div className={styles.aiPanelContainer}>
      {/* Panel Header */}
      <div className={styles.aiPanelHeader}>
        <h3 className={styles.aiPanelTitle}>
          <BookOpen size={18} color="#870105" /> 
          Reference Library
        </h3>
        <span className={styles.activeCategorySub}>
          {categoryTitle}
        </span>
      </div>

      <div className={styles.aiPanelContent}>
        {/* Market Indicators Section */}
        {relevantIndicators.length > 0 && (
          <div className={styles.aiSection}>
            <div className={styles.aiSectionTitle}>
              <TrendingUp size={14} color="#870105" /> Market Indicators
            </div>
            {loadingContext ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <span>Syncing rates...</span>
              </div>
            ) : (
              <div className={styles.indicatorGrid}>
                {relevantIndicators.map((ind) => (
                  <div key={ind.key} className={styles.indicatorCard}>
                    <div className={styles.indicatorLabel}>
                      {ind.key.toUpperCase().replace('_', ' ')}
                    </div>
                    <div className={styles.indicatorVal}>
                      {ind.value}
                      <span className={styles.indicatorUnit}>{ind.unit}</span>
                    </div>
                    <div className={styles.sourceFooter}>
                      {ind.source}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compliance Verified Stats Section */}
        <div className={styles.aiSection}>
          <div className={styles.aiSectionTitle}>
            <ShieldCheck size={14} color="#10b981" /> Sourced Stats & Citations
          </div>
          {loadingContext ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <span>Fetching compliance records...</span>
            </div>
          ) : (
            <div className={styles.statsCardList}>
              {contextData.tier1 && contextData.tier1.length > 0 ? (
                contextData.tier1.map((stat) => (
                  <div key={stat.id} className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <span className={styles.complianceBadge}>
                        <ShieldCheck size={12} /> Compliance Reviewed
                      </span>
                    </div>
                    <p className={styles.statValue}>"{stat.value}"</p>
                    <div className={styles.statMeta}>
                      <div className={styles.statCitation}>
                        Source: <strong>{stat.source}</strong>
                      </div>
                      {stat.reviewedBy && (
                        <div className={styles.reviewerInfo}>
                          Approved: {stat.reviewedBy} ({stat.reviewDate})
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyStatsState}>
                  <Info size={24} className={styles.emptyStatsIcon} />
                  <p>No statistics registered under this category.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {activeCategory === 'estate' && (
          <div className={styles.regulatoryWarningBox}>
            <span className={styles.warningTitle}>⚠️ High Legal Risk Warning</span>
            <p className={styles.warningText}>
              Islamic inheritance splits (Faraid) and non-Muslim asset distributions are strictly regulated. Verify legal circumstances before offering guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

AiRecommendationPanel.propTypes = {
  loadingContext: PropTypes.bool.isRequired,
  contextData: PropTypes.object.isRequired,
  activeCategory: PropTypes.string.isRequired
};
