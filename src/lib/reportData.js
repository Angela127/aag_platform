// ─── AAG Advisor Performance Intelligence Report — Mock Data ───────────────

// ── Monthly Revenue (last 12 months) ──────────────────────────────────────
export const monthlyRevenue = [
  { month: 'Jul 25', revenue: 28400, prev: 24200, clients: 112, newClients: 6, lostClients: 1, aum: 8.1 },
  { month: 'Aug 25', revenue: 31200, prev: 28400, clients: 115, newClients: 5, lostClients: 2, aum: 8.4 },
  { month: 'Sep 25', revenue: 29800, prev: 31200, clients: 117, newClients: 4, lostClients: 2, aum: 8.2 },
  { month: 'Oct 25', revenue: 34100, prev: 29800, clients: 119, newClients: 4, lostClients: 2, aum: 8.7 },
  { month: 'Nov 25', revenue: 32600, prev: 34100, clients: 120, newClients: 3, lostClients: 2, aum: 8.5 },
  { month: 'Dec 25', revenue: 38900, prev: 32600, clients: 122, newClients: 4, lostClients: 2, aum: 9.1 },
  { month: 'Jan 26', revenue: 30100, prev: 38900, clients: 119, newClients: 3, lostClients: 6, aum: 8.8 },
  { month: 'Feb 26', revenue: 33700, prev: 30100, clients: 121, newClients: 4, lostClients: 2, aum: 9.0 },
  { month: 'Mar 26', revenue: 42300, prev: 33700, clients: 124, newClients: 5, lostClients: 2, aum: 9.6 },
  { month: 'Apr 26', revenue: 39800, prev: 42300, clients: 125, newClients: 3, lostClients: 2, aum: 9.4 },
  { month: 'May 26', revenue: 44100, prev: 39800, clients: 126, newClients: 3, lostClients: 2, aum: 9.8 },
  { month: 'Jun 26', revenue: 52100, prev: 44100, clients: 127, newClients: 4, lostClients: 3, aum: 10.6 },
];

// ── Quarterly Revenue ──────────────────────────────────────────────────────
export const quarterlyRevenue = [
  { quarter: 'Q3 25', revenue: 89400, prev: 78200 },
  { quarter: 'Q4 25', revenue: 105600, prev: 89400 },
  { quarter: 'Q1 26', revenue: 106100, prev: 105600 },
  { quarter: 'Q2 26', revenue: 136000, prev: 106100 },
];

// ── Yearly Revenue ─────────────────────────────────────────────────────────
export const yearlyRevenue = [
  { year: '2022', revenue: 248000 },
  { year: '2023', revenue: 312000 },
  { year: '2024', revenue: 378000 },
  { year: '2025', revenue: 421000 },
  { year: '2026 (YTD)', revenue: 242100 },
];

// ── Product Sales by Category ──────────────────────────────────────────────
export const productSales = {
  monthly: [
    { product: 'Retirement Planning', sales: 18, revenue: 22400, growth: 31 },
    { product: 'Wealth Management', sales: 12, revenue: 18600, growth: 23 },
    { product: 'Life Insurance', sales: 9, revenue: 8200, growth: 5 },
    { product: 'Education Fund', sales: 7, revenue: 6800, growth: 12 },
    { product: 'Medical / CI', sales: 11, revenue: 7400, growth: -3 },
    { product: 'Estate Planning', sales: 4, revenue: 5300, growth: 18 },
  ],
  yearly: [
    { product: 'Retirement Planning', sales: 142, revenue: 168000, growth: 28 },
    { product: 'Wealth Management', sales: 98, revenue: 143000, growth: 19 },
    { product: 'Life Insurance', sales: 87, revenue: 72000, growth: 4 },
    { product: 'Education Fund', sales: 54, revenue: 52000, growth: 11 },
    { product: 'Medical / CI', sales: 112, revenue: 64000, growth: -2 },
    { product: 'Estate Planning', sales: 33, revenue: 41000, growth: 22 },
  ],
};

