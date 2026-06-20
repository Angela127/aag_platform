import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Calendar, Check, Upload, PenTool, Download, 
  MessageSquare, X, ChevronRight, Shield, ArrowRight, Clock, 
  Video, PhoneOff, Mic, MicOff, VideoOff, Play, Award, FileText,
  User
} from 'lucide-react';
import ChatWidget from '../components/chat/ChatWidget.jsx';
import styles from './CustomerPortal.module.css';

const INITIAL_POLICIES = [
  { id: 1, title: 'Medical Insurance', coverage: 'RM 500,000', status: 'Expiring Soon', badgeStyle: 'warning', renewal: '15 Jul 2026', type: 'medical' },
  { id: 2, title: 'Life Insurance', coverage: 'RM 1,000,000', status: 'Active', badgeStyle: 'success', renewal: '12 Jan 2027', type: 'life' },
  { id: 3, title: 'Investment-Linked Plan', coverage: 'RM 250,000', status: 'Active', badgeStyle: 'success', renewal: '30 Mar 2027', type: 'investment' },
  { id: 4, title: 'Critical Illness Cover', coverage: 'RM 300,000', status: 'Active', badgeStyle: 'success', renewal: '15 Aug 2027', type: 'critical' },
  { id: 5, title: 'Mortgage Insurance', coverage: 'RM 450,000', status: 'Active', badgeStyle: 'success', renewal: '10 Dec 2027', type: 'mortgage' },
];

const INITIAL_MEETINGS = [
  { id: 1, title: 'Retirement Planning Review', advisor: 'Raj Kumar', time: '2:00 PM', date: '25', month: 'JUN', active: true },
  { id: 2, title: 'Annual Policy Review', advisor: 'Raj Kumar', time: '10:30 AM', date: '12', month: 'JUL', active: false },
  { id: 3, title: 'Estate Planning Consultation', advisor: 'Priya Nair', time: '3:00 PM', date: '28', month: 'JUL', active: false },
];

const INITIAL_TASKS = [
  { id: 'task-1', title: 'Upload latest payslip', due: 'Due 22 Jun', overdue: true, status: 'pending', action: 'upload', notifId: 'c-notif-3' },
  { id: 'task-2', title: 'Complete risk assessment form', due: 'Due 25 Jun', overdue: false, status: 'pending', action: 'sign', notifId: 'c-notif-2' },
  { id: 'task-3', title: 'Sign updated policy document', due: 'Due 30 Jun', overdue: false, status: 'pending', action: 'sign', notifId: 'c-notif-4' },
  { id: 'task-4', title: 'Update beneficiary details', due: 'Due 5 Jul', overdue: false, status: 'pending', action: 'upload' },
  { id: 'task-5', title: 'Submit annual declaration', due: 'Completed 10 Jun', overdue: false, status: 'completed', completedDate: '10 Jun' },
  { id: 'task-6', title: 'Verify NRIC details', due: 'Completed 1 Jun', overdue: false, status: 'completed', completedDate: '1 Jun' },
];

const INITIAL_DOCUMENTS = [
  { id: 1, name: 'Policy Certificate_Life.pdf', category: 'Policy', date: '10 May 2026' },
  { id: 2, name: 'Investment_Statement_Q1.pdf', category: 'Statement', date: '1 Apr 2026' },
  { id: 3, name: 'Medical_Card_2026.pdf', category: 'Medical', date: '15 Jan 2026' },
  { id: 4, name: 'Payslip_March2026.pdf', category: 'Payslip', date: '31 Mar 2026' },
  { id: 5, name: 'Beneficiary_Form.pdf', category: 'Form', date: '20 Feb 2026' },
  { id: 6, name: 'Risk_Assessment.pdf', category: 'Assessment', date: '5 Jun 2026' },
];

