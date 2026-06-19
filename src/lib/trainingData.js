// src/lib/trainingData.js
// Hardcoded mock data for the Training & CPD module

// ─── CPD CATEGORIES ────────────────────────────────────────────────────────────
export const CPD_CATEGORIES = [
  { id: 'ethics',    label: 'Ethics',    color: '#870105', required: 12, earned: 9  },
  { id: 'technical', label: 'Technical', color: '#1d5ea8', required: 18, earned: 13 },
  { id: 'product',   label: 'Product',   color: '#2d7a4f', required: 10, earned: 6  },
];

export const CPD_TOTAL = { required: 40, earned: 28 };

// ─── EXPIRING CERTIFICATIONS ───────────────────────────────────────────────────
export const EXPIRING_CERTS = [
  { id: 'ec1', name: 'Ethics in Financial Planning',        expiresInDays: 14,  severity: 'danger'  },
  { id: 'ec2', name: 'MAS Regulatory Compliance (2025)',    expiresInDays: 30,  severity: 'warning' },
  { id: 'ec3', name: 'Anti-Money Laundering Certification', expiresInDays: 62,  severity: 'info'    },
];

// ─── CPD ACTIVITY LOG ─────────────────────────────────────────────────────────
export const CPD_ACTIVITY = [
  { id: 'a1', type: 'video',  title: 'Introduction to Estate Planning',      date: '2026-06-18', hours: 1.5,  category: 'technical' },
  { id: 'a2', type: 'quiz',   title: 'Retirement Planning Quiz',              date: '2026-06-15', hours: 0.5,  category: 'product'   },
  { id: 'a3', type: 'module', title: 'MAS Regulatory Framework Module',       date: '2026-06-10', hours: 3.0,  category: 'ethics'    },
  { id: 'a4', type: 'video',  title: 'Investment Risk Management Masterclass', date: '2026-06-05', hours: 2.0,  category: 'technical' },
  { id: 'a5', type: 'quiz',   title: 'Insurance Products Quiz',               date: '2026-06-01', hours: 0.5,  category: 'product'   },
];