// ── KPI Summary ─────────────────────────────────────────────────────────────
export const kpiData = {
  monthly: {
    totalRevenue:   { current: 52100, prev: 44100, label: 'Total Revenue', prefix: 'RM', suffix: '' },
    aum:            { current: 10.6,  prev: 9.8,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
    activeClients:  { current: 127,   prev: 124,   label: 'Active Clients', prefix: '', suffix: '' },
    policiesSold:   { current: 61,    prev: 54,    label: 'Policies Sold',  prefix: '', suffix: '' },
  },
  yearly: {
    totalRevenue:   { current: 421000, prev: 378000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
    aum:            { current: 10.6,   prev: 8.8,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
    activeClients:  { current: 127,    prev: 110,   label: 'Active Clients', prefix: '', suffix: '' },
    policiesSold:   { current: 526,    prev: 448,   label: 'Policies Sold',  prefix: '', suffix: '' },
  },
};

// ── Opportunity Radar ────────────────────────────────────────────────────────
export const opportunityClients = [
  {
    id: 'op1',
    name: 'John Tan',
    age: 40,
    income: 'RM 12,000/mo',
    lifeStage: 'Pre-Retirement',
    existingProducts: ['Life Insurance', 'CI Plan'],
    suggestedProduct: 'Retirement Plan',
    opportunityScore: 95,
    revenuePotential: 'RM 18,400',
    urgency: 'high',
    reason: 'Age 40, no retirement plan, high income with surplus cash flow.',
    followUp: 'Schedule retirement needs analysis meeting',
  },
  {
    id: 'op2',
    name: 'Sarah Lim',
    age: 35,
    income: 'RM 8,500/mo',
    lifeStage: 'Young Family',
    existingProducts: ['Life Insurance'],
    suggestedProduct: 'Education Fund',
    opportunityScore: 88,
    revenuePotential: 'RM 9,200',
    urgency: 'high',
    reason: 'Two school-age children (8 & 10), no education savings plan.',
    followUp: 'Prepare education fund illustration and present options',
  },
  {
    id: 'op3',
    name: 'Michael Koh',
    age: 45,
    income: 'RM 18,000/mo',
    lifeStage: 'Wealth Accumulation',
    existingProducts: ['Retirement Plan', 'CI Plan', 'Life Insurance'],
    suggestedProduct: 'Wealth Management',
    opportunityScore: 82,
    revenuePotential: 'RM 24,600',
    urgency: 'medium',
    reason: 'High net worth, diversification gap in equity portfolio.',
    followUp: 'Present premium wealth management ILP options',
  },
  {
    id: 'op4',
    name: 'Emily Chen',
    age: 31,
    income: 'RM 7,200/mo',
    lifeStage: 'Early Career',
    existingProducts: ['Medical Plan'],
    suggestedProduct: 'Life Insurance',
    opportunityScore: 78,
    revenuePotential: 'RM 5,800',
    urgency: 'medium',
    reason: 'Young professional with no life cover. New property purchase.',
    followUp: 'Propose MRTA bundled with life insurance',
  },
  {
    id: 'op5',
    name: 'David Wong',
    age: 42,
    income: 'RM 14,000/mo',
    lifeStage: 'Estate Planning',
    existingProducts: ['Life Insurance', 'Retirement Plan', 'CI Plan'],
    suggestedProduct: 'Estate Planning',
    opportunityScore: 71,
    revenuePotential: 'RM 7,400',
    urgency: 'low',
    reason: 'High asset value with no will or trust structure in place.',
    followUp: 'Refer to estate planning specialist and co-advise',
  },
  {
    id: 'op6',
    name: 'Alice Ng',
    age: 29,
    income: 'RM 5,800/mo',
    lifeStage: 'Early Career',
    existingProducts: ['Medical Plan', 'CI Plan'],
    suggestedProduct: 'Savings Plan',
    opportunityScore: 65,
    revenuePotential: 'RM 3,600',
    urgency: 'low',
    reason: 'No savings or investment plan. Early stage to build wealth habit.',
    followUp: 'Introduce endowment savings with low entry premium',
  },
];

// ── Client Health Monitor ────────────────────────────────────────────────────
export const clientHealth = [
  {
    id: 'ch1',
    name: 'John Tan',
    lastContact: '2026-06-15',
    lastMeeting: '2026-06-20',
    engagementScore: 88,
    churnRisk: 12,
    communicationFreq: 'Weekly',
    status: 'healthy',
    policies: 3,
    aum: 'RM 285,000',
    notes: 'Highly engaged, frequent touchpoints.',
  },
  {
    id: 'ch2',
    name: 'Sarah Lim',
    lastContact: '2026-06-12',
    lastMeeting: '2026-06-12',
    engagementScore: 74,
    churnRisk: 28,
    communicationFreq: 'Bi-weekly',
    status: 'healthy',
    policies: 2,
    aum: 'RM 142,000',
    notes: 'Active but education needs more focus.',
  },
  {
    id: 'ch3',
    name: 'David Wong',
    lastContact: '2026-06-20',
    lastMeeting: '2026-06-20',
    engagementScore: 91,
    churnRisk: 8,
    communicationFreq: 'Weekly',
    status: 'healthy',
    policies: 4,
    aum: 'RM 410,000',
    notes: 'Top client, excellent relationship.',
  },
  {
    id: 'ch4',
    name: 'Emily Chen',
    lastContact: '2026-05-28',
    lastMeeting: '2026-05-25',
    engagementScore: 52,
    churnRisk: 55,
    communicationFreq: 'Monthly',
    status: 'attention',
    policies: 1,
    aum: 'RM 68,000',
    notes: 'Declining contact frequency over last 2 months.',
  },
  {
    id: 'ch5',
    name: 'Michael Koh',
    lastContact: '2026-05-10',
    lastMeeting: '2026-05-10',
    engagementScore: 38,
    churnRisk: 72,
    communicationFreq: 'Infrequent',
    status: 'risk',
    policies: 3,
    aum: 'RM 520,000',
    notes: 'High-value client, no contact in 41 days. Urgent follow-up.',
  },
  {
    id: 'ch6',
    name: 'Alice Ng',
    lastContact: '2026-06-18',
    lastMeeting: '2026-06-18',
    engagementScore: 79,
    churnRisk: 18,
    communicationFreq: 'Bi-weekly',
    status: 'healthy',
    policies: 2,
    aum: 'RM 82,000',
    notes: 'New client, onboarding smooth.',
  },
  {
    id: 'ch7',
    name: 'Ben Seah',
    lastContact: '2026-04-30',
    lastMeeting: '2026-04-28',
    engagementScore: 24,
    churnRisk: 88,
    communicationFreq: 'Rare',
    status: 'risk',
    policies: 2,
    aum: 'RM 195,000',
    notes: 'No contact for 51 days. High churn risk.',
  },
  {
    id: 'ch8',
    name: 'Marcus Chen',
    lastContact: '2026-06-08',
    lastMeeting: '2026-06-01',
    engagementScore: 61,
    churnRisk: 42,
    communicationFreq: 'Monthly',
    status: 'attention',
    policies: 1,
    aum: 'RM 155,000',
    notes: 'Proposal stage stalled. Needs push.',
  },
];

// ── Team Benchmarking ──────────────────────────────────────────────────────
export const benchmarkData = {
  metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
  you:          [52100, 68, 94, 18, 4],
  teamAvg:      [38400, 54, 88, 12, 3],
  branchAvg:    [43200, 58, 90, 14, 3.5],
  topPerformer: [78600, 82, 97, 26, 8],
  units:        ['', '%', '%', '%', ''],
  ranking:      8,
  totalAdvisors: 34,
  percentile:   77,
  performanceScore: 84,
};

// ── Network Graph ─────────────────────────────────────────────────────────
export const networkNodes = [
  { id: 'advisor', type: 'advisor', label: 'You', x: 400, y: 300, size: 36, color: '#870105' },
  // Clients
  { id: 'john',    type: 'client',  label: 'John Tan',    x: 220, y: 160, size: 24, color: '#1e40af', referrals: 3, revenue: 'RM 285,000', product: 'Retirement' },
  { id: 'sarah',   type: 'client',  label: 'Sarah Lim',   x: 540, y: 120, size: 28, color: '#065f46', referrals: 8, revenue: 'RM 142,000', product: 'Education' },
  { id: 'david',   type: 'client',  label: 'David Wong',  x: 680, y: 240, size: 26, color: '#5b21b6', referrals: 4, revenue: 'RM 410,000', product: 'Estate Planning' },
  { id: 'emily',   type: 'client',  label: 'Emily Chen',  x: 620, y: 420, size: 18, color: '#9d174d', referrals: 1, revenue: 'RM 68,000',  product: 'Life Insurance' },
  { id: 'michael', type: 'client',  label: 'Michael Koh', x: 200, y: 400, size: 30, color: '#b45309', referrals: 5, revenue: 'RM 520,000', product: 'Wealth Mgmt' },
  { id: 'alice',   type: 'client',  label: 'Alice Ng',    x: 130, y: 280, size: 16, color: '#0e7490', referrals: 2, revenue: 'RM 82,000',  product: 'Savings' },
  // Leads (referred by clients)
  { id: 'lead1',   type: 'lead',    label: 'James Tan',   x: 80,  y: 140, size: 14, color: '#6b7280', referredBy: 'John Tan' },
  { id: 'lead2',   type: 'lead',    label: 'Rachel Lim',  x: 460, y: 60,  size: 14, color: '#6b7280', referredBy: 'Sarah Lim' },
  { id: 'lead3',   type: 'lead',    label: 'Tom Koh',     x: 750, y: 160, size: 14, color: '#6b7280', referredBy: 'Michael Koh' },
  { id: 'lead4',   type: 'lead',    label: 'Lisa Wong',   x: 760, y: 360, size: 14, color: '#6b7280', referredBy: 'David Wong' },
  { id: 'lead5',   type: 'lead',    label: 'Nina Lim',    x: 370, y: 60,  size: 14, color: '#6b7280', referredBy: 'Sarah Lim' },
];

export const networkEdges = [
  { from: 'advisor', to: 'john',    strength: 3, type: 'client' },
  { from: 'advisor', to: 'sarah',   strength: 4, type: 'client' },
  { from: 'advisor', to: 'david',   strength: 4, type: 'client' },
  { from: 'advisor', to: 'emily',   strength: 2, type: 'client' },
  { from: 'advisor', to: 'michael', strength: 5, type: 'client' },
  { from: 'advisor', to: 'alice',   strength: 2, type: 'client' },
  { from: 'john',    to: 'lead1',   strength: 2, type: 'referral' },
  { from: 'sarah',   to: 'lead2',   strength: 3, type: 'referral' },
  { from: 'sarah',   to: 'lead5',   strength: 2, type: 'referral' },
  { from: 'michael', to: 'lead3',   strength: 2, type: 'referral' },
  { from: 'david',   to: 'lead4',   strength: 2, type: 'referral' },
];

// ── AI Summary Templates ─────────────────────────────────────────────────────
export const aiSummaryData = {
  monthly: {
    headline: 'Strong momentum with 18.1% revenue growth. Retirement planning drives most of your revenue. 2 high-value clients need urgent re-engagement.',
    achievements: [
      'Revenue grew 18.1% MoM from RM 44,100 → RM 52,100 in June 2026.',
      'AUM crossed the RM 10M milestone for the first time — a 8.2% increase.',
      'Client retention rate holds at an excellent 94%, well above branch average of 90%.',
      '4 new clients successfully onboarded this month.',
    ],
    concerns: [
      'Michael Koh (RM 520K AUM) has had no contact for 41 days — high churn risk.',
      'Ben Seah (RM 195K AUM) — 51 days without contact. Immediate follow-up needed.',
      'Cross-selling conversion remains below branch average at 68% vs 74%.',
      'Medical/CI product sales declined 3% — review product positioning.',
    ],
    nextActions: [
      'Contact Michael Koh and Ben Seah this week — risk of losing RM 715K AUM.',
      'Schedule retirement planning review for John Tan — RM 18,400 revenue potential.',
      'Prepare education fund proposal for Sarah Lim — family with 2 school-age children.',
      'Attend cross-selling masterclass to improve conversion rate.',
    ],
  },
  yearly: {
    headline: 'Record-breaking year with 11.4% revenue growth. AUM expanded 20.5%. Retirement planning is your strongest product line.',
    achievements: [
      'Annual revenue grew 11.4% YoY from RM 378,000 → RM 421,000.',
      'Active client base grew from 110 to 127 clients (+15.5%).',
      'AUM grew 20.5% from RM 8.8M → RM 10.6M.',
      'Retirement planning policies up 28% — strongest product line.',
    ],
    concerns: [
      '6 clients churned in January — review exit reasons for January dip.',
      'Medical/CI product sales declined 2% despite market demand.',
      'Estate planning remains underutilized — only 33 policies across year.',
      'Cross-selling ratio at 68% — 6 points below branch average.',
    ],
    nextActions: [
      'Build a systematic check-in cadence to prevent January-style churn spikes.',
      'Partner with estate planning specialists to capture underserved segment.',
      'Review and refresh Medical/CI product messaging to client base.',
      'Target top 10 wealth clients for premium wealth management upgrades.',
    ],
  },
};
