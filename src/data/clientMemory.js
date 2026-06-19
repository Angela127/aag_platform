// Mock RAG knowledge base for client memory simulation
// Each client has a summary, snapshot, timeline, and question-answer pairs

const clientMemoryData = {
  1: {
    clientId: 1,
    summary:
      'Sarah is a 35-year-old engineer who values long-term financial stability. She prefers low-risk investment options and has shown consistent interest in education planning for her two children. She is methodical in her approach to finances and appreciates data-driven recommendations. She has been a loyal client for 4 years.',
    snapshot: {
      family: 'Married, two children (ages 8 and 10)',
      preferences: [
        'Birthday: 12 March',
        'Prefers email communication',
        'Vegetarian — note for meal meetings',
      ],
      riskProfile: 'Medium — prefers conservative, stable products',
    },
    timeline: [
      { date: 'June 2026', category: 'Meeting Summary', description: 'Discussed retirement planning options and reviewed current investment portfolio performance.' },
      { date: 'May 2026', category: 'Advisor Observation', description: 'Client expressed concern about market volatility. Recommended shifting to more defensive funds.' },
      { date: 'March 2026', category: 'Life Event', description: "Eldest child turned 10 — discussed accelerating education fund contributions." },
      { date: 'January 2026', category: 'Client Preference', description: 'Interested in education funding options including unit trusts and endowment plans.' },
      { date: 'November 2025', category: 'Meeting Summary', description: 'Annual review completed. All policies in good standing. Client satisfied with returns.' },
      { date: 'August 2025', category: 'Advisor Observation', description: 'Client prefers stable investment products with guaranteed returns where possible.' },
    ],
    questions: [
      { question: 'What investment style does Sarah prefer?', answer: 'Based on previous meeting records, Sarah prefers conservative investment options with stable returns. She avoids high-risk products and has expressed concern about market volatility.' },
      { question: 'What does Sarah prefer?', answer: 'Sarah prefers email communication over phone calls. She is vegetarian, so please note this when scheduling lunch meetings. She values conservative, stable investment products.' },
      { question: 'Does Sarah have children?', answer: 'Yes, Sarah has two children aged 8 and 10. She has been actively discussing education planning and fund options for them.' },
      { question: 'What are Sarah\'s financial goals?', answer: 'Sarah\'s primary financial goals are long-term stability, education funding for her children, and retirement planning. She values conservative growth over aggressive returns.' },
      { question: 'When is Sarah\'s birthday?', answer: 'Sarah\'s birthday is on 12 March. A birthday hamper was sent in March 2026.' },
      { question: 'family', answer: 'Sarah is married with two children (ages 8 and 10). Her family situation is a key driver of her financial planning, particularly education funds.' },
      { question: 'plans', answer: 'Sarah currently has 3 active plans: Life Insurance (RM300/month), Investment Plan (RM500/month), and Education Fund (RM200/month). Total monthly premiums: RM1,000.' },
      { question: 'risk', answer: 'Sarah has a Medium risk profile. She prefers conservative products and has expressed concerns about market volatility in recent meetings.' },
    ],
  },
  2: {
    clientId: 2,
    summary:
      'Marcus is a 52-year-old business owner with significant wealth but limited policy coverage. He has been difficult to reach in recent months and has multiple outstanding follow-ups. His financial situation requires attention, particularly around retirement planning and ensuring adequate coverage for his business interests.',
    snapshot: {
      family: 'Divorced, one adult child (age 24)',
      preferences: [
        'Birthday: 08 July',
        'Prefers face-to-face meetings',
        'Avoid calls during business hours',
      ],
      riskProfile: 'High — willing to take calculated risks for business growth',
    },
    timeline: [
      { date: 'February 2026', category: 'Meeting Summary', description: 'Brief meeting. Marcus mentioned business expansion plans. Discussed increasing coverage.' },
      { date: 'January 2026', category: 'Life Event', description: 'Business expanded to new branch in Penang. Increased revenue but also risk exposure.' },
      { date: 'December 2025', category: 'Advisor Observation', description: 'Client seems overwhelmed with business. May need simplified communication and fewer meetings.' },
      { date: 'October 2025', category: 'Client Preference', description: 'Expressed interest in key-person insurance for business partners.' },
      { date: 'August 2025', category: 'Meeting Summary', description: 'Discussed estate planning. Client postponed decision to next quarter.' },
    ],
    questions: [
      { question: 'What is Marcus\'s current situation?', answer: 'Marcus is a high-risk client. He hasn\'t been contacted since February 2026, has only 1 active plan, and has 3 outstanding follow-ups including an insurance renewal. He needs immediate attention.' },
      { question: 'business', answer: 'Marcus owns a business that recently expanded to Penang. He may need key-person insurance and increased coverage for his growing operations.' },
      { question: 'risk', answer: 'Marcus has a High risk profile — both in terms of investment appetite and client health. He hasn\'t been contacted recently and has multiple overdue follow-ups.' },
      { question: 'plans', answer: 'Marcus only has 1 active plan: Term Life Insurance at RM800/month with renewal due on 01 July 2026. He needs broader coverage.' },
      { question: 'family', answer: 'Marcus is divorced with one adult child aged 24. Estate planning has been discussed but decisions were postponed.' },
    ],
  },
  3: {
    clientId: 3,
    summary:
      'Priya is a 28-year-old software developer who is tech-savvy and digitally native. She prefers modern communication channels like WhatsApp and is particularly interested in ESG-compliant investments. As a young professional with no dependents, her focus is on wealth accumulation and health coverage.',
    snapshot: {
      family: 'Single, no dependents',
      preferences: [
        'Birthday: 21 November',
        'Prefers WhatsApp communication',
        'Interested in ESG/sustainable investments',
      ],
      riskProfile: 'Low — prefers steady growth with minimal risk',
    },
    timeline: [
      { date: 'June 2026', category: 'Meeting Summary', description: 'Reviewed unit trust performance. Priya pleased with returns. Discussed adding critical illness coverage.' },
      { date: 'April 2026', category: 'Life Event', description: 'Promoted to Senior Developer. Income increased — opportunity to upsell plans.' },
      { date: 'March 2026', category: 'Client Preference', description: 'Asked about ESG-compliant investment funds. Very interested in sustainable options.' },
      { date: 'January 2026', category: 'Advisor Observation', description: 'Client is very engaged digitally. Responds well to infographics and data summaries sent via WhatsApp.' },
    ],
    questions: [
      { question: 'What does Priya prefer?', answer: 'Priya prefers digital communication, especially WhatsApp. She is interested in ESG-compliant and sustainable investment products. She responds well to visual data like infographics.' },
      { question: 'risk', answer: 'Priya has a Low risk profile. She prefers steady, sustainable growth. She is particularly interested in ESG-compliant investment funds.' },
      { question: 'plans', answer: 'Priya has 2 active plans: Medical Insurance (RM180/month) and Unit Trust Growth fund (RM400/month). There\'s an opportunity to add critical illness coverage.' },
      { question: 'career', answer: 'Priya was recently promoted to Senior Developer in April 2026, resulting in an income increase. This presents an opportunity to discuss additional coverage and investments.' },
      { question: 'ESG', answer: 'Priya has expressed strong interest in ESG-compliant and sustainable investment options. She asked about ESG funds in March 2026.' },
    ],
  },
  4: {
    clientId: 4,
    summary:
      'David is a 42-year-old surgeon and high-net-worth individual. He is very busy with a demanding schedule and only available on weekends. He appreciates concise, well-prepared briefings. With three children, education planning is a priority. His overall client health is excellent — all plans are up to date and he is regularly contacted.',
    snapshot: {
      family: 'Married, three children (ages 5, 9, and 13)',
      preferences: [
        'Birthday: 05 September',
        'Only available on weekends',
        'Prefers concise briefings — no lengthy emails',
      ],
      riskProfile: 'Medium — balanced approach with diversified portfolio',
    },
    timeline: [
      { date: 'June 2026', category: 'Meeting Summary', description: 'Weekend brunch meeting. Reviewed all 4 policies. Everything on track. Client happy with performance.' },
      { date: 'May 2026', category: 'Advisor Observation', description: 'David mentioned considering an international education for eldest child. May need to adjust education fund.' },
      { date: 'March 2026', category: 'Client Preference', description: 'Interested in increasing life insurance coverage due to growing family expenses.' },
      { date: 'January 2026', category: 'Meeting Summary', description: 'Annual review. Portfolio performing above benchmark. Discussed estate planning.' },
      { date: 'September 2025', category: 'Life Event', description: 'David celebrated 42nd birthday. Sent birthday wine as a gift.' },
    ],
    questions: [
      { question: 'What does David prefer?', answer: 'David prefers weekend meetings due to his busy surgical schedule. He likes concise, well-prepared briefings rather than lengthy emails or calls.' },
      { question: 'family', answer: 'David is married with three children aged 5, 9, and 13. Education planning is a priority, and he is considering international education for his eldest child.' },
      { question: 'plans', answer: 'David has 4 active plans totaling RM2,600/month: Whole Life Insurance, Investment-Linked Plan, and two Education Funds for his children.' },
      { question: 'risk', answer: 'David has a Medium risk profile with a balanced, diversified portfolio. His investment-linked plan provides some growth exposure while his whole life insurance ensures stability.' },
      { question: 'schedule', answer: 'David is only available on weekends. He has a very demanding surgical schedule and prefers meetings to be well-organized and brief.' },
    ],
  },
  5: {
    clientId: 5,
    summary:
      'Aisha is a 31-year-old marketing director who is currently expecting her first child. She requires Shariah-compliant financial products and is in a critical phase needing maternity coverage, child protection plans, and updated financial planning. She has been out of contact since January and has multiple urgent follow-ups.',
    snapshot: {
      family: 'Married, expecting first child',
      preferences: [
        'Birthday: 14 February',
        'Prefers phone calls over email',
        'Requires Shariah-compliant products',
        'Avoids pork-based meals',
      ],
      riskProfile: 'High — under-insured with significant life changes ahead',
    },
    timeline: [
      { date: 'March 2026', category: 'Life Event', description: 'Announced pregnancy. Needs maternity and newborn coverage urgently.' },
      { date: 'January 2026', category: 'Meeting Summary', description: 'Discussed Takaful plan renewal. Aisha mentioned wanting to explore child education Takaful.' },
      { date: 'November 2025', category: 'Client Preference', description: 'Specifically requested only Shariah-compliant investment and insurance products.' },
      { date: 'September 2025', category: 'Advisor Observation', description: 'Client is proactive but tends to delay decisions. Needs gentle but firm follow-ups.' },
      { date: 'July 2025', category: 'Meeting Summary', description: 'Initial onboarding meeting. Discussed overall financial goals and risk appetite.' },
    ],
    questions: [
      { question: 'What does Aisha prefer?', answer: 'Aisha prefers phone calls over email and requires Shariah-compliant financial products. She avoids pork-based meals, so please choose halal restaurants for meetings.' },
      { question: 'family', answer: 'Aisha is married and currently expecting her first child. This is a critical period requiring maternity coverage, child protection plans, and updated financial planning.' },
      { question: 'plans', answer: 'Aisha has only 1 active plan: Takaful Plan at RM250/month, due for renewal in August 2026. She is significantly under-insured given her life stage.' },
      { question: 'Shariah', answer: 'Aisha specifically requires Shariah-compliant products only. She requested this in November 2025. All recommendations should be Takaful or Shariah-compliant investment funds.' },
      { question: 'risk', answer: 'Aisha has a High risk score from a client health perspective. She is under-insured, expecting a child, has not been contacted since January 2026, and has 4 outstanding follow-ups.' },
      { question: 'pregnancy', answer: 'Aisha announced her pregnancy in March 2026. She urgently needs maternity coverage and newborn protection plans. This should be the top priority for the next meeting.' },
    ],
  },
};

export default clientMemoryData;
