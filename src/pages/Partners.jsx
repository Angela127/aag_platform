import { useState, useEffect } from 'react';
import {
  Handshake, Search, Filter, Star, MapPin, Phone, Mail,
  MessageSquare, Award, AlertCircle, ThumbsUp, ChevronDown, UserCheck,
  Send, Info, ExternalLink, X, Check
} from 'lucide-react';
import styles from './Partners.module.css';
import { collection, getDocs, setDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

// Initial Mock Data
const INITIAL_PARTNERS = [
  {
    id: 'p1',
    name: 'Lighthouse Legal Partners',
    category: 'Lawyer',
    bio: 'Lighthouse Legal is a premier boutique law firm specializing in estate planning, asset protection, and trust services for high-net-worth individuals.',
    expertise: ['Estate Planning', 'Will Writing', 'Family Trust'],
    location: 'Central',
    availability: 'Available Today',
    rating: 4.8,
    reliability: 98,
    totalReferrals: 18,
    successRate: 94,
    lastCollaboration: '2026-06-10',
    contactMethod: { email: 'info@lighthouselegal.com.sg', phone: '+65 6789 0123', whatsapp: '+65 9876 5432' },
    calendarSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM']
  },
  {
    id: 'p2',
    name: 'Apex Tax Advisors',
    category: 'Tax Consultant',
    bio: 'Apex Tax Advisors provides comprehensive tax consulting and compliance services, helping clients minimize liabilities and restructure corporate holdings.',
    expertise: ['Tax Planning', 'Corporate Tax', 'Cross-Border Wealth'],
    location: 'Central',
    availability: 'Available Tomorrow',
    rating: 4.7,
    reliability: 96,
    totalReferrals: 24,
    successRate: 91,
    lastCollaboration: '2026-05-18',
    contactMethod: { email: 'consult@apextax.com', phone: '+65 6123 4567', whatsapp: '+65 9111 2222' },
    calendarSlots: ['10:00 AM', '01:30 PM', '03:00 PM']
  },
  {
    id: 'p3',
    name: 'PropNex Premium Realty',
    category: 'Property Agent',
    bio: 'Specialist real estate consultants dealing with luxury residential, commercial investments, and property restructuring for diversified portfolios.',
    expertise: ['Property Purchase', 'Real Estate Sales', 'Property Valuation'],
    location: 'East',
    availability: 'Available Today',
    rating: 4.6,
    reliability: 92,
    totalReferrals: 32,
    successRate: 88,
    lastCollaboration: '2026-06-15',
    contactMethod: { email: 'agent.propnex@premiumrealty.sg', phone: '+65 9123 4567', whatsapp: '+65 9123 4567' },
    calendarSlots: ['09:00 AM', '11:30 AM', '02:30 PM', '05:00 PM']
  },
  {
    id: 'p4',
    name: 'Raffles Medical Specialist',
    category: 'Medical',
    bio: 'A leading private medical center providing premium executive health screenings, specialist care, and long-term wellness consulting.',
    expertise: ['Health Screening', 'Cardiology', 'Corporate Healthcare'],
    location: 'Central',
    availability: 'Available Today',
    rating: 4.9,
    reliability: 99,
    totalReferrals: 41,
    successRate: 97,
    lastCollaboration: '2026-06-01',
    contactMethod: { email: 'referrals@rafflesmed.com', phone: '+65 6321 8888', whatsapp: '+65 8222 3333' },
    calendarSlots: ['08:30 AM', '10:00 AM', '11:00 AM', '03:30 PM']
  },
  {
    id: 'p5',
    name: 'Vanguard Legal Associates',
    category: 'Lawyer',
    bio: 'Vanguard Legal specializes in elder law, simple wills, power of attorney, and affordable estate management services.',
    expertise: ['Will Writing', 'Power of Attorney', 'Estate Planning'],
    location: 'West',
    availability: 'Available Today',
    rating: 4.3,
    reliability: 88,
    totalReferrals: 12,
    successRate: 83,
    lastCollaboration: '2026-04-12',
    contactMethod: { email: 'vanguard@legalassoc.sg', phone: '+65 6876 5432', whatsapp: '+65 8333 4444' },
    calendarSlots: ['02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: 'p6',
    name: 'Summit Tax & Audit',
    category: 'Tax Consultant',
    bio: 'Providing personal tax filings, business audits, and GST consultations for local SMEs and sole proprietors.',
    expertise: ['Tax Planning', 'Personal Income Tax', 'GST Filing'],
    location: 'North',
    availability: 'Available Today',
    rating: 4.4,
    reliability: 90,
    totalReferrals: 15,
    successRate: 86,
    lastCollaboration: '2026-05-30',
    contactMethod: { email: 'admin@summitax.sg', phone: '+65 6456 7890', whatsapp: '+65 9444 5555' },
    calendarSlots: ['11:00 AM', '02:00 PM']
  },
  {
    id: 'p7',
    name: 'ERA Luxury Homes Group',
    category: 'Property Agent',
    bio: 'Boutique brokerage helping clients curate and build robust commercial and luxury residential real estate portfolios.',
    expertise: ['Property Purchase', 'Commercial Investment', 'Real Estate Sales'],
    location: 'Central',
    availability: 'Available Next Week',
    rating: 4.5,
    reliability: 91,
    totalReferrals: 19,
    successRate: 89,
    lastCollaboration: '2026-05-10',
    contactMethod: { email: 'referrals@era-luxury.com.sg', phone: '+65 6333 9999', whatsapp: '+65 9555 6666' },
    calendarSlots: ['01:30 PM', '03:30 PM']
  },
  {
    id: 'p8',
    name: 'Parkway Health Diagnostics',
    category: 'Medical',
    bio: 'Advanced diagnostic screenings and custom health management profiles for busy business leaders and professionals.',
    expertise: ['Health Screening', 'Oncology Screening', 'Executive Health'],
    location: 'East',
    availability: 'Available Tomorrow',
    rating: 4.7,
    reliability: 97,
    totalReferrals: 22,
    successRate: 95,
    lastCollaboration: '2026-06-11',
    contactMethod: { email: 'diagnostics@parkway.sg', phone: '+65 6777 5555', whatsapp: '+65 9666 7777' },
    calendarSlots: ['09:00 AM', '10:30 AM', '02:00 PM']
  }
];

const INITIAL_CLIENTS = [
  { id: 'c1', name: 'John Tan', email: 'john.tan@gmail.com', phone: '+65 9182 7364', needs: ['Estate Planning', 'Will Writing'], needsSummary: 'Needs a professional to draft a comprehensive will and establish a family trust for legacy planning.' },
  { id: 'c2', name: 'Sarah Lim', email: 'sarah.lim@outlook.com', phone: '+65 8273 6451', needs: ['Tax Planning', 'Corporate Tax'], needsSummary: 'Requires restructuring advice for holding companies to optimize corporate and personal tax outcomes.' },
  { id: 'c3', name: 'David Wong', email: 'david.wong@techcorp.io', phone: '+65 9364 5182', needs: ['Property Purchase', 'Real Estate Sales'], needsSummary: 'Looking to liquidate an existing commercial asset and acquire a freehold residential property.' },
  { id: 'c4', name: 'Emily Chen', email: 'emily.chen@hotmail.com', phone: '+65 9451 8273', needs: ['Health Screening', 'Cardiology'], needsSummary: 'Seeking premium executive health screening with follow-up cardiovascular risk assessments.' },
  { id: 'c5', name: 'Michael Koh', email: 'michael.koh@yahoo.com', phone: '+65 8518 2736', needs: ['Will Writing', 'Family Trust'], needsSummary: 'Interested in asset protection trusts and appointing secondary power of attorneys.' },
  { id: 'c6', name: 'Clara Song', email: 'clara.song@mediaprod.sg', phone: '+65 9645 1122', needs: ['Tax Planning', 'Estate Planning'], needsSummary: 'Needs complex personal tax planning alongside asset structuring for cross-border investments.' }
];

const INITIAL_REFERRALS = [
  {
    id: 'ref1',
    clientId: 'c1',
    clientName: 'John Tan',
    partnerId: 'p1',
    partnerName: 'Lighthouse Legal Partners',
    dateInitiated: '2026-06-10',
    status: 'Meeting Scheduled',
    notes: 'First consultation set for June 22. John wants to discuss setting up a family trust.',
    rating: null,
    feedback: ''
  },
  {
    id: 'ref2',
    clientId: 'c2',
    clientName: 'Sarah Lim',
    partnerId: 'p2',
    partnerName: 'Apex Tax Advisors',
    dateInitiated: '2026-05-18',
    status: 'Completed',
    notes: 'Completed restructuring of holding company. Sarah left very satisfied.',
    rating: 5,
    feedback: 'Exceptional tax strategies provided. Smooth communication.'
  },
  {
    id: 'ref3',
    clientId: 'c3',
    clientName: 'David Wong',
    partnerId: 'p3',
    partnerName: 'PropNex Premium Realty',
    dateInitiated: '2026-06-15',
    status: 'Accepted',
    notes: 'PropNex team is doing property valuations for Davids penthouse.'
  },
  {
    id: 'ref4',
    clientId: 'c4',
    clientName: 'Emily Chen',
    partnerId: 'p4',
    partnerName: 'Raffles Medical Specialist',
    dateInitiated: '2026-06-01',
    status: 'Closed',
    notes: 'Screening finished. Advisor received diagnostic report for portfolio records.',
    rating: 4,
    feedback: 'Efficient screening and clear results report. Highly reliable.'
  }
];

export default function Partners() {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'history'
  
  // Loaded State
  const [partners, setPartners] = useState([]);
  const [clients, setClients] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client Selection Context
  const [selectedClientId, setSelectedClientId] = useState('c1');
  const [selectedNeed, setSelectedNeed] = useState('All');

  // Reset selected need when active client changes
  useEffect(() => {
    setSelectedNeed('All');
  }, [selectedClientId]);
  
  // Directory Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExpertise, setFilterExpertise] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  // Modal / Detail States
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referringPartner, setReferringPartner] = useState(null);
  const [referralNote, setReferralNote] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load and Seed Firestore Database
  useEffect(() => {
    const checkAndSeed = async () => {
      try {
        const partnersSnapshot = await getDocs(collection(db, 'partners'));
        const referralsSnapshot = await getDocs(collection(db, 'referrals'));

        let seedNeeded = false;
        
        // If partners collection is empty, seed it
        if (partnersSnapshot.empty) {
          seedNeeded = true;
          for (const partner of INITIAL_PARTNERS) {
            await setDoc(doc(db, 'partners', partner.id), partner);
          }
        }
        
        // If referrals collection is empty, seed it
        if (referralsSnapshot.empty) {
          seedNeeded = true;
          for (const referral of INITIAL_REFERRALS) {
            await setDoc(doc(db, 'referrals', referral.id), referral);
          }
        }

        if (seedNeeded) {
          console.log('Database successfully seeded with initial mock data!');
        }
      } catch (err) {
        console.error('Error seeding database: ', err);
      }
    };

    let active = true;
    let unsubs = [];

    const initDb = async () => {
      await checkAndSeed();
      if (!active) return;
      
      // Set up real-time listener for partners
      const unsubPartners = onSnapshot(collection(db, 'partners'), (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ ...docSnap.data(), id: docSnap.id });
        });
        if (active) setPartners(list);
      });
      unsubs.push(unsubPartners);

      // Set up real-time listener for referrals
      const unsubReferrals = onSnapshot(collection(db, 'referrals'), (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ ...docSnap.data(), id: docSnap.id });
        });
        list.sort((a, b) => b.id.localeCompare(a.id));
        if (active) setReferrals(list);
      });
      unsubs.push(unsubReferrals);

      // Set up listener for clients using the unified customers collection
      const unsubClients = onSnapshot(collection(db, 'customers'), (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ ...docSnap.data(), id: docSnap.id });
        });
        if (active) {
          setClients(list);
          setLoading(false);
        }
      });
      unsubs.push(unsubClients);
    };

    initDb();
    
    return () => {
      active = false;
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Calculate Matching Level dynamically based on selected client's needs
  // Calculate Matching Level dynamically based on selected client's needs
  const getMatchScore = (partner, client, targetNeed = 'All') => {
    if (!client) return 0;
    
    const activeNeeds = targetNeed === 'All' ? client.needs : [targetNeed];
    
    // Find matching expertise
    const matchingExpertise = partner.expertise.filter(exp => 
      activeNeeds.some(need => exp.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(exp.toLowerCase()))
    );

    let score = 0;
    
    // Core Domain Matching
    const domainMatchMap = {
      'Lawyer': ['estate planning', 'will writing', 'family trust', 'power of attorney', 'legal'],
      'Tax Consultant': ['tax planning', 'corporate tax', 'tax', 'personal income tax', 'gst filing'],
      'Property Agent': ['property purchase', 'real estate sales', 'property valuation', 'commercial investment'],
      'Medical': ['health screening', 'cardiology', 'diagnostics', 'executive health']
    };

    const partnerDomain = domainMatchMap[partner.category] || [];
    const clientNeedsLower = activeNeeds.map(n => n.toLowerCase());
    
    const matchesDomain = clientNeedsLower.some(need => 
      partnerDomain.some(term => need.includes(term) || term.includes(need))
    );

    if (matchesDomain) {
      score += 45; // Domain match base
    }

    // Expertise tags match weight
    if (activeNeeds.length > 0) {
      const overlapRatio = matchingExpertise.length / activeNeeds.length;
      score += Math.min(overlapRatio * 35, 35);
    }

    // Incorporate partner rating (out of 5 -> scale to 10%)
    score += (partner.rating / 5) * 10;

    // Incorporate partner reliability (scale to 10%)
    score += (partner.reliability / 100) * 10;

    return Math.min(Math.round(score), 99); // Max 99% match
  };

  // Recommendations Engine
  const recommendedPartners = [...partners]
    .map(p => ({ ...p, matchScore: getMatchScore(p, selectedClient, selectedNeed) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .filter(p => p.matchScore > 50)
    .slice(0, 3);

  // Handle Initiating referral
  const handleOpenReferral = (partner) => {
    setReferringPartner(partner);
    setReferralNote(`Referring client ${selectedClient?.name} for assistance with ${selectedClient?.needs.join(', ')}.`);
    setShowReferralModal(true);
  };

  const handleSendReferral = async () => {
    if (!referringPartner || !selectedClient) return;

    const refId = `ref_${Date.now()}`;
    const newReferral = {
      id: refId,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      partnerId: referringPartner.id,
      partnerName: referringPartner.name,
      dateInitiated: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      notes: referralNote,
      rating: null,
      feedback: ''
    };

    try {
      await setDoc(doc(db, 'referrals', refId), newReferral);

      await updateDoc(doc(db, 'partners', referringPartner.id), {
        totalReferrals: referringPartner.totalReferrals + 1,
        lastCollaboration: new Date().toISOString().slice(0, 10)
      });

      setShowReferralModal(false);
      setReferringPartner(null);
      setReferralNote('');
      triggerToast(`Referral successfully initiated for ${selectedClient.name} with ${referringPartner.name}!`);
    } catch (err) {
      console.error('Error sending referral: ', err);
      triggerToast('Error connecting to database. Please try again.');
    }
  };


  // Availability calendar slots selection
  const [selectedSlot, setSelectedSlot] = useState(null);
  const handleBookSlot = (slot, partner) => {
    setSelectedSlot(slot);
    triggerToast(`Booking consultation at ${slot} with ${partner.name}`);
  };

  // Filter calculations & arrange by match percentage
  const filteredPartners = partners
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterExpertise === 'All' || p.category === filterExpertise;
      const matchesLocation = filterLocation === 'All' || p.location === filterLocation;
      const matchesAvailability = filterAvailability === 'All' || p.availability.includes(filterAvailability);
      
      let matchesRating = true;
      if (filterRating !== 'All') {
        const minVal = parseFloat(filterRating);
        matchesRating = p.rating >= minVal;
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesAvailability && matchesRating;
    })
    .map(p => ({
      ...p,
      matchScore: getMatchScore(p, selectedClient, selectedNeed)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const detailedPartner = partners.find(p => p.id === selectedPartnerId);

  // Statistics for Collaboration Tab
  const totalCompletedOutcome = referrals.filter(r => r.status === 'Completed').length;
  const overallSuccessRate = referrals.length > 0 
    ? Math.round((totalCompletedOutcome / referrals.length) * 100) 
    : 100;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%',
          border: '4px solid var(--aag-accent)',
          borderTopColor: 'var(--aag-primary)',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Connecting to Cloud Firestore...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <div className={styles.toastInner}>
            <Check size={16} className={styles.toastIcon} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <Handshake size={32} className={styles.titleIcon} />
            Partnership Ecosystem
          </h1>
          <p className={styles.subtitle}>
            Connect clients with trusted external specialists. Initiate referrals, audit status pipelines, and track performance records.
          </p>
        </div>

        {/* Global tab nav */}
        <div className={styles.tabsNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'directory' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            <Search size={15} /> Partner Directory
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'history' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Award size={15} /> Collaboration History
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentLayout}>
        {activeTab === 'directory' && (
          <>
            {/* Sidebar Context & Filters */}
            <aside className={styles.sidebar}>
              {/* Client Selection Context */}
              <div className={`${styles.card} ${styles.contextBox}`}>
                <div className={styles.contextHeader}>
                  <UserCheck size={16} className={styles.contextIcon} />
                  <h3>Client Needs Context</h3>
                </div>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label" htmlFor="client-context">Active Client</label>
                  <div className={styles.selectWrap}>
                    <select
                      id="client-context"
                      className="form-input"
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className={styles.selectChevron} />
                  </div>
                </div>

                {selectedClient && (
                  <div className={styles.clientDetails}>
                    <p className={styles.clientBio} style={{ marginBottom: 6 }}>
                      <strong>Active Needs:</strong>
                    </p>
                    <div className={styles.clientTags} style={{ marginBottom: 12 }}>
                      {selectedClient.needs.map(n => (
                        <span key={n} className={`badge ${selectedNeed === 'All' || selectedNeed === n ? 'badge-blue' : 'badge-gray'}`}>
                          {n}
                        </span>
                      ))}
                    </div>

                    {selectedClient.needs.length > 1 && (
                      <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label" style={{ fontSize: '0.8rem' }} htmlFor="target-need-select">Target Need/Plan</label>
                        <div className={styles.selectWrap}>
                          <select
                            id="target-need-select"
                            className="form-input"
                            style={{ padding: '8px 10px', fontSize: '0.8rem' }}
                            value={selectedNeed}
                            onChange={(e) => setSelectedNeed(e.target.value)}
                          >
                            <option value="All">All Active Needs ({selectedClient.needs.length})</option>
                            {selectedClient.needs.map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className={styles.selectChevron} />
                        </div>
                      </div>
                    )}

                    <p className={styles.clientBio}>
                      <strong>Requirement:</strong> {selectedClient.needsSummary}
                    </p>
                  </div>
                )}

                {/* Recommendation Engine results inside Context Sidebar */}
                <div className={styles.recEngine}>
                  <h4 className={styles.recTitle}>
                    <Award size={14} style={{ color: 'var(--aag-primary)' }} />
                    Recommended Partners
                  </h4>
                  <div className={styles.recList}>
                    {recommendedPartners.map(p => (
                      <div key={p.id} className={styles.recCard}>
                        <div className={styles.recTop}>
                          <span className={styles.recName} onClick={() => setSelectedPartnerId(p.id)}>
                            {p.name}
                          </span>
                          <span className={styles.matchScore}>
                            {p.matchScore}% Match
                          </span>
                        </div>
                        <div className={styles.recSub}>
                          <span>{p.category}</span>
                          <span>•</span>
                          <span className={styles.starText}>
                            <Star size={11} fill="currentColor" /> {p.rating}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
                          onClick={() => handleOpenReferral(p)}
                        >
                          <Send size={12} /> Refer {selectedClient?.name}
                        </button>
                      </div>
                    ))}
                    {recommendedPartners.length === 0 && (
                      <div className={styles.emptyState} style={{ padding: 12 }}>
                        {"No specific match exceeds 50% for this client's current profile tags."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Directory Filter Panel */}
              <div className={`${styles.card} ${styles.filterPanel}`}>
                <div className={styles.contextHeader}>
                  <Filter size={16} />
                  <h3>Directory Filters</h3>
                </div>

                <div className={styles.filterList}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="filter-expertise">Expertise Domain</label>
                    <div className={styles.selectWrap}>
                      <select
                        id="filter-expertise"
                        className="form-input"
                        value={filterExpertise}
                        onChange={(e) => setFilterExpertise(e.target.value)}
                      >
                        <option value="All">All Categories</option>
                        <option value="Lawyer">Lawyer</option>
                        <option value="Tax Consultant">Tax Consultant</option>
                        <option value="Property Agent">Property Agent</option>
                        <option value="Medical">Medical Specialists</option>
                      </select>
                      <ChevronDown size={14} className={styles.selectChevron} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="filter-location">Location</label>
                    <div className={styles.selectWrap}>
                      <select
                        id="filter-location"
                        className="form-input"
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                      >
                        <option value="All">All Locations</option>
                        <option value="Central">Central</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North">North</option>
                      </select>
                      <ChevronDown size={14} className={styles.selectChevron} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="filter-availability">Availability</label>
                    <div className={styles.selectWrap}>
                      <select
                        id="filter-availability"
                        className="form-input"
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value)}
                      >
                        <option value="All">Any Availability</option>
                        <option value="Today">Available Today</option>
                        <option value="Tomorrow">Available Tomorrow</option>
                      </select>
                      <ChevronDown size={14} className={styles.selectChevron} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="filter-rating">Minimum Rating</label>
                    <div className={styles.selectWrap}>
                      <select
                        id="filter-rating"
                        className="form-input"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                      >
                        <option value="All">Any Rating</option>
                        <option value="4.8">4.8+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                      </select>
                      <ChevronDown size={14} className={styles.selectChevron} />
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      setFilterExpertise('All');
                      setFilterLocation('All');
                      setFilterAvailability('All');
                      setFilterRating('All');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Partner Directory List */}
            <main className={styles.mainContent}>
              <div className={styles.searchBarWrap}>
                <Search className={styles.searchIcon} size={18} />
                <input
                  type="text"
                  placeholder="Search partners by name, expertise, or tags..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.directoryGrid}>
                {filteredPartners.map(p => {
                  const matchScore = p.matchScore;
                  return (
                    <div key={p.id} className={styles.partnerCardItem}>
                      <div className={styles.partnerCardTop}>
                        <div>
                          <span className={`${styles.categoryBadge} ${styles[`badge_${p.category.replace(' ', '')}`]}`}>
                            {p.category}
                          </span>
                          <h3 className={styles.partnerName} onClick={() => setSelectedPartnerId(p.id)}>
                            {p.name}
                          </h3>
                        </div>
                        {selectedClient && (
                          <div className={`${styles.scorePill} ${matchScore >= 85 ? styles.scoreHigh : matchScore >= 70 ? styles.scoreMedium : styles.scoreLow}`}>
                            {matchScore}% match
                          </div>
                        )}
                      </div>

                      <p className={styles.partnerBioShort}>
                        {p.bio.substring(0, 105)}...
                      </p>

                      <div className={styles.expertiseList}>
                        {p.expertise.map(exp => (
                          <span key={exp} className={styles.expTag}>
                            {exp}
                          </span>
                        ))}
                      </div>

                      <div className={styles.partnerStatsSummary}>
                        <div className={styles.statMini}>
                          <Star size={13} className={styles.starIcon} fill="currentColor" />
                          <span><strong>{p.rating}</strong> ({p.totalReferrals} refs)</span>
                        </div>
                        <div className={styles.statMini}>
                          <ThumbsUp size={12} style={{ color: 'var(--success)' }} />
                          <span>Reliability: <strong>{p.reliability}%</strong></span>
                        </div>
                        <div className={styles.statMini}>
                          <MapPin size={12} />
                          <span>{p.location}</span>
                        </div>
                      </div>

                      <div className={styles.partnerCardFooter}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => setSelectedPartnerId(p.id)}
                        >
                          <Info size={13} /> View Profile
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => handleOpenReferral(p)}
                        >
                          <Send size={13} /> Send Referral
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredPartners.length === 0 && (
                  <div className={styles.emptyContainer}>
                    <AlertCircle size={40} className={styles.emptyIcon} />
                    <h3>No partners found</h3>
                    <p>Try modifying your search criteria or checking different filter combinations.</p>
                  </div>
                )}
              </div>
            </main>
          </>
        )}



        {/* Tab 3: Collaboration History */}
        {activeTab === 'history' && (
          <div className={styles.historyContainer}>
            {/* Overview Row */}
            <div className={styles.historyOverviewGrid}>
              <div className={`${styles.card} ${styles.overviewCard}`}>
                <h3>Success Ratio</h3>
                <div className={styles.overviewValue}>{overallSuccessRate}%</div>
                <p>Ratio of referral contracts transitioned to Completed status</p>
              </div>
              <div className={`${styles.card} ${styles.overviewCard}`}>
                <h3>Total Referrals</h3>
                <div className={styles.overviewValue}>{referrals.length}</div>
                <p>Referral introductions facilitated across the network</p>
              </div>
              <div className={`${styles.card} ${styles.overviewCard}`}>
                <h3>Active Partners</h3>
                <div className={styles.overviewValue}>{partners.length}</div>
                <p>Specialists vetted and cataloged in your directory</p>
              </div>
            </div>

            {/* Performance Audit Table */}
            <div className={`${styles.card} ${styles.historyTableCard}`}>
              <div className={styles.historyTableHeader}>
                <h3>Partners Network Audit</h3>
              </div>
              <div className={styles.tableResponsive}>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Specialist Partner</th>
                      <th>Category</th>
                      <th>Total Referrals</th>
                      <th>Success Rate</th>
                      <th>Average Rating</th>
                      <th>Reliability Score</th>
                      <th>Last Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map(p => (
                      <tr key={p.id}>
                        <td>
                          <span
                            className={styles.tablePartnerName}
                            onClick={() => setSelectedPartnerId(p.id)}
                          >
                            {p.name}
                          </span>
                        </td>
                        <td>
                          <span className={styles.tableCategoryBadge}>
                            {p.category}
                          </span>
                        </td>
                        <td>{p.totalReferrals} referrals</td>
                        <td>{p.successRate}%</td>
                        <td>
                          <span className={styles.starText}>
                            <Star size={13} fill="currentColor" /> {p.rating}
                          </span>
                        </td>
                        <td>
                          <div className={styles.tableReliabilityBar}>
                            <div className={styles.reliabilityProgress} style={{ width: `${p.reliability}%` }} />
                            <span>{p.reliability}%</span>
                          </div>
                        </td>
                        <td>{p.lastCollaboration}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedPartnerId(p.id)}
                          >
                            Profile Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Send Referral Modal */}
      {showReferralModal && referringPartner && (
        <div className="overlay" style={{ zIndex: 1000 }}>
          <div className={`${styles.card} ${styles.modalCard} animate-scalein`}>
            <div className={styles.modalHeader}>
              <h3>Initiate Client Referral</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowReferralModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalSummaryBox}>
                <div style={{ marginBottom: 8 }}>
                  <span className={styles.modalLabel}>Client to Refer</span>
                  <strong>{selectedClient?.name}</strong> ({selectedClient?.email})
                </div>
                <div>
                  <span className={styles.modalLabel}>To Partner Specialist</span>
                  <strong>{referringPartner.name}</strong> ({referringPartner.category})
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label" htmlFor="ref-notes-input">Referral Notes / Context</label>
                <textarea
                  id="ref-notes-input"
                  className="form-input"
                  style={{ height: 100, resize: 'vertical' }}
                  value={referralNote}
                  onChange={(e) => setReferralNote(e.target.value)}
                  placeholder="Outline the client's current situation, deadlines, or preferred meeting times..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReferralModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSendReferral}>
                <Send size={13} /> Dispatch Referral Contract
              </button>
            </div>
          </div>
        </div>
      )}



      {/* DRAWER: Partner Detailed Profile Page */}
      {selectedPartnerId && detailedPartner && (
        <div className={styles.drawerBackdrop} onClick={() => setSelectedPartnerId(null)}>
          <div className={styles.drawerCard} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div>
                <span className={`${styles.categoryBadge} ${styles[`badge_${detailedPartner.category.replace(' ', '')}`]}`}>
                  {detailedPartner.category}
                </span>
                <h2 className={styles.drawerName}>{detailedPartner.name}</h2>
              </div>
              <button className={styles.drawerCloseBtn} onClick={() => setSelectedPartnerId(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className={styles.drawerBody}>
              {/* Profile Bio Section */}
              <div className={styles.drawerSection}>
                <h3 className={styles.sectionTitle}>Corporate Bio</h3>
                <p className={styles.drawerBioText}>{detailedPartner.bio}</p>
                
                <div className={styles.expertiseList} style={{ marginTop: 12 }}>
                  {detailedPartner.expertise.map(exp => (
                    <span key={exp} className={styles.expTag} style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Collaboration Statistics */}
              <div className={styles.drawerSection}>
                <h3 className={styles.sectionTitle}>Vetting & Collaboration Stats</h3>
                <div className={styles.statsCardGrid}>
                  <div className={styles.drawerStatBox}>
                    <span className={styles.statLabel}>Referrals Sent</span>
                    <strong className={styles.statVal}>{detailedPartner.totalReferrals}</strong>
                  </div>
                  <div className={styles.drawerStatBox}>
                    <span className={styles.statLabel}>Success Ratio</span>
                    <strong className={styles.statVal}>{detailedPartner.successRate}%</strong>
                  </div>
                  <div className={styles.drawerStatBox}>
                    <span className={styles.statLabel}>Reliability Score</span>
                    <strong className={styles.statVal} style={{ color: 'var(--success)' }}>
                      {detailedPartner.reliability}%
                    </strong>
                  </div>
                  <div className={styles.drawerStatBox}>
                    <span className={styles.statLabel}>Vetted Rating</span>
                    <strong className={styles.statVal} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={16} fill="currentColor" style={{ color: '#d97706' }} />
                      {detailedPartner.rating}
                    </strong>
                  </div>
                </div>
                <div className={styles.lastActiveDate}>
                  Last collaboration date: <strong>{detailedPartner.lastCollaboration}</strong>
                </div>
              </div>

              {/* Availability Calendar */}
              <div className={styles.drawerSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Availability Calendar</h3>
                  <span className="badge badge-green">{detailedPartner.availability}</span>
                </div>
                <p className={styles.drawerCalendarDesc}>
                  Select an available consultation slot below to book a joint video briefing with your client.
                </p>

                {/* Simulated Days Grid */}
                <div className={styles.calendarGrid}>
                  {['Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26'].map((day, idx) => (
                    <div key={day} className={styles.calendarDayCol}>
                      <div className={styles.calendarDayHeader}>{day}</div>
                      <div className={styles.calendarDaySlots}>
                        {detailedPartner.calendarSlots.slice(0, 3).map((slot, sIdx) => {
                          const isBooked = (idx + sIdx) % 3 === 0; // Simulate some booked slots
                          const slotLabel = `${slot.split(' ')[0]} ${idx % 2 === 0 ? 'AM' : 'PM'}`;
                          return (
                            <button
                              key={slotLabel + sIdx}
                              disabled={isBooked}
                              className={`${styles.calendarSlotBtn} ${isBooked ? styles.slotBooked : ''} ${selectedSlot === slotLabel ? styles.slotSelected : ''}`}
                              onClick={() => handleBookSlot(slotLabel, detailedPartner)}
                            >
                              {isBooked ? 'Booked' : slotLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Contact Details */}
              <div className={styles.drawerSection} style={{ borderBottom: 'none' }}>
                <h3 className={styles.sectionTitle}>Contact & Referral Portal</h3>
                <div className={styles.contactMethodList}>
                  <a href={`mailto:${detailedPartner.contactMethod.email}`} className={styles.contactLink}>
                    <Mail size={16} />
                    <span>{detailedPartner.contactMethod.email}</span>
                    <ExternalLink size={12} className={styles.contactArrow} />
                  </a>
                  <a href={`tel:${detailedPartner.contactMethod.phone}`} className={styles.contactLink}>
                    <Phone size={16} />
                    <span>{detailedPartner.contactMethod.phone}</span>
                    <ExternalLink size={12} className={styles.contactArrow} />
                  </a>
                  <a
                    href={`https://wa.me/${detailedPartner.contactMethod.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.contactLink}
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp Chat ({detailedPartner.contactMethod.whatsapp})</span>
                    <ExternalLink size={12} className={styles.contactArrow} />
                  </a>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className={styles.drawerFooter}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setSelectedPartnerId(null)}
              >
                Close Profile
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  setSelectedPartnerId(null);
                  handleOpenReferral(detailedPartner);
                }}
              >
                <Send size={13} /> Initiate Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