// ─── LEARNING PATH / COURSES ───────────────────────────────────────────────────
export const COURSES = [
  {
    id: 'c01', title: 'Financial Ethics Foundations',
    category: 'ethics', cpd: 2.0, duration: '1h 45m',
    tags: ['Ethics', 'MAS', 'Compliance'], type: 'video',
    status: 'completed', description: 'Core ethical principles for financial advisors under MAS guidelines.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'Introduction & Overview' },
      { time: '12:30', title: 'MAS Code of Conduct' },
      { time: '28:45', title: 'Conflict of Interest Management' },
      { time: '48:00', title: 'Whistleblowing Framework' },
      { time: '68:20', title: 'Case Studies & Assessment' },
    ],
    aiSummary: 'This course covers MAS-mandated ethical standards including fiduciary duties, conflict of interest disclosures, and the whistleblowing framework. Key takeaway: advisors must prioritize client interests above firm incentives and document all material recommendations.',
  },
  {
    id: 'c02', title: 'Retirement Planning Basics',
    category: 'product', cpd: 1.5, duration: '1h 10m',
    tags: ['Retirement', 'CPF', 'SRS'], type: 'video',
    status: 'completed', description: 'CPF schemes, SRS contributions, and building a retirement income portfolio.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'CPF OA, SA & RA Overview' },
      { time: '18:00', title: 'SRS Account Strategy' },
      { time: '36:00', title: 'Annuities vs Drawdown' },
      { time: '54:00', title: 'Income Gap Analysis' },
    ],
    aiSummary: 'Covers CPF lifecycle optimization including MA shielding, RA top-ups, and SRS tax deferral. Advisors should map each client\'s retirement income sources and identify the gap requiring investment products.',
  },
  {
    id: 'c03', title: 'Advanced Retirement Planning',
    category: 'product', cpd: 2.5, duration: '2h 05m',
    tags: ['Retirement', 'Estate', 'Investment'], type: 'module',
    status: 'in_progress', description: 'Complex multi-phase retirement strategies for high net-worth clients.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'HNW Retirement Challenges' },
      { time: '22:00', title: 'Multi-Currency Income Streams' },
      { time: '44:00', title: 'Investment Portfolio Decumulation' },
      { time: '70:00', title: 'Legacy & Estate Coordination' },
    ],
    aiSummary: 'Deep-dive into HNW retirement: sequence-of-returns risk mitigation, bucket strategy implementation, offshore income repatriation considerations, and coordination with estate planning tools.',
  },
  {
    id: 'c04', title: 'Estate Management Fundamentals',
    category: 'technical', cpd: 3.0, duration: '2h 30m',
    tags: ['Estate', 'Legacy Planning', 'Trust'], type: 'video',
    status: 'locked', description: 'Wills, trusts, nomination structures, and cross-border estate complexities.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'Wills & Intestate Law' },
      { time: '28:00', title: 'Trust Structures Overview' },
      { time: '58:00', title: 'Nomination vs Inheritance' },
      { time: '88:00', title: 'Cross-Border Complications' },
      { time: '108:00', title: 'Practical Case Studies' },
    ],
    aiSummary: 'Comprehensive estate planning module covering Singapore intestate law, revocable/irrevocable trust structures, CPF nominations vs wills interaction, and common pitfalls in cross-border assets.',
  },
  {
    id: 'c05', title: 'Business Insurance Masterclass',
    category: 'product', cpd: 2.0, duration: '1h 40m',
    tags: ['Business Insurance', 'Keyman', 'Buy-Sell'], type: 'video',
    status: 'completed', description: 'Protecting business owners with keyman, buy-sell, and business continuity solutions.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'Business Risk Landscape' },
      { time: '18:00', title: 'Keyman Insurance Design' },
      { time: '38:00', title: 'Buy-Sell Agreement Funding' },
      { time: '58:00', title: 'Business Continuity Planning' },
      { time: '78:00', title: 'Premium Financing Strategies' },
    ],
    aiSummary: 'Keyman value calculation methods (multiple of salary vs EBITDA), funding vehicles for buy-sell agreements, and how to position business insurance as a tax-efficient corporate strategy.',
  },
  {
    id: 'c06', title: 'Investment Risk Management',
    category: 'technical', cpd: 2.5, duration: '2h 00m',
    tags: ['Investment', 'Risk', 'Portfolio'], type: 'video',
    status: 'completed', description: 'Portfolio theory, risk profiling, and constructing risk-adjusted client portfolios.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'Modern Portfolio Theory' },
      { time: '25:00', title: 'Risk Profiling Techniques' },
      { time: '50:00', title: 'Asset Allocation Frameworks' },
      { time: '82:00', title: 'Rebalancing & Drawdown Controls' },
    ],
    aiSummary: 'MPT application in client portfolios, behavioral risk assessment beyond questionnaires, factor-based allocation strategies, and systematic rebalancing with drawdown triggers.',
  },
  {
    id: 'c07', title: 'MAS Regulatory Compliance 2025',
    category: 'ethics', cpd: 3.0, duration: '2h 20m',
    tags: ['MAS', 'Compliance', 'Regulatory'], type: 'module',
    status: 'in_progress', description: 'Updated MAS requirements, FATCA/CRS obligations, and new advisory standards.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: '2025 MAS Policy Updates' },
      { time: '30:00', title: 'FATCA & CRS Obligations' },
      { time: '60:00', title: 'Digital Advisory Standards' },
      { time: '90:00', title: 'Supervisory Expectations' },
    ],
    aiSummary: 'Critical 2025 updates: new digital advisory conduct guidelines, expanded CRS reporting scope, revised suitability assessment requirements, and enhanced product governance expectations from MAS.',
  },
  {
    id: 'c08', title: 'Legacy Planning for HNW Clients',
    category: 'technical', cpd: 2.0, duration: '1h 35m',
    tags: ['Legacy Planning', 'HNW', 'Philanthropy'], type: 'module',
    status: 'locked', description: 'Philanthropic structures, family office setup, and multi-generational wealth transfer.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'HNW Client Dynamics' },
      { time: '20:00', title: 'Philanthropic Vehicles' },
      { time: '42:00', title: 'Family Governance' },
      { time: '62:00', title: 'Cross-Generation Wealth Transfer' },
    ],
    aiSummary: 'Private family foundations vs donor-advised funds, family office structuring thresholds, formal family governance charters, and efficient wealth transfer via discretionary trusts.',
  },
  {
    id: 'c09', title: 'Anti-Money Laundering Fundamentals',
    category: 'ethics', cpd: 2.0, duration: '1h 30m',
    tags: ['AML', 'KYC', 'Compliance'], type: 'module',
    status: 'completed', description: 'AML/CFT obligations, KYC procedures, and suspicious transaction reporting.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'AML Regulatory Framework' },
      { time: '22:00', title: 'KYC & CDD Procedures' },
      { time: '44:00', title: 'Suspicious Transaction Indicators' },
      { time: '62:00', title: 'STR Filing Requirements' },
    ],
    aiSummary: 'Singapore AML/CFT framework under MAS Notice FAA-N06, enhanced CDD for higher-risk clients, red flag indicators in financial advisory context, and proper STR filing with STRO.',
  },
  {
    id: 'c10', title: 'Digital Financial Planning Tools',
    category: 'technical', cpd: 1.5, duration: '1h 15m',
    tags: ['Digital', 'FinTech', 'Tools'], type: 'video',
    status: 'locked', description: 'Leveraging digital tools for financial planning, robo-advisory, and client engagement.',
    thumbnail: null,
    chapters: [
      { time: '0:00',  title: 'Digital Planning Ecosystem' },
      { time: '20:00', title: 'Robo-Advisory Integration' },
      { time: '42:00', title: 'Client Portal Best Practices' },
      { time: '60:00', title: 'Data Security & Privacy' },
    ],
    aiSummary: 'How to position digital tools alongside advisory services: goal-based planning software selection, hybrid human-robo model, client portal engagement strategies, and data governance obligations.',
  },
];

// ─── LEARNING PATH ─────────────────────────────────────────────────────────────
export const LEARNING_PATH = [
  { id: 'lp1', courseId: 'c01', step: 1, status: 'completed' },
  { id: 'lp2', courseId: 'c02', step: 2, status: 'completed' },
  { id: 'lp3', courseId: 'c06', step: 3, status: 'completed' },
  { id: 'lp4', courseId: 'c03', step: 4, status: 'current'   },
  { id: 'lp5', courseId: 'c04', step: 5, status: 'locked'    },
  { id: 'lp6', courseId: 'c08', step: 6, status: 'locked'    },
];

export const AI_RECOMMENDATION = {
  weakTopic: 'Retirement Planning',
  score: 58,
  message: 'You scored 58% in Retirement Planning — below the 70% threshold. We recommend completing the following path to build mastery:',
  path: ['c02', 'c03', 'c04'],
};

