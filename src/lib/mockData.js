// Mock data for AAG platform — used until real backend is wired up

export const mockMeetings = [
  // 2026-06-20: 4 meetings (4 activities total)
  {
    id: 'm1',
    date: '2026-06-20',
    time: '09:00',
    endTime: '09:45',
    client: 'John Tan',
    type: 'review',
    location: 'Office',
    title: 'Portfolio Review & Rebalancing',
    duration: '45 min',
    attendees: 2,
    description: 'Review John Tan\'s investment portfolio performance and propose shifting 10% from bonds to high-yield equities.',
    tags: ['Portfolio', 'Rebalancing'],
    platform: 'Microsoft Teams',
    prepNotes: 'John is concerned about interest rate cuts. Highlight that ILPs are performing at an average of 8.2% and explain our asset allocation strategy.'
  },
  {
    id: 'm2',
    date: '2026-06-20',
    time: '11:00',
    endTime: '11:30',
    client: 'Sarah Lim',
    type: 'new',
    location: 'Video Call',
    title: 'Retirement Planning Consultation',
    duration: '30 min',
    attendees: 3,
    description: 'Initial consultation with Sarah Lim and spouse to outline retirement goals and evaluate cash flows.',
    tags: ['Consultation', 'Retirement'],
    platform: 'Google Meet',
    prepNotes: 'Sarah is looking to retire early at age 50. Prepare the retirement calculator sheet and annuity plan options.'
  },
  {
    id: 'm3',
    date: '2026-06-20',
    time: '14:00',
    endTime: '15:00',
    client: 'David Wong',
    type: 'followup',
    location: 'Client Office',
    title: 'ILP Application Sign-off',
    duration: '60 min',
    attendees: 2,
    description: 'Discuss outstanding declarations and sign the physical policy documents with David Wong.',
    tags: ['Sign-off', 'Prudential'],
    platform: 'Client Office',
    prepNotes: 'Ensure you bring the hardcopy Prudential ILP application booklets and check David\'s medical declarations list.'
  },
  {
    id: 'm4',
    date: '2026-06-20',
    time: '16:30',
    endTime: '17:00',
    client: 'Emily Chen',
    type: 'review',
    location: 'Office',
    title: 'Annual Policy Health Check',
    duration: '30 min',
    attendees: 2,
    description: 'Emily Chen\'s annual review of life policies to ensure coverage amounts still align with family needs.',
    tags: ['Review', 'Annual'],
    platform: 'Phone Call',
    prepNotes: 'Verify if Emily has had any changes in income or health. Offer conversion quotes for her expiring term life policy.'
  },

  // 2026-06-21: 1 meeting (+1 kanban = 2 activities total)
  {
    id: 'm5',
    date: '2026-06-21',
    time: '10:00',
    endTime: '11:00',
    client: 'David Wong',
    type: 'followup',
    location: 'Office',
    title: 'Medical Takaful Consultation',
    duration: '60 min',
    attendees: 2,
    description: 'Discuss supplementary medical coverage and riders with David Wong.',
    tags: ['Consultation', 'Medical'],
    platform: 'Office',
    prepNotes: 'David is looking to expand medical coverage for his children. Prepare riders packages.'
  },

  // 2026-06-24: 2 meetings (+1 kanban = 3 activities total)
  {
    id: 'm6',
    date: '2026-06-24',
    time: '13:00',
    endTime: '14:00',
    client: 'Sarah Lim',
    type: 'new',
    location: 'Coffee Shop',
    title: 'Education Fund Discussion',
    duration: '60 min',
    attendees: 3,
    description: 'Evaluate options for education savings plans for Sarah\'s two children.',
    tags: ['Education', 'Savings'],
    platform: 'Coffee Shop',
    prepNotes: 'Sarah\'s children are ages 8 and 10. Recommend endowment savings schemes.'
  },
  {
    id: 'm7',
    date: '2026-06-24',
    time: '15:00',
    endTime: '15:30',
    client: 'John Tan',
    type: 'review',
    location: 'Phone Call',
    title: 'Critical Illness Plan Review',
    duration: '30 min',
    attendees: 2,
    description: 'Quick phone call to discuss additional critical illness coverage.',
    tags: ['CI Plan', 'Review'],
    platform: 'Phone Call',
    prepNotes: 'Review John\'s existing critical illness coverage. Suggest adding the multi-claim CI rider.'
  },

  // 2026-06-25: 2 meetings (2 activities total)
  {
    id: 'm8',
    date: '2026-06-25',
    time: '09:00',
    endTime: '10:00',
    client: 'Emily Chen',
    type: 'review',
    location: 'Office',
    title: 'Mortgage Coverage Briefing',
    duration: '60 min',
    attendees: 2,
    description: 'Explain mortgage reducing term assurance (MRTA) options for Emily\'s new property.',
    tags: ['Mortgage', 'Property'],
    platform: 'Office',
    prepNotes: 'Check the loan amount and duration of Emily\'s new property. Prepare MRTA quotes.'
  },
  {
    id: 'm9',
    date: '2026-06-25',
    time: '14:00',
    endTime: '15:00',
    client: 'Michael Koh',
    type: 'followup',
    location: 'Video Call',
    title: 'Investment Fund Update',
    duration: '60 min',
    attendees: 2,
    description: 'Review performance of current unit trust portfolio and suggest new ESG options.',
    tags: ['Unit Trust', 'ESG'],
    platform: 'Google Meet',
    prepNotes: 'Michael is interested in sustainability. Prepare brochures for Shariah-compliant ESG funds.'
  },

  // 2026-06-26: 1 meeting (1 activity total)
  {
    id: 'm10',
    date: '2026-06-26',
    time: '11:30',
    endTime: '12:30',
    client: 'Alice Ng',
    type: 'new',
    location: 'Office',
    title: 'Onboarding Consultation',
    duration: '60 min',
    attendees: 2,
    description: 'Welcome Alice Ng as a new client and configure her online portal login.',
    tags: ['Onboarding', 'Portal'],
    platform: 'Office',
    prepNotes: 'Verify Alice\'s identification documents. Handover AAG platform welcome pack.'
  },

  // 2026-06-27: 2 meetings (2 activities total)
  {
    id: 'm11',
    date: '2026-06-27',
    time: '10:00',
    endTime: '11:00',
    client: 'Ben Seah',
    type: 'review',
    location: 'Office',
    title: 'Claim Documentation Review',
    duration: '60 min',
    attendees: 2,
    description: 'Assist Ben with outstanding claims documents and hospital bills.',
    tags: ['Claim', 'Admin'],
    platform: 'Office',
    prepNotes: 'Check that all original medical receipts are signed. Review hospital discharge reports.'
  },
  {
    id: 'm12',
    date: '2026-06-27',
    time: '16:00',
    endTime: '17:00',
    client: 'John Tan',
    type: 'followup',
    location: 'Office',
    title: 'Follow-up Strategy Session',
    duration: '60 min',
    attendees: 2,
    description: 'Wrap-up session to finalize John\'s comprehensive financial plan.',
    tags: ['Strategy', 'Planning'],
    platform: 'Office',
    prepNotes: 'Walk John through the completed 10-page financial plan document. Answer final questions.'
  },
];

