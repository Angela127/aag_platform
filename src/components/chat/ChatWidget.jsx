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