// ─── QUIZZES ──────────────────────────────────────────────────────────────────
export const QUIZZES = [
  {
    id: 'q01', title: 'Ethics & Professional Conduct',
    category: 'ethics', cpd: 0.5, difficulty: 'intermediate',
    status: 'completed', bestScore: 90,
    description: 'Test your knowledge of MAS ethical standards and professional conduct requirements.',
    questions: [
      {
        id: 1, text: 'Under MAS guidelines, what is the primary fiduciary duty of a financial advisor?',
        options: ['Maximize firm revenue', 'Act in the best interest of the client', 'Follow employer instructions', 'Meet sales targets'],
        correct: 1, explanation: 'Advisors have a fiduciary duty to act in the best interest of their clients, placing client interests above firm or personal interests.',
      },
      {
        id: 2, text: 'When must a conflict of interest be disclosed to a client?',
        options: ['Only if the client asks', 'Never, it is confidential', 'Before providing the relevant advice or service', 'After the transaction is completed'],
        correct: 2, explanation: 'MAS requires disclosure of material conflicts of interest before providing advice, so clients can make informed decisions.',
      },
      {
        id: 3, text: 'Which document must advisors provide before making a product recommendation?',
        options: ['Contract note', 'Product Highlights Sheet (PHS)', 'Annual report', 'Company brochure'],
        correct: 1, explanation: 'A Product Highlights Sheet (PHS) must be provided to retail clients before making an investment product recommendation.',
      },
      {
        id: 4, text: 'What does "suitability assessment" refer to in financial advisory?',
        options: ['Assessing office suitability', 'Evaluating if a product matches the client\'s profile, needs, and risk appetite', 'Checking client credit score', 'Verifying client identity'],
        correct: 1, explanation: 'Suitability assessment ensures the recommended product is appropriate given the client\'s financial situation, objectives, and risk tolerance.',
      },
      {
        id: 5, text: 'How long must financial advisors retain client records under MAS regulations?',
        options: ['1 year', '3 years', '5 years', '10 years'],
        correct: 2, explanation: 'MAS requires financial advisors to retain records of recommendations and transactions for a minimum of 5 years.',
      },
    ],
  },
  {
    id: 'q02', title: 'Retirement Planning Fundamentals',
    category: 'product', cpd: 0.5, difficulty: 'beginner',
    status: 'completed', bestScore: 60,
    description: 'Core concepts of CPF, SRS, and retirement income planning.',
    questions: [
      {
        id: 1, text: 'What is the CPF Full Retirement Sum (FRS) designed to provide?',
        options: ['Lump sum payout at 55', 'Monthly income from age 65 for life', 'Housing loan repayment', 'Medical expense coverage'],
        correct: 1, explanation: 'The FRS is designed to provide CPF members with a monthly income for life from their payout eligibility age via CPF LIFE.',
      },
      {
        id: 2, text: 'What is the maximum annual SRS contribution for Singapore citizens?',
        options: ['$10,000', '$15,300', '$30,000', '$50,000'],
        correct: 1, explanation: 'Singapore citizens and PRs can contribute up to $15,300 per year to their Supplementary Retirement Scheme (SRS) account.',
      },
      {
        id: 3, text: 'At what age can CPF members make their first withdrawal from their Retirement Account?',
        options: ['55', '60', '65', '70'],
        correct: 2, explanation: 'CPF members can start receiving monthly payouts from their Retirement Account from the payout eligibility age of 65.',
      },
      {
        id: 4, text: 'Which CPF account earns the highest interest rate?',
        options: ['Ordinary Account (OA)', 'Special Account (SA)', 'MediSave Account (MA)', 'Retirement Account (RA)'],
        correct: 1, explanation: 'The Special Account earns 4% per annum (vs 2.5% for OA), making it optimal for long-term retirement savings.',
      },
      {
        id: 5, text: 'What happens to SRS funds withdrawn before age 62?',
        options: ['No tax penalty', '5% penalty + 100% taxable', '5% penalty + 50% taxable', 'Full tax exemption'],
        correct: 1, explanation: 'Withdrawals before 62 incur a 5% penalty and the full amount withdrawn is included in taxable income for that year.',
      },
    ],
  },
  {
    id: 'q03', title: 'Investment Risk Management',
    category: 'technical', cpd: 0.5, difficulty: 'advanced',
    status: 'not_started', bestScore: null,
    description: 'Portfolio theory, risk profiling, and asset allocation for client portfolios.',
    questions: [
      {
        id: 1, text: 'What does Standard Deviation measure in a portfolio context?',
        options: ['Average returns', 'Volatility of returns around the mean', 'Maximum drawdown', 'Beta sensitivity'],
        correct: 1, explanation: 'Standard deviation measures the dispersion of returns around the mean, representing the total risk (both systematic and unsystematic) of an investment.',
      },
      {
        id: 2, text: 'A client has a beta of 1.5 in their portfolio. What does this indicate?',
        options: ['50% less volatile than the market', '50% more volatile than the market', 'Same volatility as the market', 'No correlation with the market'],
        correct: 1, explanation: 'A beta of 1.5 means the portfolio is expected to move 1.5x the market — 50% more volatile than the benchmark index.',
      },
      {
        id: 3, text: 'What is the Sharpe Ratio used to measure?',
        options: ['Absolute returns', 'Risk-adjusted return per unit of total risk', 'Portfolio turnover', 'Dividend yield'],
        correct: 1, explanation: 'The Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Standard Deviation, measuring excess return per unit of risk taken.',
      },
      {
        id: 4, text: 'Which asset allocation strategy maintains a fixed percentage in each asset class regardless of market movements?',
        options: ['Tactical asset allocation', 'Strategic asset allocation', 'Dynamic asset allocation', 'Buy-and-hold'],
        correct: 1, explanation: 'Strategic asset allocation sets long-term target weights and rebalances back to those targets periodically, regardless of market conditions.',
      },
      {
        id: 5, text: 'What is sequence-of-returns risk most relevant to?',
        options: ['Accumulation phase investors', 'Decumulation/withdrawal phase investors', 'Institutional investors', 'Short-term traders'],
        correct: 1, explanation: 'Sequence risk affects retirees in the withdrawal phase — a market downturn early in retirement can permanently deplete a portfolio even if long-term average returns are positive.',
      },
    ],
  },
  {
    id: 'q04', title: 'Business Insurance Essentials',
    category: 'product', cpd: 0.5, difficulty: 'intermediate',
    status: 'not_started', bestScore: null,
    description: 'Keyman insurance, buy-sell agreements, and business continuity planning.',
    questions: [
      {
        id: 1, text: 'What is the primary purpose of Keyman insurance?',
        options: ['Cover all employees equally', 'Compensate the business for financial loss due to death/disability of a key person', 'Provide health benefits', 'Fund employee pensions'],
        correct: 1, explanation: 'Keyman insurance compensates a business for the financial impact of losing a key employee — covering replacement costs, lost revenue, and loan repayments.',
      },
      {
        id: 2, text: 'In a cross-purchase buy-sell agreement, who owns the insurance policies?',
        options: ['The business entity', 'Each business partner owns policies on the other partners', 'A trustee', 'The bank'],
        correct: 1, explanation: 'In a cross-purchase structure, each partner owns and pays for life insurance on the other partners, using proceeds to buy out the deceased partner\'s share.',
      },
      {
        id: 3, text: 'Which method is commonly used to value keyman insurance coverage?',
        options: ['Multiple of annual salary or EBITDA contribution', 'Net asset value only', 'Share price', 'Tax assessment value'],
        correct: 0, explanation: 'Keyman value is typically calculated as a multiple (5-10x) of the key person\'s annual salary, or their contribution to company EBITDA/revenue.',
      },
      {
        id: 4, text: 'What is the tax treatment of keyman insurance premiums in Singapore?',
        options: ['Always tax-deductible', 'Tax-deductible if proceeds are taxable income to the company', 'Never deductible', 'Deductible only for listed companies'],
        correct: 1, explanation: 'If keyman insurance proceeds are treated as taxable income for the company, the premiums are deductible. This must be structured with IRAS guidance.',
      },
      {
        id: 5, text: 'What is the main advantage of a Buy-Sell Agreement funded by insurance?',
        options: ['Avoids all taxes', 'Provides guaranteed funding for business succession without requiring cash reserves', 'Eliminates the need for a valuation', 'Requires no legal documentation'],
        correct: 1, explanation: 'Insurance-funded buy-sell agreements ensure liquidity is immediately available at death/disability, without requiring the surviving partners to liquidate business assets or take loans.',
      },
    ],
  },
  {
    id: 'q05', title: 'Estate Planning & Legacy',
    category: 'technical', cpd: 0.5, difficulty: 'advanced',
    status: 'not_started', bestScore: null,
    description: 'Wills, trusts, nominations, and cross-border estate considerations.',
    questions: [
      {
        id: 1, text: 'What happens to CPF savings if a member dies without a valid CPF nomination?',
        options: ['Distributed per the will', 'Distributed by the Public Trustee to eligible family members', 'Forfeited to the government', 'Transferred to next of kin automatically'],
        correct: 1, explanation: 'CPF savings (being statutory funds, not estate assets) are distributed by the Public Trustee under intestate succession rules if there is no valid nomination.',
      },
      {
        id: 2, text: 'Under Singapore intestate succession law, if a person dies with a spouse and two children, what share does the spouse receive?',
        options: ['100%', '1/3', '1/2', '2/3'],
        correct: 1, explanation: 'Under the Intestate Succession Act, a spouse receives 1/3 of the estate when there are surviving children.',
      },
      {
        id: 3, text: 'What is the key difference between a revocable and irrevocable trust?',
        options: ['Tax treatment only', 'A revocable trust can be changed/cancelled; an irrevocable trust generally cannot', 'Only the beneficiaries differ', 'Cost of setup'],
        correct: 1, explanation: 'A revocable trust can be amended or revoked by the settlor during their lifetime. An irrevocable trust cannot, which provides greater asset protection and potential tax benefits.',
      },
      {
        id: 4, text: 'Which insurance nomination type allows proceeds to bypass the estate and be paid directly to nominees?',
        options: ['Testamentary nomination', 'Revocable nomination', 'Trust nomination', 'Conditional nomination'],
        correct: 2, explanation: 'A trust nomination under the Insurance Act designates nominees as trustees/beneficiaries, bypassing probate and ensuring direct payment outside the estate.',
      },
      {
        id: 5, text: 'What is a Letter of Wishes in the context of estate planning?',
        options: ['A legally binding will supplement', 'A non-binding document guiding trustees on how to exercise discretion', 'A tax filing requirement', 'A court order'],
        correct: 1, explanation: 'A Letter of Wishes is a non-binding document that guides trustees on the settlor\'s preferences, providing context without legally restricting the trustee\'s discretion.',
      },
    ],
  },
  {
    id: 'q06', title: 'AML & KYC Compliance',
    category: 'ethics', cpd: 0.5, difficulty: 'intermediate',
    status: 'completed', bestScore: 80,
    description: 'Anti-money laundering procedures, KYC requirements, and suspicious transaction reporting.',
    questions: [
      {
        id: 1, text: 'What does "CDD" stand for in KYC processes?',
        options: ['Client Data Documentation', 'Customer Due Diligence', 'Compliance Disclosure Document', 'Credit Default Derivative'],
        correct: 1, explanation: 'Customer Due Diligence (CDD) refers to the process of verifying a client\'s identity, understanding their business, and assessing the risk they pose for financial crime.',
      },
      {
        id: 2, text: 'When is Enhanced Due Diligence (EDD) required?',
        options: ['For all retail clients', 'For politically exposed persons (PEPs) and higher-risk clients', 'Only for corporate clients', 'When client assets exceed $1M'],
        correct: 1, explanation: 'EDD is required for higher-risk clients such as PEPs, non-face-to-face clients, clients from high-risk jurisdictions, and those with unusual transaction patterns.',
      },
      {
        id: 3, text: 'To whom must a Suspicious Transaction Report (STR) be filed in Singapore?',
        options: ['MAS directly', 'Suspicious Transaction Reporting Office (STRO) under the Police Force', 'The Singapore Exchange', 'The client\'s bank'],
        correct: 1, explanation: 'STRs must be filed with STRO (Suspicious Transaction Reporting Office), a unit of the Singapore Police Force, under the Corruption, Drug Trafficking and Other Serious Crimes Act.',
      },
      {
        id: 4, text: 'What is "tipping off" in the context of AML?',
        options: ['Providing a gratuity', 'Informing a client that they are under AML investigation', 'Filing an STR', 'Reporting to MAS'],
        correct: 1, explanation: 'Tipping off is the criminal offense of notifying a person that they are being investigated for money laundering, which can compromise law enforcement investigations.',
      },
      {
        id: 5, text: 'How often must CDD be refreshed for existing clients?',
        options: ['Never, only at onboarding', 'Annually for all clients', 'Risk-based — higher risk clients reviewed more frequently', 'Every 5 years for all clients'],
        correct: 2, explanation: 'CDD refresh is risk-based under MAS Notice FAA-N06: high-risk clients reviewed annually, medium-risk every 2 years, and low-risk every 3 years.',
      },
    ],
  },
  {
    id: 'q07', title: 'Life Insurance Products',
    category: 'product', cpd: 0.5, difficulty: 'beginner',
    status: 'not_started', bestScore: null,
    description: 'Term, whole life, ILP, and endowment products explained.',
    questions: [
      {
        id: 1, text: 'What is the main characteristic of a term life insurance policy?',
        options: ['Builds cash value', 'Provides coverage for a specific period with no savings component', 'Includes investment returns', 'Is permanent coverage'],
        correct: 1, explanation: 'Term life provides pure death benefit protection for a fixed term. It has no cash value, making it the lowest-cost life insurance option.',
      },
      {
        id: 2, text: 'What distinguishes a whole life policy from a term policy?',
        options: ['Whole life is always cheaper', 'Whole life provides lifelong coverage and accumulates cash value', 'Term life has investment options', 'No significant difference'],
        correct: 1, explanation: 'Whole life insurance provides permanent coverage and builds guaranteed cash value over time, which can be accessed via policy loans or surrenders.',
      },
      {
        id: 3, text: 'In an Investment-Linked Policy (ILP), investment risk is borne by:',
        options: ['The insurer', 'The policyholder', 'A fund manager', 'The government'],
        correct: 1, explanation: 'In an ILP, the policyholder bears the investment risk as premiums are allocated to sub-funds. The death benefit may fluctuate with fund performance.',
      },
      {
        id: 4, text: 'What is a surrender value?',
        options: ['The death benefit', 'The amount paid to the policyholder if the policy is terminated before maturity', 'Annual dividend', 'Reinsurance payment'],
        correct: 1, explanation: 'Surrender value is the cash amount a policyholder receives if they choose to cancel their permanent life or endowment policy before the maturity date.',
      },
      {
        id: 5, text: 'Which policy type provides both life coverage AND a guaranteed maturity payout?',
        options: ['Term life', 'ILP', 'Endowment policy', 'Group insurance'],
        correct: 2, explanation: 'An endowment policy provides both a death benefit during the policy term and a guaranteed lump sum payout at maturity, combining protection and savings.',
      },
    ],
  },
  {
    id: 'q08', title: 'MAS Regulatory Framework',
    category: 'ethics', cpd: 1.0, difficulty: 'advanced',
    status: 'in_progress', bestScore: null,
    description: 'Financial Advisers Act, licensing requirements, and MAS notices.',
    questions: [
      {
        id: 1, text: 'What is the primary legislation governing financial advisory activities in Singapore?',
        options: ['Securities and Futures Act (SFA)', 'Financial Advisers Act (FAA)', 'Companies Act', 'Insurance Act'],
        correct: 1, explanation: 'The Financial Advisers Act (FAA) is the primary legislation that regulates the conduct of financial advisory businesses and financial advisers in Singapore.',
      },
      {
        id: 2, text: 'Which MAS notice governs the conduct requirements for financial advisers?',
        options: ['MAS Notice 626', 'MAS Notice FAA-N16', 'MAS Notice SFA 01', 'MAS Notice FAA-N01'],
        correct: 3, explanation: 'MAS Notice FAA-N01 (Notice on Recommendations on Investment Products) outlines key conduct requirements including suitability assessments and disclosure obligations.',
      },
      {
        id: 3, text: 'Under the FAA, a Representative must be appointed by a licensed Financial Adviser before they can conduct advisory activities. True or False?',
        options: ['True', 'False', 'Only for insurance products', 'Only for investments above $1M'],
        correct: 0, explanation: 'True — under the FAA, all representatives must be formally appointed by and act under the authority of a licensed Financial Adviser firm.',
      },
      {
        id: 4, text: 'What is the minimum paid-up capital requirement for a Financial Adviser license in Singapore?',
        options: ['$50,000', '$100,000', '$250,000', '$500,000'],
        correct: 1, explanation: 'The minimum paid-up capital for a Financial Adviser license under MAS is $150,000 for restricted scope and $500,000 for full scope — $100,000 is the minimum liquid assets requirement, not paid-up capital.',
      },
      {
        id: 5, text: 'What must be included in a Financial Needs Analysis (FNA)?',
        options: ['Only the recommended product', 'Client\'s financial objectives, current coverage, risk profile, and any gaps identified', 'Investment returns projection only', 'Tax computation'],
        correct: 1, explanation: 'An FNA must document the client\'s financial objectives, existing coverage, risk appetite, financial commitments, and identified protection/investment gaps to justify recommendations.',
      },
    ],
  },
  {
    id: 'q09', title: 'CPF & SRS Planning',
    category: 'product', cpd: 0.5, difficulty: 'intermediate',
    status: 'not_started', bestScore: null,
    description: 'Advanced CPF optimization strategies and SRS planning.',
    questions: [
      {
        id: 1, text: 'What is "CPF MA Shielding"?',
        options: ['Protecting MediSave from withdrawal', 'Investing MA savings in approved instruments before it reaches the Basic Healthcare Sum to avoid the funds being transferred to the RA at 55', 'A type of health insurance', 'MA interest rate protection'],
        correct: 1, explanation: 'MA shielding is a strategy where members invest their MA funds (exceeding the BHS) in approved instruments before age 55, so those funds are not automatically transferred to the RA.',
      },
      {
        id: 2, text: 'What is the Retirement Sum Topping-Up Scheme (RSTU) benefit?',
        options: ['Tax relief of up to $8,000 for top-ups to own RA/SA, and additional $8,000 for top-ups to family members', 'Free government matching', 'Employer CPF contributions', 'Interest rate bonus'],
        correct: 0, explanation: 'Under RSTU, individuals can get tax relief of up to $8,000 for cash top-ups to their own CPF SA/RA, and an additional $8,000 for cash top-ups to eligible family members\' CPF.',
      },
      {
        id: 3, text: 'When should SRS contributions ideally be made to maximize tax benefits?',
        options: ['January each year', 'Before December 31 each year to qualify for that year\'s tax relief', 'After filing taxes', 'Any time equally beneficial'],
        correct: 1, explanation: 'SRS contributions must be made by December 31 to be counted for that calendar year\'s tax relief claim.',
      },
      {
        id: 4, text: 'What is the CPF Ordinary Account ceiling for home purchases?',
        options: ['There is no ceiling', 'The Valuation Limit (VL) of the property', 'The Basic Retirement Sum (BRS)', 'The purchase price only'],
        correct: 1, explanation: 'CPF usage for property is subject to the Valuation Limit (VL), which is the lower of the property\'s purchase price or valuation at time of purchase.',
      },
      {
        id: 5, text: 'Which CPF scheme provides lifelong monthly payouts?',
        options: ['CPF Investment Scheme (CPFIS)', 'CPF LIFE (Lifelong Income For the Elderly)', 'MediShield Life', 'CPF Education Scheme'],
        correct: 1, explanation: 'CPF LIFE is a national annuity scheme that provides CPF members with monthly payouts for life from their Payout Eligibility Age, funded by the Retirement Account savings.',
      },
    ],
  },
  {
    id: 'q10', title: 'Investment Products Overview',
    category: 'technical', cpd: 0.5, difficulty: 'beginner',
    status: 'not_started', bestScore: null,
    description: 'Unit trusts, bonds, ETFs, and REITs for client portfolios.',
    questions: [
      {
        id: 1, text: 'What is the key difference between a unit trust and an ETF?',
        options: ['Unit trusts are traded on exchanges; ETFs are not', 'ETFs are traded on stock exchanges throughout the day; unit trusts are priced once daily', 'ETFs have higher fees', 'No practical difference'],
        correct: 1, explanation: 'ETFs trade on stock exchanges throughout the day like shares, while unit trust prices are calculated once daily at end-of-day NAV.',
      },
      {
        id: 2, text: 'What does "duration" measure in the context of bonds?',
        options: ['The bond\'s maturity date', 'The bond\'s sensitivity to interest rate changes', 'The coupon payment frequency', 'The credit rating'],
        correct: 1, explanation: 'Duration measures a bond\'s price sensitivity to changes in interest rates. A higher duration = greater interest rate risk (price will fall more for the same rate increase).',
      },
      {
        id: 3, text: 'REITs in Singapore are required to distribute what minimum percentage of taxable income to unitholders?',
        options: ['50%', '75%', '90%', '100%'],
        correct: 2, explanation: 'Singapore REITs must distribute at least 90% of their taxable income to enjoy tax transparency (where distributions are tax-exempt at the REIT level).',
      },
      {
        id: 4, text: 'What is the "expense ratio" of a unit trust?',
        options: ['The front-end sales charge', 'Annual fees as a percentage of AUM that cover management and operating costs', 'Performance fee', 'Transaction costs only'],
        correct: 1, explanation: 'The expense ratio (or Total Expense Ratio) represents the annual cost of running the fund as a percentage of net assets, deducted from the fund\'s returns.',
      },
      {
        id: 5, text: 'What is a "dollar-cost averaging" strategy?',
        options: ['Investing a lump sum at market lows', 'Investing a fixed dollar amount at regular intervals regardless of market price', 'Timing the market', 'Diversifying across currencies'],
        correct: 1, explanation: 'Dollar-cost averaging involves investing a fixed amount at regular intervals, automatically buying more units when prices are low and fewer when prices are high, reducing average cost over time.',
      },
    ],
  },
  {
    id: 'q11', title: 'Financial Needs Analysis',
    category: 'technical', cpd: 0.5, difficulty: 'intermediate',
    status: 'not_started', bestScore: null,
    description: 'Conducting comprehensive FNA and identifying client protection gaps.',
    questions: [
      {
        id: 1, text: 'What is the Human Life Value (HLV) approach used for?',
        options: ['Calculating investment returns', 'Estimating the economic value of a person\'s future earnings to determine life insurance needs', 'Tax planning', 'Medical cost estimation'],
        correct: 1, explanation: 'HLV calculates the present value of a person\'s future earning capacity, which represents the financial loss their dependents would suffer at death — used to determine insurance needs.',
      },
      {
        id: 2, text: 'Which needs analysis method considers specific financial obligations rather than income replacement?',
        options: ['Human Life Value method', 'Needs-based approach (capital sum needed for debts, income replacement, estate costs)', 'Risk-free rate method', 'Annuity method'],
        correct: 1, explanation: 'The needs-based approach identifies specific financial needs: outstanding debts, income replacement years, future expenses, and estate costs — providing a more targeted coverage amount.',
      },
      {
        id: 3, text: 'What is "protection gap" in financial planning?',
        options: ['Gap between insurance premiums', 'The difference between a client\'s insurance needs and existing coverage', 'Gap between assets and liabilities', 'Investment shortfall'],
        correct: 1, explanation: 'The protection gap is the difference between the insurance coverage a client needs (based on FNA) and what they currently have in place.',
      },
      {
        id: 4, text: 'At what income replacement ratio should critical illness coverage typically be calculated?',
        options: ['25% of annual income', '50% of annual income x 3-5 years', '100% of life insurance coverage', 'Fixed at $100,000'],
        correct: 1, explanation: 'CI coverage is typically recommended at 3-5 years of annual income, as this covers the period of recovery, income loss, and additional medical expenses beyond basic hospitalization.',
      },
      {
        id: 5, text: 'What must a fact-find form capture regarding a client\'s existing policies?',
        options: ['Only policy numbers', 'Type of coverage, sum assured, premiums, insurer, and beneficiaries', 'Purchase date only', 'No need to document existing policies'],
        correct: 1, explanation: 'A thorough fact-find must document all existing policies including coverage type, sum assured, premium, insurer, beneficiary designations, and any exclusions to accurately assess protection gaps.',
      },
    ],
  },
  {
    id: 'q12', title: 'Health Insurance & MediShield',
    category: 'product', cpd: 0.5, difficulty: 'beginner',
    status: 'not_started', bestScore: null,
    description: 'MediShield Life, Integrated Shield Plans, and critical illness planning.',
    questions: [
      {
        id: 1, text: 'What is MediShield Life?',
        options: ['A voluntary private health insurance', 'A mandatory national health insurance scheme covering all Singapore Citizens and PRs for large hospitalization bills', 'A CPF savings scheme', 'A government subsidy program'],
        correct: 1, explanation: 'MediShield Life is a mandatory basic health insurance scheme for all Singapore Citizens and Permanent Residents, covering large hospitalization bills and selected outpatient treatments.',
      },
      {
        id: 2, text: 'What is an Integrated Shield Plan (IP)?',
        options: ['A replacement for MediShield Life', 'A private insurance that integrates with and enhances MediShield Life for higher ward classes and private hospitals', 'An investment plan', 'A government subsidy'],
        correct: 1, explanation: 'An Integrated Shield Plan is a combination of MediShield Life (compulsory) plus an additional private insurance component, covering higher ward classes and private hospital care.',
      },
      {
        id: 3, text: 'Can MediSave be used to pay for Integrated Shield Plan premiums?',
        options: ['No, only cash allowed', 'Yes, for both the basic and rider component', 'Yes, but only for the MediShield Life component; riders must be paid in cash', 'Only for the first year'],
        correct: 2, explanation: 'From April 2021, IP riders cannot be funded by MediSave — only the basic IP component can. Rider premiums must be paid in cash to promote cost-conscious healthcare usage.',
      },
      {
        id: 4, text: 'What does a "co-payment" requirement in ISP riders mean?',
        options: ['The insurer pays 100% of claims', 'The policyholder must pay a minimum percentage of their claimable medical bills', 'Premium sharing with employer', 'Government co-funding'],
        correct: 1, explanation: 'Co-payment requirements (typically 5% minimum under MAS regulations from 2021) mean policyholders pay at least 5% of the total claimable bill, encouraging cost-consciousness.',
      },
      {
        id: 5, text: 'Critical Illness insurance pays out upon:',
        options: ['Hospital admission only', 'Diagnosis of a covered critical illness, regardless of medical expenses incurred', 'Death benefit only', 'Disability only'],
        correct: 1, explanation: 'CI insurance provides a lump sum payout upon diagnosis of a covered illness (e.g., cancer, heart attack, stroke), which the insured can use for any purpose — not limited to medical expenses.',
      },
    ],
  },
];