export const mockReminders = [
  {
    id: 'r1',
    urgency: 'critical',
    type: 'insurance',
    client: 'John Tan',
    message: "Insurance policy expires in 14 days",
    days: 14,
    action: 'Call',
  },
  {
    id: 'r2',
    urgency: 'high',
    type: 'contact',
    client: 'Sarah Lim',
    message: "Not contacted in 45 days",
    days: 45,
    action: 'Email',
  },
  {
    id: 'r3',
    urgency: 'high',
    type: 'followup',
    client: 'David Wong',
    message: "Follow-up overdue by 2 weeks",
    days: 14,
    action: 'View',
  },
  {
    id: 'r4',
    urgency: 'medium',
    type: 'review',
    client: 'Emily Chen',
    message: "Annual review due in 30 days",
    days: 30,
    action: 'Schedule',
  },
  {
    id: 'r5',
    urgency: 'medium',
    type: 'birthday',
    client: 'Michael Koh',
    message: "Birthday in 5 days — send wishes",
    days: 5,
    action: 'Email',
  },
];

export const mockKPIs = {
  totalClients: 127,
  activeFollowups: 23,
  cpdProgress: { done: 28, total: 45 },
  partnerReferrals: 9,
};

export const mockKanban = {
  todo: [
    { id: 'k1', client: 'John Tan', task: 'Prepare portfolio review slides', dueDate: '2026-06-22', priority: 'high' },
    { id: 'k2', client: 'Sarah Lim', task: 'Send revised proposal document', dueDate: '2026-06-24', priority: 'medium' },
    { id: 'k3', client: 'Emily Chen', task: 'Schedule annual review appointment', dueDate: '2026-06-28', priority: 'low' },
  ],
  inprogress: [
    { id: 'k4', client: 'David Wong', task: 'Process new insurance application', dueDate: '2026-06-21', priority: 'high' },
    { id: 'k5', client: 'Michael Koh', task: 'Research investment fund options', dueDate: '2026-06-23', priority: 'medium' },
  ],
  done: [
    { id: 'k6', client: 'Alice Ng', task: 'Completed onboarding forms', dueDate: '2026-06-18', priority: 'low' },
    { id: 'k7', client: 'Ben Seah', task: 'Submitted claim documentation', dueDate: '2026-06-17', priority: 'medium' },
  ],
};

