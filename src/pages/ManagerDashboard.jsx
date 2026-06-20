import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { mockAdvisors, mockManagerMessages } from '../lib/mockData.js';
import {
  collection, doc, setDoc, addDoc, getDocs, onSnapshot,
  query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import {
  MessageSquare, Search, Send, Phone, Mail, ExternalLink
} from 'lucide-react';
import styles from './ManagerDashboard.module.css';

// ── URL Detection Utility ─────────────────────────────────────────
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderMessageText(text, isSent) {
  if (!URL_REGEX.test(text)) return text;

  // Reset regex lastIndex
  URL_REGEX.lastIndex = 0;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.msgLink}
      >
        {url}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function extractUrls(text) {
  URL_REGEX.lastIndex = 0;
  const matches = text.match(URL_REGEX);
  return matches || [];
}

// ── Firestore Seeding for Manager Data ────────────────────────────
const seedManagerData = async () => {
  try {
    const advisorsRef = collection(db, 'advisors');
    const snap = await getDocs(advisorsRef);

    if (snap.empty) {
      console.log('Seeding Firestore with advisors and manager messages...');

      // Seed advisors
      for (const advisor of mockAdvisors) {
        await setDoc(doc(db, 'advisors', advisor.id), advisor);
      }

      // Seed manager messages
      for (const [advisorId, messages] of Object.entries(mockManagerMessages)) {
        const threadRef = doc(db, 'managerMessages', advisorId);
        await setDoc(threadRef, { advisorId, updatedAt: new Date() });

        const msgColRef = collection(threadRef, 'messages');
        for (const msg of messages) {
          await setDoc(doc(msgColRef, msg.id), {
            ...msg,
            createdAt: msg.createdAt || new Date(),
          });
        }
      }
      console.log('Manager data seeding completed.');
    }
  } catch (error) {
    console.error('Error seeding manager data:', error);
  }
};

// ── Main Component ────────────────────────────────────────────────
export default function ManagerDashboard() {
  const { user } = useAuth();

  // Messaging states
  const [advisors, setAdvisors] = useState([]);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Manager';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // ── Firestore: Load advisors ────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    seedManagerData().then(() => {
      const unsub = onSnapshot(collection(db, 'advisors'), (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setAdvisors(list);
        if (list.length > 0 && !selectedAdvisorId) {
          setSelectedAdvisorId(list[0].id);
        }
      });
      return unsub;
    }).catch(err => console.error('Failed to init manager data:', err));
  }, [user]);

  // ── Firestore: Load messages for selected advisor ───────────────
  useEffect(() => {
    if (!selectedAdvisorId) return;

    const messagesRef = collection(db, 'managerMessages', selectedAdvisorId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(messagesQuery, (snapshot) => {
      const msgList = [];
      snapshot.forEach((docSnap) => {
        msgList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMessages(msgList);
    }, (err) => {
      console.error('Error fetching manager messages:', err);
      setMessages([]);
    });

    return unsub;
  }, [selectedAdvisorId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedAdvisorId) return;

    const textToSend = newMessageText;
    setNewMessageText('');

    try {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const newMsg = {
        sender: {
          name: 'You',
          role: 'manager',
          email: user?.email || '',
        },
        text: textToSend,
        time: timestamp,
        createdAt: new Date(),
      };

      const threadRef = doc(db, 'managerMessages', selectedAdvisorId);
      await setDoc(threadRef, { advisorId: selectedAdvisorId, updatedAt: serverTimestamp() }, { merge: true });

      const messagesRef = collection(threadRef, 'messages');
      await addDoc(messagesRef, newMsg);
    } catch (error) {
      console.error('Failed to send manager message:', error);
    }
  };

  // Get selected advisor data
  const selectedAdvisor = advisors.find(a => a.id === selectedAdvisorId);

  // Filter advisors by search
  const filteredAdvisors = advisors.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get last message preview for sidebar
  const getLastMessagePreview = (advisorId) => {
    const mockMsgs = mockManagerMessages[advisorId];
    if (mockMsgs && mockMsgs.length > 0) {
      const lastMsg = mockMsgs[mockMsgs.length - 1];
      const prefix = lastMsg.sender.role === 'manager' ? 'You: ' : '';
      const text = prefix + lastMsg.text;
      return { text: text.length > 45 ? text.slice(0, 45) + '…' : text, time: lastMsg.time };
    }
    return { text: 'No messages yet', time: '' };
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{greeting}, {displayName}</h1>
          <p className={styles.pageDate}>{today} · Advisor Messaging</p>
        </div>
      </div>

      <div className={styles.messagingContainer}>
        {/* Left Sidebar: Advisor List */}
        <div className={styles.advisorSidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitle}>Your Advisors ({filteredAdvisors.length})</div>
            <div className={styles.searchWrap}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search advisors…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.advisorList}>
            {filteredAdvisors.map((advisor) => {
              const preview = getLastMessagePreview(advisor.id);
              return (
                <div
                  key={advisor.id}
                  className={`${styles.advisorItem} ${selectedAdvisorId === advisor.id ? styles.advisorItemActive : ''}`}
                  onClick={() => setSelectedAdvisorId(advisor.id)}
                >
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    className={styles.advisorAvatar}
                  />
                  <div className={styles.advisorInfo}>
                    <div className={styles.advisorName}>{advisor.name}</div>
                    <div className={styles.advisorDesignation}>{advisor.designation}</div>
                    <div className={styles.advisorPreview}>{preview.text}</div>
                  </div>
                  <div className={styles.advisorMeta}>
                    <span className={styles.advisorTime}>{preview.time}</span>
                    <span className={`${styles.statusDot} ${advisor.status === 'active' ? styles.statusActive : styles.statusAway}`} />
                  </div>
                </div>
              );
            })}
            {filteredAdvisors.length === 0 && (
              <div className={styles.emptyState} style={{ padding: '24px 16px' }}>
                <p className={styles.emptyStateSub}>No advisors match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Conversation */}
        <div className={styles.conversationPanel}>
          {selectedAdvisor ? (
            <>
              {/* Conversation Header */}
              <div className={styles.convHeader}>
                <div className={styles.convHeaderLeft}>
                  <img
                    src={selectedAdvisor.avatar}
                    alt={selectedAdvisor.name}
                    className={styles.convAvatar}
                  />
                  <div>
                    <div className={styles.convName}>{selectedAdvisor.name}</div>
                    <div className={styles.convStatus}>
                      <span className={`${styles.statusDot} ${selectedAdvisor.status === 'active' ? styles.statusActive : styles.statusAway}`} />
                      {selectedAdvisor.status === 'active' ? 'Online' : 'Away'} · {selectedAdvisor.totalClients} clients
                    </div>
                  </div>
                </div>
                <div className={styles.convHeaderRight}>
                  <button className={styles.convHeaderBtn} title="Call">
                    <Phone size={14} />
                  </button>
                  <button className={styles.convHeaderBtn} title="Email">
                    <Mail size={14} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className={styles.messagesArea}>
                {messages.map((m) => {
                  const isSent = m.sender?.role === 'manager';
                  const urls = extractUrls(m.text || '');

                  return (
                    <div
                      key={m.id}
                      className={isSent ? styles.sentRow : styles.receivedRow}
                    >
                      {!isSent && (
                        <img
                          src={selectedAdvisor.avatar}
                          alt={selectedAdvisor.name}
                          className={styles.msgAvatar}
                        />
                      )}

                      <div className={styles.msgBubbleWrap}>
                        {!isSent && (
                          <span className={styles.msgSenderName}>
                            {m.sender?.name || selectedAdvisor.name}
                          </span>
                        )}

                        <div className={`${styles.msgBubble} ${isSent ? styles.sentBubble : styles.receivedBubble}`}>
                          {renderMessageText(m.text || '', isSent)}

                          {/* Link preview indicator */}
                          {urls.length > 0 && (
                            <div className={styles.linkPreview}>
                              <ExternalLink size={12} className={styles.linkPreviewIcon} />
                              <span className={styles.linkPreviewText}>
                                {new URL(urls[0]).hostname}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={`${styles.msgTime} ${isSent ? styles.msgTimeSent : ''}`}>
                          {m.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />

                {messages.length === 0 && (
                  <div className={styles.emptyState}>
                    <MessageSquare size={40} className={styles.emptyStateIcon} />
                    <p className={styles.emptyStateText}>No messages yet</p>
                    <p className={styles.emptyStateSub}>
                      Send a message or share a link with {selectedAdvisor.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder={`Message ${selectedAdvisor.name}…`}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className={styles.inputField}
                  />
                  <button
                    type="submit"
                    className={`${styles.inputIconBtn} ${styles.sendBtn}`}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <MessageSquare size={48} className={styles.emptyStateIcon} />
              <p className={styles.emptyStateText}>Select an advisor</p>
              <p className={styles.emptyStateSub}>Choose an advisor from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