// ─── CERTIFICATE BADGES ────────────────────────────────────────────────────────
export const CERTIFICATES = [
  {
    id: 'cert01', title: 'Certified Financial Planner',
    issuer: 'AAG Training Academy', date: '2025-08-15',
    status: 'earned', color: '#870105',
    icon: '🏅', cpd: 20,
    description: 'Comprehensive financial planning certification covering all core advisory competencies.',
    requirements: null,
  },
  {
    id: 'cert02', title: 'Ethics & Compliance Champion',
    issuer: 'AAG Training Academy', date: '2025-11-30',
    status: 'earned', color: '#2d7a4f',
    icon: '⚖️', cpd: 12,
    description: 'Recognized mastery of MAS regulatory requirements and ethical advisory standards.',
    requirements: null,
  },
  {
    id: 'cert03', title: 'Insurance Products Specialist',
    issuer: 'AAG Training Academy', date: '2026-01-20',
    status: 'earned', color: '#1d5ea8',
    icon: '🛡️', cpd: 10,
    description: 'Expertise in life, health, and business insurance product suite.',
    requirements: null,
  },
  {
    id: 'cert04', title: 'AML/KYC Certified Professional',
    issuer: 'AAG Training Academy', date: '2026-03-10',
    status: 'earned', color: '#7c3aed',
    icon: '🔍', cpd: 6,
    description: 'Certified competency in anti-money laundering procedures and KYC compliance.',
    requirements: null,
  },
  {
    id: 'cert05', title: 'Retirement Planning Expert',
    issuer: 'AAG Training Academy', date: null,
    status: 'locked', color: '#6b7280',
    icon: '🎯', cpd: 15,
    description: 'Expert-level certification in retirement income planning and CPF optimization.',
    requirements: 'Complete Advanced Retirement Planning module + score ≥80% on Retirement Quiz',
  },
  {
    id: 'cert06', title: 'Estate & Legacy Advisor',
    issuer: 'AAG Training Academy', date: null,
    status: 'locked', color: '#6b7280',
    icon: '🏛️', cpd: 18,
    description: 'Recognized expertise in estate planning, trusts, and legacy management.',
    requirements: 'Complete Estate Management Fundamentals + Legacy Planning for HNW modules',
  },
  {
    id: 'cert07', title: 'Investment Risk Specialist',
    issuer: 'AAG Training Academy', date: null,
    status: 'locked', color: '#6b7280',
    icon: '📊', cpd: 12,
    description: 'Certified expertise in investment risk management and portfolio construction.',
    requirements: 'Complete Investment Risk Management course + score ≥85% on Investment quiz',
  },
  {
    id: 'cert08', title: 'AAG Master Advisor',
    issuer: 'AAG Training Academy', date: null,
    status: 'locked', color: '#6b7280',
    icon: '👑', cpd: 40,
    description: 'The highest recognition for advisors who complete all AAG training modules.',
    requirements: 'Earn all other 7 certifications + complete 40 CPD hours',
  },
];

