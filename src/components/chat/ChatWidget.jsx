import { useState, useEffect, useRef } from 'react';
import { 
  Search, Phone, MoreVertical, Paperclip, Mic, Send, 
  X, ChevronLeft, MessageSquare, Maximize2, Minimize2, Sparkles
} from 'lucide-react';
import { 
  collection, doc, addDoc, onSnapshot, 
  query, orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './ChatWidget.module.css';
import AiRecommendationPanel from './AiRecommendationPanel.jsx';
import { useAiAssistant } from '../../hooks/useAiAssistant.js';
import { seedMarketDataCache } from '../../lib/dataGateway.js';
import PropTypes from 'prop-types';

const categories = [
  { id: 'comprehensive', name: 'Comprehensive Planning', icon: '📋', welcome: "Hello! I'm your AAG AI Sales Coach for Comprehensive Financial Planning. Ask me how to present qualified standards, analyze Malaysian household budgets, or resolve debt-to-income concerns using FPAM, SC, and AKPK guidelines!" },
  { id: 'retirement', name: 'Retirement Planning', icon: '👴', welcome: "Welcome! Let's build retirement urgency. I can help you structure retirement pitches, counter client objections, or reference official EPF annual reports and DOSM life expectancy tables!" },
  { id: 'estate', name: 'Estate Planning', icon: '📜', welcome: "Hello. Estate planning carries high legal precision. Ask me how to guide clients on Amanah Raya intestacy rules, Wills Act 1959 criteria, or highlight Muslim Faraid inheritance splits." },
  { id: 'wealth', name: 'Strategic Wealth', icon: '📈', welcome: "Welcome to Wealth & Investments. Ask me how to pitch portfolio strategies, highlight unit trust net assets, or explain the impact of current BNM OPR decisions on interest returns!" },
  { id: 'private', name: 'Private HNW Client', icon: '💎', welcome: "Hello. Let's discuss Private Client Advisory. Ask me about sophisticated investor eligibility thresholds under SC guidelines, or how to explain tax-efficient dividend portfolios." },
  { id: 'corporate', name: 'Corporate & Benefits', icon: '🏢', welcome: "Welcome to Corporate Solutions. Ask me how to outline statutory EPF/SOCSO rules, structure group insurance benefits, or handle objections around employee retention." }
];

const customersToSeed = [
  {
    id: 'customer-gmail-com',
    name: 'TS Tho',
    email: 'customer@gmail.com',
    mobileNumber: '+65 8123 4567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    age: 41,
    occupation: 'Property Developer',
    healthScore: 68,
    riskLevel: 'Medium',
    lastContact: '18 June 2026',
    activePlans: 2,
    plans: [
      { name: 'Whole Life Insurance', premium: 'RM400/month', renewal: '12 Oct 2026', coverage: 'RM600,000' },
      { name: 'Vanguard Capital Growth Fund', premium: 'RM500/month', renewal: '15 Feb 2027', coverage: 'RM300,000' }
    ],
    followUps: [
      { task: 'Send property market analysis', date: '25 June 2026', priority: 'high', completed: false }
    ],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: false, renewalSoon: false, outstandingFollowUps: 1 },
    familyDetails: 'Married, one child',
    needs: ["Property Purchase", "Real Estate Sales"],
    needsSummary: "Looking to liquidate an existing commercial asset and acquire a freehold residential property."
  },
  {
    id: 'osman-campos',
    name: 'Osman Campos',
    email: 'osman@aag.com',
    mobileNumber: '+65 9012 3456',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    age: 29,
    occupation: 'Graphic Designer',
    healthScore: 85,
    riskLevel: 'Low',
    lastContact: '20 June 2026',
    activePlans: 2,
    plans: [
      { name: 'Medical Card', premium: 'RM150/month', renewal: '12 Dec 2026', coverage: 'RM200,000' },
      { name: 'Personal Accident Plan', premium: 'RM50/month', renewal: '15 Sep 2026', coverage: 'RM100,000' }
    ],
    followUps: [],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: true, renewalSoon: false, outstandingFollowUps: 0 },
    familyDetails: 'Single'
  },
  {
    id: 'jayden-church',
    name: 'Jayden Church',
    email: 'jayden@aag.com',
    mobileNumber: '+65 9123 4567',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    age: 34,
    occupation: 'Product Designer',
    healthScore: 78,
    riskLevel: 'Medium',
    lastContact: '19 June 2026',
    activePlans: 1,
    plans: [
      { name: 'Critical Illness Plan', premium: 'RM200/month', renewal: '05 May 2027', coverage: 'RM150,000' }
    ],
    followUps: [
      { task: 'Follow up on design layout review options', date: '28 June 2026', priority: 'medium', completed: false }
    ],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: true, renewalSoon: false, outstandingFollowUps: 1 },
    familyDetails: 'Married'
  },
  {
    id: 'jacob-mcleod',
    name: 'Jacob Mcleod',
    email: 'jacob@aag.com',
    mobileNumber: '+65 9234 5678',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    age: 45,
    occupation: 'Project Manager',
    healthScore: 52,
    riskLevel: 'High',
    lastContact: '18 June 2026',
    activePlans: 1,
    plans: [
      { name: 'Term Life Insurance', premium: 'RM350/month', renewal: '20 July 2026', coverage: 'RM500,000' }
    ],
    followUps: [
      { task: 'Send prototype link and discuss coverage expansion', date: '22 June 2026', priority: 'high', completed: false }
    ],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: false, renewalSoon: true, outstandingFollowUps: 1 },
    familyDetails: 'Married, two children'
  },
  {
    id: 'jasmin-lowery',
    name: 'Jasmin Lowery',
    email: 'jasmin@aag.com',
    mobileNumber: '+65 9345 6789',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    age: 35,
    occupation: 'Operations Director',
    healthScore: 82,
    riskLevel: 'Medium',
    lastContact: '15 June 2026',
    activePlans: 3,
    plans: [
      { name: 'Whole Life Insurance', premium: 'RM300/month', renewal: '20 Aug 2026', coverage: 'RM500,000' },
      { name: 'Investment-Linked Plan', premium: 'RM500/month', renewal: '15 Jan 2027', coverage: 'RM200,000' },
      { name: 'Education Fund', premium: 'RM200/month', renewal: '01 Mar 2027', coverage: 'RM100,000' }
    ],
    followUps: [
      { task: 'Review investment plan', date: '25 June 2026', priority: 'medium', completed: false },
      { task: 'Education fund annual review', date: '01 Aug 2026', priority: 'low', completed: false }
    ],
    expenses: [
      { type: 'Gift', description: 'Birthday hamper', amount: 'RM150', date: '12 March 2026' }
    ],
    healthFactors: { recentContact: true, planComplete: true, renewalSoon: true, outstandingFollowUps: 1 },
    familyDetails: 'Married, two children (ages 8 and 10)',
    needs: ["Tax Planning", "Estate Planning"],
    needsSummary: "Needs complex personal tax planning alongside asset structuring for cross-border investments."
  },
  {
    id: 'zaid-myers',
    name: 'Zaid Myers',
    email: 'zaid@aag.com',
    mobileNumber: '+65 9456 7890',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&h=100&fit=crop',
    age: 28,
    occupation: 'Frontend Engineer',
    healthScore: 75,
    riskLevel: 'Low',
    lastContact: '17 June 2026',
    activePlans: 2,
    plans: [
      { name: 'Medical Insurance', premium: 'RM180/month', renewal: '10 Oct 2026', coverage: 'RM300,000' },
      { name: 'Unit Trust Growth', premium: 'RM400/month', renewal: '01 Dec 2026', coverage: 'RM150,000' }
    ],
    followUps: [
      { task: 'Send investment report', date: '25 June 2026', priority: 'medium', completed: false },
      { task: 'Follow up on critical illness rider', date: '10 July 2026', priority: 'low', completed: false }
    ],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: true, renewalSoon: false, outstandingFollowUps: 2 },
    familyDetails: 'Single, no dependents'
  },
  {
    id: 'anthony-cordanes',
    name: 'Anthony Cordanes',
    email: 'anthony@aag.com',
    mobileNumber: '+65 9567 8901',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    age: 48,
    occupation: 'Financial Consultant',
    healthScore: 92,
    riskLevel: 'Low',
    lastContact: '15 June 2026',
    activePlans: 4,
    plans: [
      { name: 'Whole Life Insurance', premium: 'RM1,200/month', renewal: '15 Nov 2026', coverage: 'RM2,000,000' },
      { name: 'Investment-Linked Plan', premium: 'RM800/month', renewal: '01 Feb 2027', coverage: 'RM500,000' },
      { name: 'Education Fund A', premium: 'RM300/month', renewal: '01 Mar 2027', coverage: 'RM200,000' },
      { name: 'Education Fund B', premium: 'RM300/month', renewal: '01 Mar 2027', coverage: 'RM200,000' }
    ],
    followUps: [
      { task: 'Quarterly portfolio review', date: '01 July 2026', priority: 'low', completed: false }
    ],
    expenses: [
      { type: 'Gift', description: 'Birthday wine', amount: 'RM180', date: '05 Sep 2025' }
    ],
    healthFactors: { recentContact: true, planComplete: true, renewalSoon: false, outstandingFollowUps: 0 },
    familyDetails: 'Married, three children (ages 5, 9, and 13)'
  },
  {
    id: 'conner-garcia',
    name: 'Conner Garcia',
    email: 'conner@aag.com',
    mobileNumber: '+65 9678 9012',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    age: 31,
    occupation: 'Creative Director',
    healthScore: 40,
    riskLevel: 'High',
    lastContact: '12 June 2026',
    activePlans: 1,
    plans: [
      { name: 'Basic Term Life', premium: 'RM250/month', renewal: '01 Aug 2026', coverage: 'RM400,000' }
    ],
    followUps: [
      { task: 'Discuss maternity and child coverage', date: '22 June 2026', priority: 'high', completed: false },
      { task: 'Term life plan renewal', date: '15 July 2026', priority: 'high', completed: false },
      { task: 'Review overall financial plan', date: '01 Aug 2026', priority: 'medium', completed: false }
    ],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: false, renewalSoon: true, outstandingFollowUps: 3 },
    familyDetails: 'Married, expecting first child'
  },
  {
    id: 'vanessa-cox',
    name: 'Vanessa Cox',
    email: 'vanessa@aag.com',
    mobileNumber: '+65 9789 0123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    age: 39,
    occupation: 'Executive Chef',
    healthScore: 61,
    riskLevel: 'Medium',
    lastContact: '14 June 2026',
    activePlans: 2,
    plans: [
      { name: 'Medical Card Elite', premium: 'RM350/month', renewal: '18 Nov 2026', coverage: 'RM1,000,000' },
      { name: 'Retirement Annuity', premium: 'RM600/month', renewal: '01 Apr 2027', coverage: 'RM300,000' }
    ],
    followUps: [
      { task: 'Send annuity performance report', date: '30 June 2026', priority: 'medium', completed: false }
    ],
    expenses: [],
    healthFactors: { recentContact: true, planComplete: true, renewalSoon: false, outstandingFollowUps: 1 },
    familyDetails: 'Married, one teenager'
  }
];


