// Mock data for AAG platform — used until real backend is wired up

export const mockMeetings = [
  { id: 'm1', time: '09:00', endTime: '09:45', client: 'John Tan', type: 'review', location: 'Office' },
  { id: 'm2', time: '11:00', endTime: '11:30', client: 'Sarah Lim', type: 'new', location: 'Video Call' },
  { id: 'm3', time: '14:00', endTime: '15:00', client: 'David Wong', type: 'followup', location: 'Client Office' },
  { id: 'm4', time: '16:30', endTime: '17:00', client: 'Emily Chen', type: 'review', location: 'Office' },
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