// ─── KNOWLEDGE BASE ARTICLES ───────────────────────────────────────────────────
export const KB_ARTICLES = [
  {
    id: 'kb01', type: 'article', title: 'How CPF LIFE Works',
    summary: 'CPF LIFE is a national annuity scheme that provides monthly payouts for life. Members are automatically enrolled when their RA reaches $60,000. Three plans: Basic, Standard, and Escalating.',
    tags: ['CPF', 'Retirement', 'Annuity'], category: 'Product',
  },
  {
    id: 'kb02', type: 'article', title: 'MAS Suitability Assessment Requirements',
    summary: 'Before recommending any investment product, advisors must conduct a suitability assessment covering: financial situation, investment objectives, risk tolerance, and investment horizon.',
    tags: ['MAS', 'Compliance', 'Suitability'], category: 'Regulatory',
  },
  {
    id: 'kb03', type: 'faq', title: 'Can clients use CPF for insurance premiums?',
    summary: 'Yes — MediShield Life premiums and approved Integrated Shield Plan basic premiums can be paid from MediSave. Life insurance premiums cannot be paid from CPF.',
    tags: ['CPF', 'Insurance', 'MediSave'], category: 'Product',
  },
  {
    id: 'kb04', type: 'article', title: 'Understanding the Trust Nomination Process',
    summary: 'A trust nomination under the Insurance Act (Sec 73) allows proceeds to be paid directly to nominees as beneficial owners, bypassing probate entirely. Revocable nominations require trustee consent to change.',
    tags: ['Estate', 'Trust', 'Nomination'], category: 'Technical',
  },
  {
    id: 'kb05', type: 'faq', title: 'What is the difference between HDB and private property CPF rules?',
    summary: 'HDB properties: CPF usage limited to purchase price (VL). Private properties: additional Withdrawal Limit (WL) = 120% of VL. Both require sufficient CPF for retirement above BRS before additional withdrawals.',
    tags: ['CPF', 'Property', 'HDB'], category: 'Product',
  },
  {
    id: 'kb06', type: 'article', title: 'SRS Withdrawal Strategy at Retirement',
    summary: 'To minimize tax at retirement: start withdrawing SRS from age 62. Only 50% of SRS withdrawals are taxable. Spreading withdrawals over 10 years from 62-72 can significantly reduce the tax burden.',
    tags: ['SRS', 'Retirement', 'Tax'], category: 'Technical',
  },
  {
    id: 'kb07', type: 'faq', title: 'What triggers a Suspicious Transaction Report (STR)?',
    summary: 'Red flags include: unusual cash transactions, inconsistent income/lifestyle, client reluctance to provide information, complex transactions with no clear economic purpose, and transactions involving high-risk jurisdictions.',
    tags: ['AML', 'STR', 'Compliance'], category: 'Regulatory',
  },
  {
    id: 'kb08', type: 'article', title: 'Keyman Insurance Valuation Methods',
    summary: 'Two main approaches: (1) Multiple of salary method — typically 5-10x annual salary/compensation. (2) Revenue/EBITDA method — key person\'s contribution to company revenue as a multiple. Both methods should be documented.',
    tags: ['Keyman', 'Business Insurance', 'Valuation'], category: 'Product',
  },
  {
    id: 'kb09', type: 'video_timestamp', title: 'MA Shielding Explained',
    summary: 'Video: Investment Risk Management at 25:00 — Step-by-step walkthrough of MA shielding mechanics, timing considerations, and approved investment instruments.',
    tags: ['CPF', 'MA', 'Strategy'], category: 'Product', videoId: 'c06', timestamp: '25:00',
  },
  {
    id: 'kb10', type: 'video_timestamp', title: 'Buy-Sell Agreement Funding Structure',
    summary: 'Video: Business Insurance Masterclass at 38:00 — Diagram walkthrough comparing entity-purchase vs cross-purchase structures with tax implications of each.',
    tags: ['Business Insurance', 'Buy-Sell', 'Structure'], category: 'Product', videoId: 'c05', timestamp: '38:00',
  },
  {
    id: 'kb11', type: 'faq', title: 'How do I calculate a client\'s life insurance needs?',
    summary: 'Use the DIME method: Debts (all outstanding liabilities), Income (years of replacement × annual income), Mortgage (outstanding balance), Education (children\'s future costs). Sum = minimum coverage needed.',
    tags: ['Life Insurance', 'FNA', 'Needs Analysis'], category: 'Technical',
  },
  {
    id: 'kb12', type: 'article', title: 'Critical Illness 37 Standard Definitions',
    summary: 'LIA Singapore standardized the 37 dread disease definitions across all insurers. Key conditions: major cancers (early stage vs advanced), heart attack with specific ECG changes, stroke with permanent neurological deficit.',
    tags: ['Critical Illness', 'Insurance', 'LIA'], category: 'Product',
  },
  {
    id: 'kb13', type: 'faq', title: 'What are the MAS licensing categories for financial advisers?',
    summary: 'Category 1: Full scope FA license (all products). Category 2: Restricted scope (specific products). Representatives are appointed persons under licensed FAs. Tied representatives work for one principal only.',
    tags: ['MAS', 'Licensing', 'Regulatory'], category: 'Regulatory',
  },
  {
    id: 'kb14', type: 'article', title: 'Dollar-Cost Averaging vs Lump Sum Investing',
    summary: 'Research shows lump sum investing outperforms DCA ~67% of the time over 12-month periods when markets trend upward. DCA reduces emotional impact and is preferred when client cannot commit full amount or is risk-averse.',
    tags: ['Investment', 'Strategy', 'DCA'], category: 'Technical',
  },
  {
    id: 'kb15', type: 'faq', title: 'Can a client nominate multiple beneficiaries for insurance?',
    summary: 'Yes — multiple nominees can be designated with specified percentage splits. If total does not equal 100%, equal distribution is assumed. Nominee and beneficiary are different — clarify which structure applies.',
    tags: ['Insurance', 'Nomination', 'Beneficiary'], category: 'Product',
  },
];