export const mockTopPartner = {
  name: 'Prudential Singapore',
  category: 'Life Insurance',
  recommendation: 'High-performing ILP with 8.2% avg returns. Strong fit for clients aged 30–45.',
  commission: '4.5%',
  logo: null,
};

export const mockCPD = { done: 28, total: 45, cycle: 'Jan–Dec 2026' };

export const calendarEvents = {
  '2026-06-20': 4,
  '2026-06-21': 2,
  '2026-06-22': 1,
  '2026-06-24': 3,
  '2026-06-25': 2,
  '2026-06-26': 1,
  '2026-06-27': 2,
};

export const mockPipeline = {
  lead: [
    { id: 'p1', name: 'John Tan', age: 40, interest: 'Retirement Planning', stage: 'lead', lastContact: '2026-06-15', nextAction: '2026-06-22' },
    { id: 'p2', name: 'Emily Chen', age: 31, interest: 'Risk Protection', stage: 'lead', lastContact: '2026-06-18', nextAction: '2026-06-25' },
  ],
  qualified: [
    { id: 'p3', name: 'Sarah Lim', age: 35, interest: 'Wealth Accumulation', stage: 'qualified', lastContact: '2026-06-12', nextAction: '2026-06-24' },
    { id: 'p4', name: 'Michael Koh', age: 45, interest: 'Retirement Planning', stage: 'qualified', lastContact: '2026-06-10', nextAction: '2026-06-23' },
  ],
  scheduled: [
    { id: 'p5', name: 'David Wong', age: 42, interest: 'Estate Planning', stage: 'scheduled', lastContact: '2026-06-20', nextAction: '2026-06-21' },
  ],
  proposal: [
    { id: 'p6', name: 'Marcus Chen', age: 52, interest: 'Risk Protection', stage: 'proposal', lastContact: '2026-06-08', nextAction: '2026-06-22' },
  ],
  closed: [
    { id: 'p7', name: 'Alice Ng', age: 29, interest: 'Wealth Accumulation', stage: 'closed', lastContact: '2026-06-18', nextAction: 'None' },
    { id: 'p8', name: 'Ben Seah', age: 38, interest: 'Estate Planning', stage: 'closed', lastContact: '2026-06-17', nextAction: 'None' },
  ]
};

export const mockPartners = [
  { id: 'pr1', name: 'Allianz Malaysia', category: 'Insurance Provider', referrals: 15, activeCases: 4, responseTime: '1.5 days', rating: 4.8 },
  { id: 'pr2', name: 'AIA Singapore', category: 'Insurance Provider', referrals: 22, activeCases: 6, responseTime: '2.0 days', rating: 4.6 },
  { id: 'pr3', name: 'Areca Capital', category: 'Investment Partner', referrals: 18, activeCases: 3, responseTime: '1.0 days', rating: 4.7 },
  { id: 'pr4', name: 'Bailiff & Co. Legal', category: 'Estate Planning Lawyer', referrals: 8, activeCases: 2, responseTime: '3.0 days', rating: 4.9 },
  { id: 'pr5', name: 'Speedy Mortgage Advisors', category: 'Mortgage Consultant', referrals: 12, activeCases: 5, responseTime: '1.2 days', rating: 4.5 },
];

export const mockReferrals = [
  { id: 'ref1', client: 'John Tan', partner: 'Allianz Malaysia', service: 'Medical Coverage', status: 'Approved', date: '2026-06-12' },
  { id: 'ref2', client: 'Sarah Lim', partner: 'Bailiff & Co. Legal', service: 'Will Drafting', status: 'In Progress', date: '2026-06-15' },
  { id: 'ref3', client: 'David Wong', partner: 'Areca Capital', service: 'Retirement Portfolio', status: 'Completed', date: '2026-06-10' },
  { id: 'ref4', client: 'Emily Chen', partner: 'Speedy Mortgage Advisors', service: 'Property Loan Refinance', status: 'Awaiting Documents', date: '2026-06-18' },
  { id: 'ref5', client: 'Michael Koh', partner: 'AIA Singapore', service: 'Critical Illness Rider', status: 'Pending', date: '2026-06-19' },
];

export const mockPartnerActivity = [
  { id: 'pa1', referralId: 'ref2', time: '10:30 AM', date: '2026-06-15', text: 'Referral submitted for Sarah Lim to Bailiff & Co. Legal.' },
  { id: 'pa2', referralId: 'ref2', time: '02:15 PM', date: '2026-06-15', text: 'Partner accepted case (Bailiff & Co. Legal).' },
  { id: 'pa3', referralId: 'ref4', time: '09:00 AM', date: '2026-06-19', text: 'Documents requested: Income statement and property valuation for Emily Chen.' },
  { id: 'pa4', referralId: 'ref3', time: '04:30 PM', date: '2026-06-19', text: 'Service completed: David Wong\'s retirement portfolio is active.' },
];
