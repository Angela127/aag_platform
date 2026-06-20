import { useState, useEffect, useRef } from 'react';
import { 
  Search, Phone, MoreVertical, Paperclip, Mic, Send, 
  X, ChevronLeft, Pin, CheckCheck, Eye, MessageSquare 
} from 'lucide-react';
import { 
  collection, doc, setDoc, addDoc, getDocs, onSnapshot, 
  query, orderBy, updateDoc, serverTimestamp, increment, where 
} from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { initialChats } from './mockData.js';
import styles from './ChatWidget.module.css';
import PropTypes from 'prop-types';

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
  const { user, role } = useAuth();
  const isCustomer = role === 'customer' || user?.email === 'customer@gmail.com';
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState('customer-gmail-com');
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messageAreaRef = useRef(null);

  // Auto-scroll to bottom of messages when active chat or messages count changes
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

  // Seeding & Chats Listener
  useEffect(() => {
    if (!user) return;
    
    seedFirestore().then(() => {
      const customersRef = collection(db, 'customers');
      let chatsQuery = customersRef;
      
      if (isCustomer) {
        chatsQuery = query(customersRef, where('email', '==', user.email));
      }
      
      const unsub = onSnapshot(chatsQuery, (snapshot) => {
        const chatsList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const updatedAtVal = data.updatedAt?.toMillis() || Date.now();
          chatsList.push({ id: doc.id, ...data, _updatedAtMs: updatedAtVal });
        });
        
        // Client-side sort: Pinned first, then by updatedAt desc
        chatsList.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b._updatedAtMs - a._updatedAtMs;
        });
        
        setChats(chatsList);
      });
      return unsub;
    }).catch(err => console.error('Failed to initialize chats: ', err));
  }, [user, role, isCustomer]);

  // Set default activeChatId for customer role based on their profile doc
  useEffect(() => {
    if (isCustomer && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, isCustomer]);

  // Clear unread count when customer opens their chat window (either floating or inline)
  useEffect(() => {
    if ((isOpen || isInline) && activeChatId && isCustomer) {
      try {
        const customerDocRef = doc(db, 'customers', activeChatId);
        updateDoc(customerDocRef, { unreadCount: 0 });
      } catch (err) {
        console.error('Failed to reset customer unread count: ', err);
      }
    }
  }, [isOpen, isInline, activeChatId, isCustomer]);

  // Messages Listener for Active Chat
  useEffect(() => {
    if (!activeChatId) return;
    
    const messagesRef = collection(db, 'customers', activeChatId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const unsub = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = [];
      snapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
    }, (err) => {
      console.error('Error fetching messages: ', err);
    });
    
    return unsub;
  }, [activeChatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChatId) return;

    const textToSend = newMessageText;
    setNewMessageText(''); // Clear input field immediately for responsiveness

    try {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const displayName = isCustomer
        ? (chats.find(c => c.email === user?.email)?.name || user?.displayName || 'Customer')
        : (user?.displayName || 'Advisor');
        
      const userAvatar = isCustomer
        ? (chats.find(c => c.email === user?.email)?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop')
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop';

      const newMsg = {
        sender: {
          name: displayName,
          avatar: userAvatar,
          email: user?.email || '',
          isMe: true
        },
        text: textToSend,
        time: timestamp,
        views: 1,
        createdAt: new Date()
      };

      const customerDocRef = doc(db, 'customers', activeChatId);
      const messagesRef = collection(customerDocRef, 'messages');

      await addDoc(messagesRef, newMsg);

      const updateData = {
        time: 'Just now',
        lastMessage: isCustomer ? textToSend : `You: ${textToSend}`,
        updatedAt: serverTimestamp(),
        seen: false
      };

      if (isCustomer) {
        updateData.unreadCount = increment(1);
      } else {
        updateData.unreadCount = increment(1);
      }

      await updateDoc(customerDocRef, updateData);
    } catch (error) {
      console.error('Failed to send message: ', error);
    }
  };

  const handleToggleReaction = async (msgId, emoji) => {
    try {
      const msgDocRef = doc(db, 'customers', activeChatId, 'messages', msgId);
      const targetMsg = messages.find(m => m.id === msgId);
      if (!targetMsg) return;

      const reactions = targetMsg.reactions ? [...targetMsg.reactions] : [];
      const existIndex = reactions.findIndex(r => r.emoji === emoji);

      if (existIndex > -1) {
        const r = reactions[existIndex];
        if (r.userReacted) {
          r.count = Math.max(0, r.count - 1);
          r.userReacted = false;
        } else {
          r.count += 1;
          r.userReacted = true;
        }
      } else {
        reactions.push({ emoji, count: 1, userReacted: true });
      }

      const filteredReactions = reactions.filter(r => r.count > 0);

      await updateDoc(msgDocRef, {
        reactions: filteredReactions
      });
    } catch (error) {
      console.error('Failed to toggle reaction: ', error);
    }
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
    setShowMobileChat(true);

    // Clear unread count when chat is opened
    try {
      const customerDocRef = doc(db, 'customers', chatId);
      updateDoc(customerDocRef, { unreadCount: 0 });
    } catch (err) {
      console.error('Failed to reset unread count: ', err);
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = chats.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  return (
    <>
      {/* Floating Action Button */}
      {!isInline && (
        <button 
          className={styles.chatFab}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open support chat"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isOpen && totalUnread > 0 && (
            <span className={styles.fabBadge}>{totalUnread}</span>
          )}
        </button>
      )}

      {/* Chat Window Container */}
      {(isOpen || isInline) && (
        <div className={isInline ? styles.inlineContainer : styles.chatContainer}>
          
          {/* LEFT SIDEBAR - List of Chats */}
          {!isCustomer && (
            <div className={`${styles.sidebar} ${showMobileChat ? styles.sidebarHidden : ''}`}>
              
              {/* Search Input */}
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <Search size={16} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              {/* List */}
              <div className={styles.chatList}>
                {filteredChats.map((c) => {
                  const summaryText = c.lastMessage || 'Image upload';

                  return (
                    <div 
                      key={c.id} 
                      className={`${styles.chatItem} ${activeChatId === c.id ? styles.chatItemActive : ''}`}
                      onClick={() => selectChat(c.id)}
                    >
                      <div className={styles.chatItemAvatarWrapper}>
                        {c.avatar && c.avatar.startsWith('http') ? (
                          <img 
                            src={c.avatar} 
                            alt={c.name} 
                            className={styles.chatItemAvatar}
                          />
                        ) : (
                          <div className={`${styles.chatItemAvatar} ${styles.groupAvatar}`}>
                            {c.avatar || 'C'}
                          </div>
                        )}
                      </div>

                      <div className={styles.chatItemText}>
                        <div className={styles.chatItemHeader}>
                          <span className={styles.chatItemName}>{c.name}</span>
                          <span className={styles.chatItemTime}>{c.time}</span>
                        </div>
                        
                        <div className={styles.chatItemMessage}>
                          <span className={`${styles.chatItemMsgText} ${c.unreadCount > 0 ? styles.chatItemMsgTextUnread : ''}`}>
                            {summaryText}
                          </span>
                          
                          <div className={styles.badgeAndPin}>
                            {c.seen && <CheckCheck size={14} className={styles.doubleCheck} />}
                            {c.pinned && <Pin size={12} className={styles.pinIcon} />}
                            {c.unreadCount > 0 && (
                              <span className={styles.msgBadge}>{c.unreadCount}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT SIDEBAR - Conversation Details */}
          <div className={`${styles.chatContent} ${isCustomer ? styles.chatContentVisible : (showMobileChat ? styles.chatContentVisible : '')}`}>
            {activeChat ? (
              <>
                {/* Header */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatHeaderLeft}>
                    {!isCustomer && (
                      <button 
                        className={styles.backButton}
                        onClick={() => setShowMobileChat(false)}
                        aria-label="Back to chat list"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}
                    <div>
                      <h2 className={styles.chatHeaderTitle}>
                        {isCustomer ? 'Financial Advisor' : activeChat.name}
                      </h2>
                    </div>
                  </div>

                  <div className={styles.chatHeaderActions}>
                    <Search size={18} className={styles.actionIcon} />
                    <Phone size={18} className={styles.actionIcon} />
                    <MoreVertical size={18} className={styles.actionIcon} />
                    {!isInline && (
                      <button 
                        className={styles.backButton} 
                        onClick={() => setIsOpen(false)}
                        style={{ display: 'flex', marginLeft: 8 }}
                        aria-label="Close chat window"
                      >
                        <X size={18} style={{ color: '#706e8b' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Log Area */}
                <div className={styles.messageArea} ref={messageAreaRef}>
                  {messages.map((m) => {
                    const isMe = m.sender?.email ? (m.sender.email === user?.email) : (role === 'agent' && (m.sender?.isMe || m.sender?.name === 'You'));
                    
                    return (
                      <div 
                        key={m.id} 
                        className={isMe ? styles.sentRow : styles.receivedRow}
                      >
                        {/* Received message avatar */}
                        {!isMe && (
                          <img 
                            src={m.sender?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                            alt={m.sender?.name} 
                            className={styles.messageAvatar}
                          />
                        )}

                        <div className={styles.bubbleWrapper}>
                          {/* Sender Name in chat bubble */}
                          {!isMe && (
                            <span 
                              className={styles.senderName} 
                              style={{ color: m.sender?.color || '#5d3fd3' }}
                            >
                              {isCustomer ? 'Financial Advisor' : m.sender?.name}
                            </span>
                          )}

                          {/* Message Content Bubble */}
                          {m.type === 'image' ? (
                            <div className={styles.imageBubble}>
                              <img 
                                src={m.mediaUrl} 
                                alt="Shared meeting details" 
                                className={styles.messageImage}
                              />
                            </div>
                          ) : (
                            <div className={`${styles.messageBubble} ${isMe ? styles.sentBubble : styles.receivedBubble}`}>
                              {m.text}
                            </div>
                          )}

                          {/* Reactions badges */}
                          {m.reactions && m.reactions.length > 0 && (
                            <div className={styles.reactionsContainer}>
                              {m.reactions.map((r, ri) => (
                                <button 
                                  key={ri} 
                                  className={`${styles.reactionBadge} ${r.userReacted ? styles.reactionBadgeActive : ''}`}
                                  onClick={() => handleToggleReaction(m.id, r.emoji)}
                                >
                                  <span>{r.emoji}</span>
                                  <span>{r.count}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Eye Views & Timestamp details */}
                          <div className={`${styles.viewsTime} ${isMe ? styles.viewsTimeSent : ''}`}>
                            {m.views !== undefined && (
                              <>
                                <Eye size={12} className={styles.eyeIcon} />
                                <span>{m.views}</span>
                              </>
                            )}
                            <span>{m.time}</span>
                          </div>
                        </div>

                        {/* Sent message avatar */}
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
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar Form */}
                <form className={styles.inputArea} onSubmit={handleSendMessage}>
                  <div className={styles.inputWrapper}>
                    <button type="button" className={styles.inputIconButton} aria-label="Attach file">
                      <Paperclip size={18} />
                    </button>
                    
                    <input 
                      type="text" 
                      placeholder="Your message"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className={styles.inputField}
                    />

                    <button type="button" className={styles.inputIconButton} aria-label="Voice input">
                      <Mic size={18} />
                    </button>
                    
                    <button type="submit" className={`${styles.inputIconButton} ${styles.sendButton}`} aria-label="Send message">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className={styles.emptyChatState}>
                <MessageSquare size={48} className={styles.emptyChatIcon} />
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
}

ChatWidget.propTypes = {
  isInline: PropTypes.bool
};
