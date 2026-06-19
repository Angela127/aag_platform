// Mock client data for the AAG Advisor Intelligence Platform
// 5 diverse client profiles with varied health scores, risk levels, and follow-up states

const clients = [
  {
    id: 1,
    name: 'Sarah Lim',
    age: 35,
    occupation: 'Engineer',
    healthScore: 82,
    riskLevel: 'Medium',
    lastContact: '15 May 2026',
    activePlans: 3,
    avatar: '',
    specialPreferences: {
      birthday: '12 March',
      notes: 'Prefers email over calls; vegetarian (mention if scheduling lunch meetings)',
    },
    familyDetails: 'Married, two children (ages 8 and 10)',
    plans: [
      { name: 'Life Insurance', premium: 'RM300/month', renewal: '20 Aug 2026', coverage: 'RM500,000' },
      { name: 'Investment Plan', premium: 'RM500/month', renewal: '15 Jan 2027', coverage: 'RM200,000' },
      { name: 'Education Fund', premium: 'RM200/month', renewal: '01 Mar 2027', coverage: 'RM100,000' },
    ],
    followUps: [
      { task: 'Review investment plan', date: '25 June 2026', priority: 'medium' },
      { task: 'Education fund annual review', date: '01 Aug 2026', priority: 'low' },
    ],
    expenses: [
      { type: 'Gift', description: 'Birthday hamper', amount: 'RM150', date: '12 March 2026' },
      { type: 'Entertainment', description: 'Lunch meeting', amount: 'RM80', date: '02 June 2026' },
    ],
    healthFactors: {
      recentContact: true,
      planComplete: true,
      renewalSoon: true,
      outstandingFollowUps: 1,
    },
  },
  {
    id: 2,
    name: 'Marcus Chen',
    age: 52,
    occupation: 'Business Owner',
    healthScore: 45,
    riskLevel: 'High',
    lastContact: '22 Feb 2026',
    activePlans: 1,
    avatar: '',
    specialPreferences: {
      birthday: '08 July',
      notes: 'Prefers face-to-face meetings; avoids phone calls during business hours',
    },
    familyDetails: 'Divorced, one adult child (age 24)',
    plans: [
      { name: 'Term Life Insurance', premium: 'RM800/month', renewal: '01 July 2026', coverage: 'RM1,000,000' },
    ],
    followUps: [
      { task: 'Insurance renewal reminder', date: '15 June 2026', priority: 'high' },
      { task: 'Schedule annual financial review', date: '01 July 2026', priority: 'high' },
      { task: 'Discuss retirement planning options', date: '15 July 2026', priority: 'medium' },
    ],
    expenses: [
      { type: 'Entertainment', description: 'Golf meeting', amount: 'RM250', date: '10 Jan 2026' },
      { type: 'Gift', description: 'CNY gift basket', amount: 'RM200', date: '29 Jan 2026' },
      { type: 'Meal', description: 'Dinner meeting (client + spouse)', amount: 'RM320', date: '14 Feb 2026' },
    ],
    healthFactors: {
      recentContact: false,
      planComplete: false,
      renewalSoon: true,
      outstandingFollowUps: 3,
    },
  },
  {
    id: 3,
    name: 'Priya Nair',
    age: 28,
    occupation: 'Software Developer',
    healthScore: 75,
    riskLevel: 'Low',
    lastContact: '01 June 2026',
    activePlans: 2,
    avatar: '',
    specialPreferences: {
      birthday: '21 November',
      notes: 'Tech-savvy; prefers WhatsApp and digital communication; interested in ESG investments',
    },
    familyDetails: 'Single, no dependents',
    plans: [
      { name: 'Medical Insurance', premium: 'RM180/month', renewal: '10 Oct 2026', coverage: 'RM300,000' },
      { name: 'Unit Trust (Growth)', premium: 'RM400/month', renewal: '01 Dec 2026', coverage: 'RM150,000' },
    ],
    followUps: [
      { task: 'Send investment report', date: '25 June 2026', priority: 'medium' },
      { task: 'Follow up on critical illness rider', date: '10 July 2026', priority: 'low' },
    ],
    expenses: [
      { type: 'Event', description: 'Tech conference ticket', amount: 'RM120', date: '15 April 2026' },
      { type: 'Gift', description: 'Welcome gift (onboarding)', amount: 'RM60', date: '01 Jan 2026' },
    ],
    healthFactors: {
      recentContact: true,
      planComplete: true,
      renewalSoon: false,
      outstandingFollowUps: 2,
    },
  },
  {
    id: 4,
    name: 'David Wong',
    age: 42,
    occupation: 'Surgeon',
    healthScore: 91,
    riskLevel: 'Medium',
    lastContact: '10 June 2026',
    activePlans: 4,
    avatar: '',
    specialPreferences: {
      birthday: '05 September',
      notes: 'Very busy schedule; only available on weekends; prefers concise briefings',
    },
    familyDetails: 'Married, three children (ages 5, 9, and 13)',
    plans: [
      { name: 'Whole Life Insurance', premium: 'RM1,200/month', renewal: '15 Nov 2026', coverage: 'RM2,000,000' },
      { name: 'Investment-Linked Plan', premium: 'RM800/month', renewal: '01 Feb 2027', coverage: 'RM500,000' },
      { name: 'Education Fund (Child 1)', premium: 'RM300/month', renewal: '01 Mar 2027', coverage: 'RM200,000' },
      { name: 'Education Fund (Child 2)', premium: 'RM300/month', renewal: '01 Mar 2027', coverage: 'RM200,000' },
    ],
    followUps: [
      { task: 'Quarterly portfolio review', date: '01 July 2026', priority: 'low' },
    ],
    expenses: [
      { type: 'Gift', description: 'Birthday wine', amount: 'RM180', date: '05 Sep 2025' },
      { type: 'Meal', description: 'Weekend brunch meeting', amount: 'RM95', date: '18 May 2026' },
      { type: 'Gift', description: 'Christmas hamper', amount: 'RM220', date: '20 Dec 2025' },
    ],
    healthFactors: {
      recentContact: true,
      planComplete: true,
      renewalSoon: false,
      outstandingFollowUps: 0,
    },
  },
  {
    id: 5,
    name: 'Aisha Rahman',
    age: 31,
    occupation: 'Marketing Director',
    healthScore: 38,
    riskLevel: 'High',
    lastContact: '20 Jan 2026',
    activePlans: 1,
    avatar: '',
    specialPreferences: {
      birthday: '14 February',
      notes: 'Prefers calls over email; interested in Shariah-compliant products; avoids pork-based meals',
    },
    familyDetails: 'Married, expecting first child',
    plans: [
      { name: 'Takaful Plan', premium: 'RM250/month', renewal: '01 Aug 2026', coverage: 'RM400,000' },
    ],
    followUps: [
      { task: 'Discuss maternity and child coverage', date: '01 June 2026', priority: 'high' },
      { task: 'Takaful plan renewal', date: '15 July 2026', priority: 'high' },
      { task: 'Review overall financial plan', date: '01 Aug 2026', priority: 'medium' },
      { task: 'Send Shariah-compliant investment brochure', date: '10 June 2026', priority: 'medium' },
    ],
    expenses: [
      { type: 'Gift', description: 'Hari Raya gift basket', amount: 'RM130', date: '30 March 2026' },
    ],
    healthFactors: {
      recentContact: false,
      planComplete: false,
      renewalSoon: true,
      outstandingFollowUps: 4,
    },
  },
];

export default clients;
