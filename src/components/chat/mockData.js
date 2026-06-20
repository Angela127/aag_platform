export const initialChats = [
  {
    id: 'customer-gmail-com',
    name: 'TS Tho',
    email: 'customer@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    time: '4m',
    pinned: true,
    unreadCount: 1,
    lastMessage: "Perfect, thank you! I'm looking for a medium-risk wealth growth plan.",
    
    // Customer Registration Information
    fullName: 'TS Tho',
    preferredName: 'Tho',
    gender: 'Male',
    dob: '1995-08-15',
    nationality: 'Malaysian',
    maritalStatus: 'Single',
    mobileNumber: '+60 12-345 6789',
    residentialAddress: '123 Jalan Ampang, Kuala Lumpur, Malaysia',
    
    employmentStatus: 'Employed',
    companyName: 'TechCorp Solutions',
    jobTitle: 'Senior Software Engineer',
    industry: 'Information Technology',
    yearsExperience: '7',
    
    numDependents: 0,
    spouseName: '',
    childrenAges: '',
    anyFamilyDependent: 'No',
    
    annualIncomeRange: 'RM100,001 – RM250,000',
    estimatedInvestableAssets: 'RM50,000 – RM250,000',
    existingFinancialAdvisor: 'No',
    
    financialGoals: ['Wealth Accumulation', 'Retirement Preparation', 'Investment Growth'],
    preferredConsultation: 'Online Meeting',
    preferredLanguage: 'English',
    preferredCommunicationChannel: 'WhatsApp',
    
    consentGiven: true,
    registrationStatus: 'completed',
    messages: [
      {
        id: 'c1',
        sender: {
          name: 'TS Tho',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          email: 'customer@gmail.com',
          color: '#6366f1'
        },
        text: "Hi! I'm interested in discussing a new financial planning portfolio.",
        time: '09:00',
        views: 1
      },
      {
        id: 'c2',
        sender: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
          email: 'advisor@gmail.com',
          isMe: true
        },
        text: "Hello! I'd be glad to assist you. Let's look at your financial goals first.",
        time: '09:10',
        views: 1
      },
      {
        id: 'c3',
        sender: {
          name: 'TS Tho',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          email: 'customer@gmail.com',
          color: '#6366f1'
        },
        text: "Perfect, thank you! I'm looking for a medium-risk wealth growth plan.",
        time: '09:15',
        views: 1
      }
    ]
  },
  {
    id: 'osman-campos',
    name: 'Osman Campos',
    email: 'osman@aag.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    time: '20m',
    pinned: true,
    lastMessage: 'You: Hey! We are ready to start the design layout review.',
    messages: [
      {
        id: 'om1',
        sender: { name: 'You', isMe: true, email: 'advisor@gmail.com' },
        text: 'Hey! We are ready to start the design layout review.',
        time: '20m',
        views: 2
      }
    ]
  },
  {
    id: 'jayden-church',
    name: 'Jayden Church',
    email: 'jayden@aag.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    time: '1h',
    pinned: true,
    lastMessage: 'I prepared some variations for our design files. Have a look.',
    messages: [
      {
        id: 'jc1',
        sender: { name: 'Jayden Church', email: 'jayden@aag.com' },
        text: 'I prepared some variations for our design files. Have a look.',
        time: '1h'
      }
    ]
  },
  {
    id: 'jacob-mcleod',
    name: 'Jacob Mcleod',
    email: 'jacob@aag.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    time: '10m',
    unreadCount: 3,
    lastMessage: 'And send me the prototype link please.',
    messages: [
      {
        id: 'jm1',
        sender: { name: 'Jacob Mcleod', email: 'jacob@aag.com' },
        text: 'And send me the prototype link please.',
        time: '10m'
      }
    ]
  },
  {
    id: 'jasmin-lowery',
    name: 'Jasmin Lowery',
    email: 'jasmin@aag.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    time: '20m',
    seen: true,
    lastMessage: "You: Ok! Let's discuss on the thread.",
    messages: [
      {
        id: 'jl1',
        sender: { name: 'You', isMe: true, email: 'advisor@gmail.com' },
        text: "Ok! Let's discuss on the thread.",
        time: '20m',
        views: 1
      }
    ]
  },
  {
    id: 'zaid-myers',
    name: 'Zaid Myers',
    email: 'zaid@aag.com',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&h=100&fit=crop',
    time: '45m',
    seen: true,
    lastMessage: 'You: Hey! We are ready to integrate the changes.',
    messages: [
      {
        id: 'zm1',
        sender: { name: 'You', isMe: true, email: 'advisor@gmail.com' },
        text: 'Hey! We are ready to integrate the changes.',
        time: '45m',
        views: 1
      }
    ]
  },
  {
    id: 'anthony-cordanes',
    name: 'Anthony Cordanes',
    email: 'anthony@aag.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    time: '1d',
    lastMessage: 'What do you think?',
    messages: [
      {
        id: 'ac1',
        sender: { name: 'Anthony Cordanes', email: 'anthony@aag.com' },
        text: 'What do you think?',
        time: '1d'
      }
    ]
  },
  {
    id: 'conner-garcia',
    name: 'Conner Garcia',
    email: 'conner@aag.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    time: '2d',
    seen: true,
    lastMessage: 'You: I think it would be perfect if we adjust the layout.',
    messages: [
      {
        id: 'cg1',
        sender: { name: 'You', isMe: true, email: 'advisor@gmail.com' },
        text: 'I think it would be perfect if we adjust the layout.',
        time: '2d ago',
        views: 2
      }
    ]
  },
  {
    id: 'vanessa-cox',
    name: 'Vanessa Cox',
    email: 'vanessa@aag.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    time: '2d',
    seen: true,
    lastMessage: 'Could you review the client proposal by today?',
    messages: [
      {
        id: 'vc1',
        sender: { name: 'Vanessa Cox', email: 'vanessa@aag.com' },
        text: 'Could you review the client proposal by today?',
        time: '2d ago'
      }
    ]
  }
];