// Automatic Seeding Logic to initialize Firestore collections if empty
const seedFirestore = async () => {
  try {
    const customersRef = collection(db, 'customers');
    const custSnap = await getDocs(customersRef);
    const hasCustomerTho = custSnap.docs.some(doc => doc.id === 'customer-gmail-com');

    if (custSnap.empty || !hasCustomerTho) {
      console.log('Seeding Firestore with customers and messages subcollections...');
      for (const chat of initialChats) {
        const { messages, ...customerMeta } = chat;
        
        const matchToSeed = customersToSeed.find(c => c.id === chat.id || c.email === chat.email);
        
        const docData = {
          ...matchToSeed,
          ...customerMeta,
          status: 'active',
          updatedAt: new Date(),
          createdAt: new Date()
        };
        
        const custDocRef = doc(db, 'customers', chat.id);
        await setDoc(custDocRef, docData, { merge: true });

        const messagesRef = collection(custDocRef, 'messages');
        let baseTime = Date.now() - (messages.length * 60000); 
        for (const [index, msg] of messages.entries()) {
          const msgDocRef = doc(messagesRef, msg.id || `m_${index}`);
          await setDoc(msgDocRef, {
            ...msg,
            createdAt: new Date(baseTime + (index * 60000))
          });
        }
      }
      console.log('Customers and messages seeding completed.');
    }
  } catch (error) {
    console.error('Error during Firestore database seeding: ', error);
  }
};

