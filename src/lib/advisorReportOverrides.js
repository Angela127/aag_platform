// ─── Advisor Report Mock Overrides ──────────────────────────────────────────

export const ADVISOR_REPORT_OVERRIDES = {
  'adv-ameliawong': {
    name: 'Amelia Wong',
    designation: 'Senior Risk Advisor',
    kpiData: {
      monthly: {
        totalRevenue:   { current: 68200, prev: 59100, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 12.4,  prev: 11.2,  label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 51,    prev: 49,    label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 78,    prev: 72,    label: 'Policies Sold',  prefix: '', suffix: '' },
      },
      yearly: {
        totalRevenue:   { current: 540000, prev: 490000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 12.4,   prev: 9.8,    label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 51,     prev: 40,     label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 680,    prev: 590,    label: 'Policies Sold',  prefix: '', suffix: '' },
      }
    },
    aiSummaryData: {
      monthly: {
        headline: 'Amelia leads the team in risk mitigation cases this month. Excellent cross-selling ratio, but high-value client churn risk detected in Q2.',
        achievements: [
          'Closed the prestigious Chen family insurance portfolio (RM 1.2M coverage).',
          'Risk mitigation cross-sell ratio is at 82% (highest in branch).',
          'Client retention rate stands strong at 96%, outperforming peers.',
          'Added 2 high-net-worth clients into risk management pipeline.'
        ],
        concerns: [
          'Robert Goh (RM 380K AUM) hasn\'t had contact in 42 days — high churn risk.',
          'CPD hours progress is lagging behind the monthly target of 4 hours.',
          'Slight decline in active referral generation compared to Q1.'
        ],
        nextActions: [
          'Schedule high-net-worth re-engagement with Robert Goh this week.',
          'Complete mandatory MAS CPD module before month end.',
          'Touch base with existing clients to re-stimulate referral pipeline.'
        ]
      },
      yearly: {
        headline: 'A phenomenal year for risk advisor segment. Managed assets expanded 26.5% and revenue hit RM 540,000.',
        achievements: [
          'Annual revenue grew 10.2% YoY from RM 490,000 → RM 540,000.',
          'Maintained high retention rate of 96% over the past 12 months.',
          'Successfully onboarded 11 major risk coverage accounts.'
        ],
        concerns: [
          'January retention dip affected average metrics slightly.',
          'High concentration of commission in top 5 policies.'
        ],
        nextActions: [
          'Develop custom risk protection newsletters to warm dormant contacts.',
          'Formulate premium protection packages for mass affluent segments.'
        ]
      }
    },
    benchmarkData: {
      metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
      you:          [68200, 82, 96, 22, 6],
      teamAvg:      [38400, 54, 88, 12, 3],
      branchAvg:    [43200, 58, 90, 14, 3.5],
      topPerformer: [78600, 82, 97, 26, 8],
      units:        ['', '%', '%', '%', ''],
      ranking:      3,
      totalAdvisors: 34,
      percentile:   91,
      performanceScore: 92,
    }
  },
  'adv-rajkumar': {
    name: 'Raj Kumar',
    designation: 'Senior Wealth Advisor',
    kpiData: {
      monthly: {
        totalRevenue:   { current: 82500, prev: 71000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 15.2,  prev: 13.8,  label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 42,    prev: 40,    label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 45,    prev: 41,    label: 'Policies Sold',  prefix: '', suffix: '' },
      },
      yearly: {
        totalRevenue:   { current: 680000, prev: 610000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 15.2,   prev: 12.1,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 42,     prev: 35,     label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 410,    prev: 380,    label: 'Policies Sold',  prefix: '', suffix: '' },
      }
    },
    aiSummaryData: {
      monthly: {
        headline: 'Raj achieved outstanding AUM growth of 28% this month, driven by equity ILP investments. Wealth management segment performance is optimal.',
        achievements: [
          'Secured 3 high-value corporate investment clients (total RM 2.5M).',
          'Average investment ticket size increased by 40% MoM.',
          'AUM grew RM 3.1M in the last 30 days.'
        ],
        concerns: [
          'Lower overall policy count compared to peers — focused heavily on wealth.',
          'Client onboarding turnaround time averaged 5 days vs target of 3.',
          'CI insurance attachment rate in wealth packages is below 15%.'
        ],
        nextActions: [
          'Conduct reviews with top 5 equity clients regarding market rebalancing.',
          'Streamline admin documentation workflow to reduce onboarding time.',
          'Incorporate CI riders into investment pitches for holistic protection.'
        ]
      },
      yearly: {
        headline: 'Strongest AUM growth performer in the entire branch, expanding wealth portfolio by 25%.',
        achievements: [
          'Annual revenue grew 11.47% YoY from RM 610,000 → RM 680,000.',
          'Overall AUM increased from RM 12.1M → RM 15.2M.'
        ],
        concerns: [
          'High concentration of asset base in top 10% HNW clients.',
          'Insurance products commission represents less than 10% of portfolio.'
        ],
        nextActions: [
          'Diversify client portfolio to mitigate macro economic downturn risks.',
          'Implement automated compliance tracking to prevent document delays.'
        ]
      }
    },
    benchmarkData: {
      metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
      you:          [82500, 72, 91, 28, 5],
      teamAvg:      [38400, 54, 88, 12, 3],
      branchAvg:    [43200, 58, 90, 14, 3.5],
      topPerformer: [82500, 82, 97, 28, 8], // Make Raj top performer in some areas
      units:        ['', '%', '%', '%', ''],
      ranking:      2,
      totalAdvisors: 34,
      percentile:   94,
      performanceScore: 94,
    }
  },
  'adv-priyanair': {
    name: 'Priya Nair',
    designation: 'Estate Planning Specialist',
    kpiData: {
      monthly: {
        totalRevenue:   { current: 45100, prev: 42000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 8.5,   prev: 8.2,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 38,    prev: 37,    label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 32,    prev: 30,    label: 'Policies Sold',  prefix: '', suffix: '' },
      },
      yearly: {
        totalRevenue:   { current: 390000, prev: 360000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 8.5,    prev: 7.6,    label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 38,     prev: 33,     label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 280,    prev: 250,    label: 'Policies Sold',  prefix: '', suffix: '' },
      }
    },
    aiSummaryData: {
      monthly: {
        headline: 'Priya\'s estate and trust creation workshops have yielded 12 new qualified leads. High client satisfaction, but regular reviews are overdue.',
        achievements: [
          'Executed 8 comprehensive family trust agreements (RM 4.8M assets trustified).',
          'Client engagement score is at a record high of 92%.',
          'Referral conversion rate improved to 76%.'
        ],
        concerns: [
          'Overdue annual portfolio health checkups for 5 legacy estate clients.',
          'AUM growth is steady but slower compared to wealth specialists.',
          'Manual trust drafting processes leading to slight administrative backlogs.'
        ],
        nextActions: [
          'Follow up on the 12 leads generated from the last trust seminar.',
          'Initiate contact with legacy client list for annual reviews.',
          'Utilize trust automation templates to streamline drafting times.'
        ]
      },
      yearly: {
        headline: 'Steady year of estate protection growth. Priya secured 45 new estate planning structures.',
        achievements: [
          'Annual revenue grew 8.33% YoY from RM 360,000 → RM 390,000.',
          'Trust assets under advisement hit new high of RM 22M.'
        ],
        concerns: [
          'AUM growth remains localized to low-yield cash trusts.',
          'Under-penetration in standard life insurance product offerings.'
        ],
        nextActions: [
          'Propose life insurance funding options for future estate liabilities.',
          'Expand trust workshops to corporate owners.'
        ]
      }
    },
    benchmarkData: {
      metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
      you:          [45100, 76, 92, 10, 4],
      teamAvg:      [38400, 54, 88, 12, 3],
      branchAvg:    [43200, 58, 90, 14, 3.5],
      topPerformer: [78600, 82, 97, 26, 8],
      units:        ['', '%', '%', '%', ''],
      ranking:      9,
      totalAdvisors: 34,
      percentile:   74,
      performanceScore: 81,
    }
  },
  'adv-danieltan': {
    name: 'Daniel Tan',
    designation: 'Financial Consultant',
    kpiData: {
      monthly: {
        totalRevenue:   { current: 31400, prev: 29500, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 5.6,   prev: 5.3,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 27,    prev: 25,    label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 29,    prev: 28,    label: 'Policies Sold',  prefix: '', suffix: '' },
      },
      yearly: {
        totalRevenue:   { current: 280000, prev: 265000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 5.6,    prev: 4.8,    label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 27,     prev: 22,     label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 240,    prev: 220,    label: 'Policies Sold',  prefix: '', suffix: '' },
      }
    },
    aiSummaryData: {
      monthly: {
        headline: 'Daniel shows consistent monthly progress in client acquisition. Focus should shift to improving the retention rate and up-selling existing policies.',
        achievements: [
          'Exceeded monthly client acquisition target by 20% (onboarded 5 clients).',
          'Completed 100% of required compliance training modules.',
          'Successfully upsold critical illness riders to 4 clients.'
        ],
        concerns: [
          'Client retention rate dropped slightly to 87% (vs team average 88%).',
          'Average response time on incoming service requests is 2.2 days.',
          'High concentration of basic saving plans with low margin structure.'
        ],
        nextActions: [
          'Implement a proactive quarterly touchpoint calendar for existing clients.',
          'Set up auto-reminders to follow up on client service tickets within 24 hours.',
          'Conduct comprehensive portfolio re-evaluations to promote wealth ILPs.'
        ]
      },
      yearly: {
        headline: 'Consistent junior to mid-level transition year. Client acquisition targets successfully met.',
        achievements: [
          'Annual revenue grew 5.66% YoY from RM 265,000 → RM 280,000.',
          'Active clients increased by 22%.'
        ],
        concerns: [
          'Retention volatility in early Q2.',
          'Low product diversity coefficient.'
        ],
        nextActions: [
          'Conduct refresher course on wealth management and asset allocation.',
          'Build strong client relationship cycles using digital channels.'
        ]
      }
    },
    benchmarkData: {
      metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
      you:          [31400, 60, 87, 14, 5],
      teamAvg:      [38400, 54, 88, 12, 3],
      branchAvg:    [43200, 58, 90, 14, 3.5],
      topPerformer: [78600, 82, 97, 26, 8],
      units:        ['', '%', '%', '%', ''],
      ranking:      15,
      totalAdvisors: 34,
      percentile:   56,
      performanceScore: 72,
    }
  },
  'adv-marcuslim': {
    name: 'Marcus Lim',
    designation: 'Retirement Planning Specialist',
    kpiData: {
      monthly: {
        totalRevenue:   { current: 48900, prev: 46200, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 7.9,   prev: 7.6,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 33,    prev: 33,    label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 41,    prev: 39,    label: 'Policies Sold',  prefix: '', suffix: '' },
      },
      yearly: {
        totalRevenue:   { current: 410000, prev: 385000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 7.9,    prev: 6.8,    label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 33,     prev: 28,     label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 340,    prev: 310,    label: 'Policies Sold',  prefix: '', suffix: '' },
      }
    },
    aiSummaryData: {
      monthly: {
        headline: 'Marcus is dominating the retirement annuity segment. Retention rate is optimal, but cross-selling into medical coverage remains low.',
        achievements: [
          'Placed RM 1.5M in retirement drawdown annuity products.',
          'Maintained a perfect 100% client retention rate this month.',
          'Client satisfaction score rated 4.9/5 in surveys.'
        ],
        concerns: [
          'Zero critical illness or medical policy additions in Q2.',
          'High concentration of revenue in top 3 pension accounts.',
          'No new clients added this month (growth stalled at 33).'
        ],
        nextActions: [
          'Review protection gaps for retirement planning clients under age 50.',
          'Host a specialized webinar on post-retirement medical cost management.',
          'Establish dynamic marketing efforts to attract pre-retirement client leads.'
        ]
      },
      yearly: {
        headline: 'High-performing retirement specialist year with 100% retention rates and optimal asset size growth.',
        achievements: [
          'Annual revenue grew 6.49% YoY from RM 385,000 → RM 410,000.',
          'Maintained zero client leakage throughout the year.'
        ],
        concerns: [
          'Low client acquisition rate (net growth +5 clients yearly).',
          'Poor performance in short term protection segments.'
        ],
        nextActions: [
          'Launch retirement accumulator products for younger professionals.',
          'Incorporate annuity solutions into standard wealth packages.'
        ]
      }
    },
    benchmarkData: {
      metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
      you:          [48900, 65, 100, 15, 3],
      teamAvg:      [38400, 54, 88, 12, 3],
      branchAvg:    [43200, 58, 90, 14, 3.5],
      topPerformer: [78600, 82, 100, 26, 8],
      units:        ['', '%', '%', '%', ''],
      ranking:      7,
      totalAdvisors: 34,
      percentile:   80,
      performanceScore: 85,
    }
  },
  'adv-sarahchen': {
    name: 'Sarah Chen',
    designation: 'Junior Financial Advisor',
    kpiData: {
      monthly: {
        totalRevenue:   { current: 22800, prev: 19800, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 2.8,   prev: 2.5,   label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 19,    prev: 17,    label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 22,    prev: 19,    label: 'Policies Sold',  prefix: '', suffix: '' },
      },
      yearly: {
        totalRevenue:   { current: 180000, prev: 155000, label: 'Total Revenue', prefix: 'RM', suffix: '' },
        aum:            { current: 2.8,    prev: 2.0,    label: 'AUM (RM M)',    prefix: 'RM ', suffix: 'M' },
        activeClients:  { current: 19,     prev: 14,     label: 'Active Clients', prefix: '', suffix: '' },
        policiesSold:   { current: 150,    prev: 120,    label: 'Policies Sold',  prefix: '', suffix: '' },
      }
    },
    aiSummaryData: {
      monthly: {
        headline: 'Sarah is making great strides as a junior advisor. Strong conversion rate on warm leads, but needs guidance on building AUM pipeline.',
        achievements: [
          'Achieved 100% of junior advisor sales milestone targets.',
          'Onboarded 5 new young professional clients this month.',
          'Conversion rate of 78% on inbound lead referrals.'
        ],
        concerns: [
          'Low average AUM per client (RM 147K vs team avg RM 302K).',
          'Limited experience in complex corporate wealth or estate planning.',
          'High reliance on single-product endowment plans.'
        ],
        nextActions: [
          'Participate in joint field work with senior advisor Raj Kumar.',
          'Focus marketing efforts on high-earning young professionals.',
          'Attend advanced estate planning workshop series next month.'
        ]
      },
      yearly: {
        headline: 'Outstanding first year in the branch, exceeding initial training and sales quotas by 16%.',
        achievements: [
          'Annual revenue grew 16.12% YoY from RM 155,000 → RM 180,000.',
          'Sarah was nominated for Rookie of the Year in the branch.'
        ],
        concerns: [
          'High portfolio volatility in smaller asset holdings.',
          'Client touchpoint frequency lags during intensive study periods.'
        ],
        nextActions: [
          'Schedule regular client catch-ups during off-peak times.',
          'Partner with senior wealth managers to handle larger accounts.'
        ]
      }
    },
    benchmarkData: {
      metrics: ['Revenue', 'Conversion Rate', 'Retention Rate', 'AUM Growth', 'New Clients'],
      you:          [22800, 78, 89, 8, 5],
      teamAvg:      [38400, 54, 88, 12, 3],
      branchAvg:    [43200, 58, 90, 14, 3.5],
      topPerformer: [78600, 82, 97, 26, 8],
      units:        ['', '%', '%', '%', ''],
      ranking:      24,
      totalAdvisors: 34,
      percentile:   30,
      performanceScore: 65,
    }
  }
};
