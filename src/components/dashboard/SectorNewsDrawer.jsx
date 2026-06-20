import { useState, useEffect } from 'react';
import { X, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import styles from './SectorNewsDrawer.module.css';

const NEWS_ARTICLES = [
  {
    id: 'art-1',
    title: 'MAS Unveils New Guidelines for Digital Wealth Advisers',
    source: 'Straits Times',
    date: 'June 18, 2026',
    category: 'Regulation',
    categoryClass: 'badgeRegulation',
    snippet: 'The Monetary Authority of Singapore (MAS) has released updated regulatory guidelines governing digital wealth managers and Robo-advisory firms to increase transparency...',
    fullText: 'The Monetary Authority of Singapore (MAS) today issued revised guidelines targeting digital investment portals and Robo-advisors. The new framework seeks to increase transparency in algorithm disclosures, portfolio construction methodologies, and liquidity stress testing. Advisors will be required to audit their advisory algorithms annually and provide clear disclosures on fee structures to retail investors. This development is expected to raise compliance standards and bolster investor trust in automated wealth solutions, while legacy firms are encouraged to adopt hybrid advisory models to stay competitive.',
    aiSummary: {
      executiveSummary: 'MAS has updated regulatory guidelines for digital wealth advisers, enforcing annual algorithm audits and clearer fee disclosures to boost investor protection.',
      keyTakeaways: [
        'Mandatory annual audits of advisory algorithms to ensure alignment with client risk profiles.',
        'Enforced transparency regarding portfolio construction methodologies and fee structure disclosures.',
        'Encourages wealth managers to adopt hybrid models combining digital capabilities with human advisor oversight.'
      ],
      advisorActions: [
        'Review clients using automated portfolio features and assure them of our hybrid compliance standards.',
        'Use fee transparency as a talking point to highlight value-add of active human portfolio oversight.'
      ]
    }
  },
  {
    id: 'art-2',
    title: 'CPF Interest Rates Set to Rise in Q3 2026: What Advisors Need to Know',
    source: 'Business Times',
    date: 'June 15, 2026',
    category: 'CPF & Annuities',
    categoryClass: 'badgeCPFAnnuities',
    snippet: 'The Ministry of Manpower has announced a revision to CPF interest rates for Ordinary and Special accounts, bringing Special Account yields to a competitive 4.25%...',
    fullText: 'Following an upward shift in global yields, the Ministry of Manpower (MOM) has announced a marginal increase in CPF Special Account and Ordinary Account interest rates for the upcoming quarter. The Special Account rate will increase to 4.25%, prompting financial planners to re-evaluate clients\' cash accumulation strategies. Analysts note that this adjustment reduces the relative attractiveness of low-risk corporate bonds, making CPF topping-up schemes a highly competitive option for risk-averse individuals nearing retirement age.',
    aiSummary: {
      executiveSummary: 'Ministry of Manpower is increasing the CPF Special Account interest rate to 4.25% in Q3 2026, boosting low-risk retirement accumulation options.',
      keyTakeaways: [
        'CPF Special Account interest rate adjusts upwards to 4.25% next quarter.',
        'Ordinary Account rate remains competitive but will be monitored closely alongside local bank deposit rates.',
        'Special Account yield becomes highly attractive relative to low-risk investment grade corporate bonds.'
      ],
      advisorActions: [
        'Target retirement-planning clients to review cash reserves and project CPF SA interest accumulations.',
        'Run comparative calculations for clients currently holding low-yield bonds or cash deposits.'
      ]
    }
  },
  {
    id: 'art-3',
    title: 'Singapore Property Market: Cooling Measures Impact High-Net-Worth Buying Trends',
    source: 'Channel NewsAsia',
    date: 'June 10, 2026',
    category: 'Real Estate',
    categoryClass: 'badgeRealEstate',
    snippet: 'Recent ABSD tax revisions have cooled prime residential transaction volumes, redirecting high-net-worth liquidity toward commercial assets and REIT portfolios...',
    fullText: 'Recent updates to the Additional Buyer’s Stamp Duty (ABSD) have shifted the investment patterns of high-net-worth individuals (HNWIs) in Singapore\'s residential sector. Transaction volumes in the prime Core Central Region (CCR) have dropped by 12% over the last two quarters, while capital has increasingly flowed into commercial real estate and industrial assets, which do not attract ABSD. Wealth advisors are shifting client allocations toward real estate investment trusts (REITs) and structured private debt to capture real estate exposure without high transaction friction.',
    aiSummary: {
      executiveSummary: 'ABSD hikes on prime residential properties have caused a 12% transaction drop, shifting HNWI interest toward tax-exempt commercial properties and REITs.',
      keyTakeaways: [
        'Core Central Region residential transaction volumes fell 12% due to ABSD adjustments.',
        'Capital is flowing into commercial and industrial real estate sectors which are exempt from ABSD.',
        'High interest in real estate investment trusts (REITs) and private debt as alternative real estate avenues.'
      ],
      advisorActions: [
        'Engage clients with heavy residential property exposure to discuss portfolio diversification.',
        'Introduce commercial REIT and structured debt options for clients looking to maintain real estate exposure tax-efficiently.'
      ]
    }
  },
  {
    id: 'art-4',
    title: 'Legacy Planning: Surge in Private Trust Configurations Among Gen Z and Millennials',
    source: 'Financial Times Asia',
    date: 'June 05, 2026',
    category: 'Estate Planning',
    categoryClass: 'badgeEstatePlanning',
    snippet: 'A comprehensive study shows that younger wealth creators are establishing asset protection trusts three times faster than previous generations to cover digital assets...',
    fullText: 'A comprehensive survey by Alliance Trust Co. indicates that Singaporeans aged 25 to 40 are establishing asset protection trusts at a rate three times higher than a decade ago. Driven by cryptocurrency wealth, digital business success, and early inheritance, younger wealth creators are prioritizing legacy preservation and business continuity. Advisors are recommended to incorporate digital assets, intellectual property, and international tax treaties into contemporary trust deeds to satisfy these modern estate planning profiles.',
    aiSummary: {
      executiveSummary: 'Millennials and Gen Z are configuring private asset protection trusts at three times the historical rate to secure digital assets and ensure legacy continuity.',
      keyTakeaways: [
        'Younger wealth creators (ages 25-40) are adopting legacy planning tools significantly earlier in life.',
        'Primary assets driving trust configuration include digital businesses, IP, cryptocurrencies, and early inheritance.',
        'Trust configurations are increasingly incorporating digital custody solutions and international tax clauses.'
      ],
      advisorActions: [
        'Proactively suggest estate planning and trust discussions for younger high-income clients and business owners.',
        'Update knowledge on digital asset preservation (private keys, intellectual property, tech business structures).'
      ]
    }
  }
];

export default function SectorNewsDrawer({ onClose }) {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [aiSummaries, setAiSummaries] = useState({});
  const [loadingArticleId, setLoadingArticleId] = useState(null);
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [articles, setArticles] = useState(NEWS_ARTICLES);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          if (isMounted) {
            setArticles(data.articles);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live news from RSS feed proxy. Using mock articles.', err);
      } finally {
        if (isMounted) {
          setIsLoadingNews(false);
        }
      }
    }
    fetchNews();
    return () => {
      isMounted = false;
    };
  }, []);

  const getFallbackSummary = (article) => {
    if (article.aiSummary) return article.aiSummary;
    return {
      executiveSummary: `This article covers "${article.title}" and its immediate significance to the financial sector and advisors in Singapore.`,
      keyTakeaways: [
        `Key developments in the sector as highlighted in this report from ${article.source}.`,
        `Potential shifts in client sentiment or query patterns regarding this topic.`,
        `Importance of staying informed about these market movements to offer high-quality guidance.`
      ],
      advisorActions: [
        `Monitor client inquiries relating to "${article.category}" and prepare proactive talking points.`,
        `Review existing asset allocations or financial plans in light of these industry updates.`
      ]
    };
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const handleGenerateSummary = async (articleId) => {
    setLoadingArticleId(articleId);
    setIsLiveAI(false);
    
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    try {
      const promptText = `You are an AI assistant for a financial advisor at Advisors Alliance Group (AAG).
Analyze the following financial sector news article and provide:
1. An executive summary (1-2 sentences).
2. 3 key takeaways for the advisor.
3. 2 recommended advisor actions (e.g., how to advise clients or adjust portfolios).

Article Title: ${article.title}
Article Body: ${article.fullText}

You must return your response as a valid JSON object matching the structure below. Do not include any other markdown formatting, backticks, or conversational text outside of the JSON block.

JSON Structure:
{
  "executiveSummary": "string",
  "keyTakeaways": ["string", "string", "string"],
  "advisorActions": ["string", "string"]
}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents: promptText })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      let rawText = data.text || '';

      // Clean up potential markdown formatting from AI output
      if (rawText.includes('```')) {
        const matches = rawText.match(/```(?:json)?([\s\S]*?)```/);
        if (matches && matches[1]) {
          rawText = matches[1].trim();
        }
      }

      const parsed = JSON.parse(rawText.trim());

      // Validate structure
      if (
        parsed.executiveSummary &&
        Array.isArray(parsed.keyTakeaways) &&
        Array.isArray(parsed.advisorActions)
      ) {
        setAiSummaries(prev => ({
          ...prev,
          [articleId]: parsed
        }));
        setIsLiveAI(true);
      } else {
        throw new Error('Received JSON does not match required schema');
      }

    } catch (err) {
      console.warn('AI summary generation failed or timed out. Falling back to local cached summary.', err);
      // Fallback to high-quality pre-seeded or dynamic mock summary
      setAiSummaries(prev => ({
        ...prev,
        [articleId]: getFallbackSummary(article)
      }));
      setIsLiveAI(false);
    } finally {
      setLoadingArticleId(null);
    }
  };

  const activeSummary = selectedArticle ? aiSummaries[selectedArticle.id] : null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Sparkles className={styles.headerIcon} size={20} />
            <span>Sector Insights & AI Summary</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close News Drawer">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className={styles.scrollBody}>
          {!selectedArticle ? (
            // Article List View
            <div>
              <h3 className={styles.listTitle}>Trending Financial Sector News</h3>
              <div className={styles.newsList}>
                {isLoadingNews ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className={`${styles.newsCard} ${styles.skeletonCard}`}>
                      <div className={styles.skeletonMeta} />
                      <div className={styles.skeletonTitle} />
                      <div className={styles.skeletonSnippet} />
                      <div className={styles.skeletonFooter} />
                    </div>
                  ))
                ) : (
                  articles.map(article => (
                    <div
                      key={article.id}
                      className={styles.newsCard}
                      onClick={() => {
                        setSelectedArticleId(article.id);
                      }}
                    >
                      <div className={styles.cardMeta}>
                        <span className={`${styles.categoryTag} ${styles[article.categoryClass]}`}>
                          {article.category}
                        </span>
                        <div className={styles.cardMetaRight}>
                          {article.id.startsWith('live-') && (
                            <span className={styles.liveBadge}>● Live</span>
                          )}
                          <span className={styles.dateText}>{article.date}</span>
                        </div>
                      </div>
                      <h4 className={styles.cardTitle}>{article.title}</h4>
                      <p className={styles.cardSnippet}>{article.snippet}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.sourceText}>{article.source}</span>
                        <span className={styles.readMoreLink}>
                          Read Details <ArrowLeft size={12} style={{ transform: 'rotate(180deg)' }} />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // Article Detail View
            <div>
              <button className={styles.backBtn} onClick={() => setSelectedArticleId(null)}>
                <ArrowLeft size={16} /> Back to News
              </button>

              <div className={styles.detailHeader}>
                <div className={styles.detailMeta}>
                  <span className={`${styles.categoryTag} ${styles[selectedArticle.categoryClass]}`}>
                    {selectedArticle.category}
                  </span>
                  <span>•</span>
                  <span>{selectedArticle.source}</span>
                  <span>•</span>
                  <span className={styles.dateText}>{selectedArticle.date}</span>
                </div>
                <h2 className={styles.detailTitle}>{selectedArticle.title}</h2>
                {selectedArticle.link && (
                  <div className={styles.sourceLinkWrapper}>
                    <a
                      href={selectedArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sourceLink}
                    >
                      <span>Read Original Article on {selectedArticle.source}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>

              <div className={styles.detailContent}>
                <p>{selectedArticle.fullText}</p>
              </div>

              {/* AI Insights & Summary Section */}
              <div className={styles.aiSection}>
                <div className={styles.aiHeader}>
                  <Sparkles className={styles.aiSparkleIcon} size={18} />
                  <h4>
                    AAG Advisor AI Insights {activeSummary && (isLiveAI ? '(Live Gemini AI)' : '(Cached)')}
                  </h4>
                </div>

                {loadingArticleId === selectedArticle.id ? (
                  // Simulated / Real AI Loading State
                  <div className={styles.aiLoading}>
                    <div className={styles.aiSpinner} />
                    <div className={styles.aiLoadingText}>Gemini AI is analyzing &amp; summarizing...</div>
                    <div className={styles.progressBarWrap}>
                      <div className={styles.progressBarFill} />
                    </div>
                  </div>
                ) : !activeSummary ? (
                  // Summary Activation View
                  <div>
                    <p className={styles.aiIntro}>
                      Let our AI analyze this article to pull key takeaways and recommended advisor action items.
                    </p>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      onClick={() => handleGenerateSummary(selectedArticle.id)}
                    >
                      <Sparkles size={14} /> Generate AI Summary
                    </button>
                  </div>
                ) : (
                  // AI Summary Result View
                  <div className={styles.aiResultsContent}>
                    {/* Executive Summary */}
                    <div className={styles.aiSubTitle}>Executive Summary</div>
                    <div className={styles.summaryBlock}>
                      <p className={styles.summaryText}>{activeSummary.executiveSummary}</p>
                    </div>

                    {/* Key Takeaways */}
                    <div className={styles.aiSubTitle}>Key Takeaways</div>
                    <ul className={styles.bulletList}>
                      {activeSummary.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className={styles.bulletItem}>{takeaway}</li>
                      ))}
                    </ul>

                    {/* Advisor Actions */}
                    <div className={styles.aiSubTitle}>Recommended Advisor Actions</div>
                    <ul className={styles.bulletList}>
                      {activeSummary.advisorActions.map((action, idx) => (
                        <li key={idx} className={styles.bulletItem}>{action}</li>
                      ))}
                    </ul>

                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