export default function ChatWidget({ isInline = false }) {
  const { user } = useAuth();
  
  // Widget states
  const [isOpen, setIsOpen] = useState(false);
  const [isWide, setIsWide] = useState(true); // default to wide for rich compliance references
  const [activeCategory, setActiveCategory] = useState('comprehensive');
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI assistant hook
  const {
    loadingContext,
    contextData,
    generatingResponse,
    generateCoachResponse
  } = useAiAssistant(activeCategory);

  const messagesEndRef = useRef(null);
  const messageAreaRef = useRef(null);

  // Seed market data cache on mount
  useEffect(() => {
    seedMarketDataCache();
  }, []);

  // Auto-scroll helper
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen || isInline) {
      scrollToBottom();
    }
  }, [messages, isOpen, isInline]);

  // Load category messages in real-time
  useEffect(() => {
    if (!activeCategory) return;

    const messagesRef = collection(db, 'ai_chats', activeCategory, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(messagesQuery, async (snapshot) => {
      const messagesList = [];
      snapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });

      // If no messages exist in this category yet, seed the default AI Coach welcome message
      if (messagesList.length === 0) {
        const welcomeText = categories.find(c => c.id === activeCategory)?.welcome || "Hello! How can I help you today?";
        const welcomeMsg = {
          sender: {
            role: 'ai',
            name: 'AI Sales Coach',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop'
          },
          text: welcomeText,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          createdAt: new Date()
        };
        try {
          await addDoc(messagesRef, welcomeMsg);
        } catch (err) {
          console.error("Failed to seed welcome message:", err);
        }
      } else {
        setMessages(messagesList);
      }
    }, (err) => {
      console.error('Error fetching messages: ', err);
    });

    return unsub;
  }, [activeCategory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeCategory) return;

    const textToSend = newMessageText;
    setNewMessageText(''); // Immediate clear for snappy UX

    try {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // 1. Save Advisor (user) message to Firestore
      const userMsg = {
        sender: {
          role: 'advisor',
          name: user?.displayName || 'Advisor',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
        },
        text: textToSend,
        time: timestamp,
        createdAt: new Date()
      };

      const messagesRef = collection(db, 'ai_chats', activeCategory, 'messages');
      await addDoc(messagesRef, userMsg);
      
      setIsAiThinking(true);

      // 2. Generate coach response using the Vertex prompt (grounded in reference library)
      const currentMessages = [...messages, userMsg];
      const coachReply = await generateCoachResponse(currentMessages);

      // 3. Save Coach response to Firestore
      const aiMsg = {
        sender: {
          role: 'ai',
          name: 'AI Sales Coach',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop'
        },
        text: coachReply,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        createdAt: new Date()
      };
      await addDoc(messagesRef, aiMsg);

    } catch (error) {
      console.error('Failed to communicate with AI Coach: ', error);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Filter categories based on search input
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Action Button */}
      {!isInline && (
        <button 
          className={styles.chatFab}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Sales Coach"
        >
          {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        </button>
      )}

      {/* Chat Window Container */}
      {(isOpen || isInline) && (
        <div className={`${isInline ? styles.inlineContainer : styles.chatContainer} ${isWide && !isInline ? styles.chatContainerWide : ''}`}>
          
          {/* LEFT SIDEBAR - Category Selector */}
          <div className={styles.sidebar}>
            {/* Search Input */}
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search Category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* List of categories */}
            <div className={styles.chatList}>
              {filteredCategories.map((c) => (
                <div 
                  key={c.id} 
                  className={`${styles.chatItem} ${activeCategory === c.id ? styles.chatItemActive : ''}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  <div className={styles.categoryIconBadge}>
                    {c.icon}
                  </div>
                  <div className={styles.chatItemText}>
                    <span className={styles.chatItemName}>{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CHAT CONTENT */}
          <div className={styles.chatContent}>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <Sparkles size={18} className={styles.headerSparkleIcon} />
                <div>
                  <h2 className={styles.chatHeaderTitle}>
                    AI Sales Coach
                  </h2>
                  <span className={styles.chatHeaderSub}>
                    Advisors Alliance Group
                  </span>
                </div>
              </div>

              <div className={styles.chatHeaderActions}>
                {!isInline && (
                  <button
                    className={styles.backButton}
                    onClick={() => setIsWide(w => !w)}
                    aria-label={isWide ? 'Minimize panel' : 'Expand panel'}
                    title={isWide ? 'Hide Reference Library' : 'Show Reference Library'}
                  >
                    {isWide
                      ? <Minimize2 size={18} style={{ color: '#870105' }} />
                      : <Maximize2 size={18} style={{ color: '#706e8b' }} />}
                  </button>
                )}
                {!isInline && (
                  <button 
                    className={styles.backButton} 
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                  >
                    <X size={18} style={{ color: '#706e8b' }} />
                  </button>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className={styles.messageArea} ref={messageAreaRef}>
              {messages.map((m) => {
                const isMe = m.sender?.role === 'advisor';
                
                return (
                  <div 
                    key={m.id} 
                    className={isMe ? styles.sentRow : styles.receivedRow}
                  >
                    {/* Coach avatar */}
                    {!isMe && (
                      <img 
                        src={m.sender?.avatar} 
                        alt={m.sender?.name} 
                        className={styles.messageAvatar}
                      />
                    )}

                    <div className={styles.bubbleWrapper}>
                      {/* Sender label */}
                      {!isMe && (
                        <span className={styles.senderName}>
                          {m.sender?.name}
                        </span>
                      )}

                      {/* Content */}
                      <div 
                        className={`${styles.messageBubble} ${isMe ? styles.sentBubbleBurgundy : styles.receivedBubbleCoach}`}
                        dangerouslySetInnerHTML={{ 
                          __html: m.text
                            .replace(/\n/g, '<br/>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\[(.*?)\]/g, '<span class="compliance-citation">[$1]</span>')
                        }}
                      />

                      {/* Timestamp */}
                      <div className={`${styles.viewsTime} ${isMe ? styles.viewsTimeSent : ''}`}>
                        <span>{m.time}</span>
                      </div>
                    </div>

                    {/* Advisor avatar */}
                    {isMe && (
                      <img 
                        src={m.sender?.avatar} 
                        alt="You" 
                        className={styles.messageAvatar}
                      />
                    )}
                  </div>
                );
              })}

              {/* AI Typing Indicator */}
              {(isAiThinking || generatingResponse) && (
                <div className={styles.receivedRow}>
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop" 
                    alt="AI Coach" 
                    className={styles.messageAvatar}
                  />
                  <div className={styles.bubbleWrapper}>
                    <span className={styles.senderName}>AI Sales Coach</span>
                    <div className={`${styles.messageBubble} ${styles.receivedBubbleCoach}`}>
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Form */}
            <form className={styles.inputArea} onSubmit={handleSendMessage}>
              <div className={styles.inputWrapper}>
                <button type="button" className={styles.inputIconButton} aria-label="Attach reference">
                  <Paperclip size={18} />
                </button>
                
                <input 
                  type="text" 
                  placeholder={isAiThinking ? "AI Coach is typing..." : "Ask your Sales Coach..."}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className={styles.inputField}
                  disabled={isAiThinking}
                />

                <button type="submit" className={`${styles.inputIconButton} ${styles.sendButton}`} aria-label="Send query" disabled={isAiThinking}>
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN - Compliance Reference Deck */}
          {isWide && (
            <AiRecommendationPanel
              loadingContext={loadingContext}
              contextData={contextData}
              activeCategory={activeCategory}
            />
          )}

        </div>
      )}
    </>
  );
}

ChatWidget.propTypes = {
  isInline: PropTypes.bool
};