export default function CustomerPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'chat'
  const [policiesExpanded, setPoliciesExpanded] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [healthScore, setHealthScore] = useState(82);
  
  // Modal / Interaction states
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isUploadingId, setIsUploadingId] = useState(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const timerRef = useRef(null);

  // Mount shimmer logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Video call timer logic
  useEffect(() => {
    if (videoCallOpen) {
      timerRef.current = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [videoCallOpen]);

  // Toast trigger helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Smooth scroll handler
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle physical mock download of documents using Blobs
  const handleDownload = (filename, docName) => {
    const textContent = `
========================================================================
ADVISORS ALLIANCE GROUP (AAG) COMPASS
CLIENT PORTAL - SECURE DOCUMENT DOWNLOAD
========================================================================
Document Name  : ${docName}
File Reference : ${filename}
Owner Email    : customer@gmail.com
Authorized IP  : 127.0.0.1
Download Time  : ${new Date().toLocaleString()}
Advisor        : Raj Kumar

This document is dynamically generated on-the-fly to satisfy your physical file download request for testing and verification purposes. Please keep this file secure.

------------------------------------------------------------------------
Copyright © 2026 Advisors Alliance Group. All rights reserved.
    `;
    
    const blob = new Blob([textContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Successfully downloaded physical file: ${filename}`);
  };

  // Simulated Document Upload Form
  const handleDocUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.png,.jpg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        showToast(`Uploading document: ${file.name}...`);
        setTimeout(() => {
          const newDoc = {
            id: documents.length + 1,
            name: file.name,
            category: 'Uploaded',
            date: 'Just now'
          };
          setDocuments(prev => [newDoc, ...prev]);
          showToast(`Successfully uploaded ${file.name}`);
        }, 1500);
      }
    };
    input.click();
  };

  // Sync / remove notifications state from Navbar Bell
  const dismissNavbarNotification = (notifId) => {
    if (!notifId) return;
    const stored = localStorage.getItem('aag_customer_notifs');
    if (stored) {
      const notifs = JSON.parse(stored);
      const updated = notifs.filter(n => n.id !== notifId);
      localStorage.setItem('aag_customer_notifs', JSON.stringify(updated));
      // Dispatch event to force Navbar reload
      window.dispatchEvent(new Event('aag-notifications-updated'));
    }
  };

  // Complete a task with animation
  const completeTask = (taskId, notifId) => {
    // Start exit transition
    const card = document.getElementById(taskId);
    if (card) {
      card.classList.add(styles.taskAnimateExit);
    }
    
    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
            due: 'Completed Just now',
            completedDate: 'Just now'
          };
        }
        return t;
      }));
      
      // Update score by +3 points
      setHealthScore(s => Math.min(100, s + 3));
      
      // Sync notifications
      if (notifId) {
        dismissNavbarNotification(notifId);
      }
      
      showToast('Task marked as Completed! Your Financial Health Score increased.');
    }, 300);
  };

  // File upload simulation for tasks
  const handleUploadTask = (taskId, notifId) => {
    setIsUploadingId(taskId);
    showToast('Simulating file upload. Please wait...');
    setTimeout(() => {
      setIsUploadingId(null);
      completeTask(taskId, notifId);
    }, 1500);
  };

  // Signature drawing pad logic
  const handleOpenSignature = (taskId) => {
    setActiveTaskId(taskId);
    setSignatureModalOpen(true);
  };

  useEffect(() => {
    if (signatureModalOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set display dimensions
      canvas.width = 440;
      canvas.height = 200;
      
      ctx.strokeStyle = '#870105';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [signatureModalOpen]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Support touch events
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignatureCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSubmitSignature = () => {
    if (activeTaskId) {
      const task = tasks.find(t => t.id === activeTaskId);
      setSignatureModalOpen(false);
      completeTask(activeTaskId, task?.notifId);
      setActiveTaskId(null);
    }
  };

  // Video call overlay time format
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Filter lists
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Trigger Claude Chat connection / Switch to chat tab
  const handleConnectClaude = () => {
    setActiveTab('chat');
    showToast('Connecting to Claude... Opening advisor chat.');
    
    // Find the ChatWidget input and pre-fill it
    setTimeout(() => {
      const chatInputs = document.querySelectorAll('input');
      for (const input of chatInputs) {
        if (input.placeholder === 'Your message' || input.className.includes('inputField')) {
          input.value = "Hi! I noticed the AI Insight about my retirement planning gap and expiring medical insurance, and I'd like to schedule a review.";
          input.focus();
          break;
        }
      }
    }, 500);
  };

  // Skeleton shimmer UI during mock loading
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.shimmerWrapper}>
          <div className={styles.shimmerCard} style={{ height: 160 }} />
          <div className={styles.shimmerCard} style={{ height: 100 }} />
          <div className={styles.shimmerGrid}>
            <div className={styles.shimmerCard} style={{ height: 120 }} />
            <div className={styles.shimmerCard} style={{ height: 120 }} />
            <div className={styles.shimmerCard} style={{ height: 120 }} />
            <div className={styles.shimmerCard} style={{ height: 120 }} />
          </div>
          <div className={styles.shimmerCard} style={{ height: 350 }} />
        </div>
      </div>
    );
  }

  // Active video call modal overlay
  const renderVideoCall = () => {
    if (!videoCallOpen) return null;
    return (
      <div className={styles.videoCallOverlay}>
        <div className={styles.videoHeader}>
          <div className={styles.videoTitle}>Retirement Review Call</div>
          <div className={styles.videoTimer}>{formatTime(callDuration)}</div>
        </div>
        
        <div className={styles.videoContent}>
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop" 
            alt="Advisor Raj" 
            className={styles.videoAvatar}
          />
          <div className={styles.videoLabel}>Raj Kumar (Senior Wealth Advisor)</div>
          <div className={styles.videoStatus}>
            {callDuration < 3 ? 'Connecting call securely...' : 'Connected. Audio / Video streaming active.'}
          </div>
        </div>
        
        <div className={styles.videoControls}>
          <button className={styles.videoBtn} aria-label="Toggle microphone">
            <Mic size={20} />
          </button>
          <button className={styles.videoBtn} aria-label="Toggle camera">
            <Video size={20} />
          </button>
          <button 
            className={`${styles.videoBtn} ${styles.videoBtnDanger}`} 
            onClick={() => { setVideoCallOpen(false); showToast('Left review meeting.'); }}
            aria-label="Hang up call"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    );
  };

  // Canvas Signature pad overlay modal
  const renderSignatureModal = () => {
    if (!signatureModalOpen) return null;
    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <span className={styles.modalTitle}>Scribble Signature Draw Pad</span>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => setSignatureModalOpen(false)}
              style={{ minWidth: 'auto', padding: 4 }}
              aria-label="Close signature modal"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className={styles.modalBody}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Use your mouse or touch screen to draw your signature below. Click submit to sign off the document.
            </p>
            
            <div className={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                className={styles.signatureCanvas}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={clearSignatureCanvas}
              >
                Clear Pad
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Verification secure via AAG SSL
              </span>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSignatureModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmitSignature}
            >
              Submit Signature
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render arc score gauge calculations
  const radius = 40;
  const circumference = Math.PI * radius; // Semi-circle is Pi * r
  const scoreOffset = circumference - (circumference * healthScore / 100);

  const todayStr = new Date().toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={styles.page}>
      
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className={styles.toast}>
          <Check size={16} style={{ color: 'var(--aag-accent-mid)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Video Call screen */}
      {renderVideoCall()}

      {/* Signature drawing modal */}
      {renderSignatureModal()}

      {/* Page Header (Matching Advisor Dashboard Tab style) */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Client Portal</h1>
          <p className={styles.pageDate}>{todayStr}</p>
        </div>
        <div className={styles.tabsNav}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'chat' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Advisor Chat
          </button>
        </div>
      </div>

      {/* Conditional rendering of tabs */}
      {activeTab === 'overview' ? (
        <>
          {/* AI Insight Widget (Flagship) */}
          <section className={styles.insightBanner}>
            <div className={styles.insightBannerBg} />
            <div className={styles.badgeInsight}>
              <Sparkles size={13} />
              <span>AI Insight</span>
            </div>
            <h1 className={styles.insightTitle}>You may have a retirement planning gap</h1>
            <p className={styles.insightDesc}>
              Based on your current investment plan and projected expenses, your retirement fund may fall short by 
              <strong> ~RM 180,000</strong> at age 65. Your medical insurance renewal is also due in 30 days.
            </p>
            <button className={styles.insightCta} onClick={handleConnectClaude}>
              <Calendar size={15} />
              <span>Schedule retirement review</span>
              <ChevronRight size={14} />
            </button>
          </section>

          {/* Welcome & Financial Health Score Card */}
          <section className={styles.welcomeCard}>
            <div className={styles.welcomeLeft}>
              <h2 className={styles.welcomeTitle}>Good morning, John 👋</h2>
              <p className={styles.welcomeSub}>
                Here's your financial snapshot for today, {todayStr}
              </p>
              <div className={styles.pillsRow}>
                <span className={styles.statusPill + ' ' + styles.pillProtected}>
                  <Shield size={13} /> Protected
                </span>
                <span className={styles.statusPill + ' ' + styles.pillWarning}>
                  <Sparkles size={13} /> Retirement gap
                </span>
                {pendingTasks.length > 0 && (
                  <span className={styles.statusPill + ' ' + styles.pillPending}>
                    <Clock size={13} /> {pendingTasks.length} tasks pending
                  </span>
                )}
              </div>
            </div>

            <div className={styles.gaugeWrapper}>
              <svg viewBox="0 0 100 60" className={styles.gaugeSvg}>
                {/* Background path (grey arc) */}
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="var(--border)" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                />
                {/* Foreground path (colored gradient arc) */}
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#gaugeScoreGradient)" 
                  strokeWidth="7" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={scoreOffset}
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <defs>
                  <linearGradient id="gaugeScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className={styles.gaugeTextWrap}>
                <span className={styles.gaugeScore}>{healthScore}</span>
                <span className={styles.gaugeMax}>/100</span>
              </div>
              <span className={styles.gaugeLabel}>Financial Health</span>
            </div>
          </section>

          {/* Quick Action Link Row */}
          <section className={styles.quickActionsGrid}>
            <div className={styles.quickActionCard} onClick={() => handleScrollTo('policies')}>
              <div className={styles.actionIconWrap}>
                <Shield size={20} />
              </div>
              <span className={styles.actionText}>View Policies</span>
            </div>

            <div className={styles.quickActionCard} onClick={() => handleScrollTo('meetings')}>
              <div className={styles.actionIconWrap}>
                <Video size={20} />
              </div>
              <span className={styles.actionText}>Join Meeting</span>
            </div>

            <div className={styles.quickActionCard} onClick={() => handleScrollTo('documents')}>
              <div className={styles.actionIconWrap}>
                <Upload size={20} />
              </div>
              <span className={styles.actionText}>Upload Document</span>
            </div>

            <div className={styles.quickActionCard} onClick={() => setActiveTab('chat')}>
              <div className={styles.actionIconWrap}>
                <MessageSquare size={20} />
              </div>
              <span className={styles.actionText}>Message Advisor</span>
            </div>
          </section>

          {/* Policies section */}
          <section id="policies" className={styles.sectionCard + ' ' + styles.sectionAnchor}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Shield className={styles.sectionTitleIcon} size={20} />
                <span>My Policies</span>
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setPoliciesExpanded(!policiesExpanded)}
              >
                {policiesExpanded ? 'Show less' : 'View all'}
              </button>
            </div>

            <div 
              className={styles.policiesGrid}
              style={{ maxHeight: policiesExpanded ? '1000px' : '230px' }}
            >
              {INITIAL_POLICIES.map(p => (
                <div key={p.id} className={styles.policyCard}>
                  <div className={styles.policyCardHeader}>
                    <div className={styles.policyIcon}>
                      <Shield size={18} />
                    </div>
                    <span className={`${styles.policyBadge} ${p.badgeStyle === 'warning' ? 'badge-amber' : 'badge-green'}`}>
                      {p.status}
                    </span>
                  </div>
                  
                  <h4 className={styles.policyTitle}>{p.title}</h4>
                  
                  <div className={styles.policyDetails}>
                    <span>Coverage</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{p.coverage}</strong>
                  </div>

                  <div className={styles.policyRenewal}>
                    <span>Renewal</span>
                    <span className={styles.policyRenewalVal}>{p.renewal}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Meetings Section */}
          <section id="meetings" className={styles.sectionCard + ' ' + styles.sectionAnchor}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Calendar className={styles.sectionTitleIcon} size={20} />
                <span>Upcoming Meetings</span>
              </h3>
            </div>

            <div className={styles.timeline}>
              {INITIAL_MEETINGS.map(m => (
                <div key={m.id} className={styles.timelineItem}>
                  <div className={styles.dateGridBox}>
                    <span className={styles.dateDay}>{m.date}</span>
                    <span className={styles.dateMonth}>{m.month}</span>
                  </div>

                  <div className={styles.meetingCard}>
                    <div className={styles.meetingInfo}>
                      <h4 className={styles.meetingTitle}>{m.title}</h4>
                      <div className={styles.meetingMeta}>
                        <div className={styles.meetingMetaItem}>
                          <User size={13} />
                          <span>{m.advisor}</span>
                        </div>
                        <div className={styles.meetingMetaItem}>
                          <Clock size={13} />
                          <span>{m.time}</span>
                        </div>
                      </div>
                    </div>

                    {m.active ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => { setVideoCallOpen(true); }}
                      >
                        <Video size={13} />
                        Join now
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Scheduled
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tasks columns pending/completed */}
          <section id="tasks" className={styles.sectionCard + ' ' + styles.sectionAnchor}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Check className={styles.sectionTitleIcon} size={20} />
                <span>Tasks & Action Center</span>
              </h3>
            </div>

            <div className={styles.twoColGrid}>
              {/* Pending Tasks */}
              <div className={styles.taskColumn}>
                <h4 className={styles.colHeader + ' ' + styles.colHeaderPending}>
                  <span>Pending</span>
                  <span className={styles.badgeCount}>{pendingTasks.length}</span>
                </h4>
                
                {pendingTasks.map(t => (
                  <div 
                    key={t.id} 
                    id={t.id}
                    className={`${styles.taskCard} ${t.overdue ? styles.taskCardOverdue : styles.taskCardPending}`}
                  >
                    <div className={styles.taskCardText}>
                      <h5 className={styles.taskCardTitle}>{t.title}</h5>
                      <span className={styles.taskCardDue}>
                        <Clock size={12} />
                        <span className={t.overdue ? styles.taskCardOverdueText : ''}>{t.due}</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      {isUploadingId === t.id ? (
                        <div className={styles.uploadSpinnerOverlay}>
                          <span className={styles.spinner} />
                          Uploading payslip...
                        </div>
                      ) : t.action === 'upload' ? (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUploadTask(t.id, t.notifId)}
                        >
                          <Upload size={13} />
                          Upload
                        </button>
                      ) : (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenSignature(t.id)}
                        >
                          <PenTool size={13} />
                          Sign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {pendingTasks.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    All caught up! No pending tasks.
                  </p>
                )}
              </div>

              {/* Completed Tasks */}
              <div className={styles.taskColumn}>
                <h4 className={styles.colHeader + ' ' + styles.colHeaderCompleted}>
                  <span>Completed</span>
                  <span className={styles.badgeCount}>{completedTasks.length}</span>
                </h4>
                
                {completedTasks.map(t => (
                  <div 
                    key={t.id} 
                    className={styles.taskCard + ' ' + styles.taskCardCompleted + ' ' + styles.taskAnimateEnter}
                  >
                    <div className={styles.taskCardText}>
                      <h5 className={styles.taskCardTitle}>{t.title}</h5>
                      <span className={styles.taskCardDue}>
                        <Check size={12} style={{ color: 'var(--success)' }} />
                        <span className={styles.taskCardCompletedText}>Completed {t.completedDate}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Document Center section */}
          <section id="documents" className={styles.sectionCard + ' ' + styles.sectionAnchor}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <FileText className={styles.sectionTitleIcon} size={20} />
                <span>Document Center</span>
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleDocUploadClick}
              >
                <Upload size={13} />
                Upload Document
              </button>
            </div>

            <div className={styles.docGrid}>
              {documents.map(d => (
                <div key={d.id} className={styles.docCard}>
                  <div className={styles.docIconWrap}>
                    <FileText size={18} />
                  </div>
                  <div className={styles.docText}>
                    <span className={styles.docName}>{d.name}</span>
                    <span className={styles.docMeta}>{d.category} &bull; {d.date}</span>
                  </div>
                  <button 
                    className={styles.docDlBtn}
                    onClick={() => handleDownload(d.name, `${d.category} - ${d.name}`)}
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Advisor Chat Tab */
        <div className={styles.tabContentCard}>
          <div className={styles.inlineChatWrapper}>
            <ChatWidget isInline={true} />
          </div>
        </div>
      )}

    </div>
  );
}
