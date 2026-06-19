import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, MessageSquare, Briefcase, Loader2, AlertTriangle } from 'lucide-react';
import { db } from '../lib/firebase.js';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import HealthScore from '../components/HealthScore.jsx';
import ClientMemory from '../components/ClientMemory.jsx';
import MemoryChat from '../components/MemoryChat.jsx';
import PolicyCard from '../components/PolicyCard.jsx';
import ExpenseTracker from '../components/ExpenseTracker.jsx';
import FollowUpCard from '../components/FollowUpCard.jsx';
import ChatPanel from '../components/ChatPanel.jsx';

function getAvatarColor(name) {
  const colors = [
    'bg-aag-primary', 'bg-rose-600', 'bg-amber-600',
    'bg-emerald-600', 'bg-indigo-600', 'bg-violet-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getScoreBadge(score) {
  if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Healthy' };
  if (score >= 50) return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Needs Attention' };
  return { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk' };
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch client details from Firestore customers collection
  useEffect(() => {
    async function fetchClient() {
      try {
        const docRef = doc(db, 'customers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Client profile not found in database.');
        }
      } catch (err) {
        console.error('Error fetching client details:', err);
        setError('Failed to load client details.');
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [id]);

  const handleAddExpense = async (newExpense) => {
    try {
      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, {
        expenses: arrayUnion(newExpense)
      });
      // Sync local state
      setClient((prev) => ({
        ...prev,
        expenses: [newExpense, ...(prev.expenses || [])]
      }));
    } catch (err) {
      console.error('Error adding expense to Firestore:', err);
      alert('Failed to add expense to database.');
    }
  };

  const handleToggleFollowUp = async (taskIndex) => {
    try {
      const docRef = doc(db, 'customers', id);
      const updatedFollowUps = (client.followUps || []).map((f, idx) => {
        if (idx === taskIndex) {
          return { ...f, completed: !f.completed };
        }
        return f;
      });

      // Calculate new outstanding count
      const outstandingCount = updatedFollowUps.filter((f) => !f.completed).length;
      const updatedHealthFactors = {
        ...(client.healthFactors || {}),
        outstandingFollowUps: outstandingCount,
      };

      await updateDoc(docRef, {
        followUps: updatedFollowUps,
        healthFactors: updatedHealthFactors,
      });

      // Sync local state
      setClient((prev) => ({
        ...prev,
        followUps: updatedFollowUps,
        healthFactors: updatedHealthFactors,
      }));
    } catch (err) {
      console.error('Error toggling follow-up in Firestore:', err);
      alert('Failed to update follow-up task.');
    }
  };

  const handleAddFollowUp = async (newFollowUp) => {
    try {
      const docRef = doc(db, 'customers', id);
      const updatedFollowUps = [...(client.followUps || []), newFollowUp];

      // Calculate new outstanding count
      const outstandingCount = updatedFollowUps.filter((f) => !f.completed).length;
      const updatedHealthFactors = {
        ...(client.healthFactors || {}),
        outstandingFollowUps: outstandingCount,
      };

      await updateDoc(docRef, {
        followUps: updatedFollowUps,
        healthFactors: updatedHealthFactors,
      });

      // Sync local state
      setClient((prev) => ({
        ...prev,
        followUps: updatedFollowUps,
        healthFactors: updatedHealthFactors,
      }));
    } catch (err) {
      console.error('Error adding follow-up to Firestore:', err);
      alert('Failed to add follow-up task to database.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={36} className="text-aag-primary animate-spin" />
        <p className="text-sm text-gray-500">Loading client intelligence data...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-3">
          <AlertTriangle size={24} />
        </div>
        <p className="text-gray-500 text-sm mb-4">{error || 'Client not found.'}</p>
        <button
          onClick={() => navigate('/clients')}
          className="text-aag-primary hover:underline text-sm cursor-pointer"
        >
          Back to Client List
        </button>
      </div>
    );
  }

  const initials = client.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const avatarColor = getAvatarColor(client.name);
  const badge = getScoreBadge(client.healthScore || 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Back button */}
      <button
        id="back-to-clients"
        onClick={() => navigate('/clients')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-aag-primary mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Client List
      </button>

      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card mb-6 overflow-hidden animate-slide-up">
        <div className="h-1.5 bg-gradient-to-r from-aag-primary via-aag-primary-light to-aag-accent" />
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`${avatarColor} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}>
              {initials}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
                <span className={`${badge.bg} ${badge.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                <Briefcase size={13} className="text-gray-400" />
                {client.occupation} · {client.age} years old
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Risk Level: {client.riskLevel} · Last Contact: {client.lastContact}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="edit-client-btn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              Edit Client
            </button>
            <button
              id="message-client-btn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-aag-primary text-white text-sm font-medium hover:bg-aag-primary-dark transition-colors shadow-sm cursor-pointer"
            >
              <MessageSquare size={14} />
              Message Client
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Client Memory */}
          <ClientMemory client={client} />

          {/* RAG Q&A Chat */}
          <MemoryChat client={client} />

          {/* Active Plans */}
          <PolicyCard plans={client.plans} />

          {/* Expense Tracker */}
          <ExpenseTracker initialExpenses={client.expenses} onAddExpense={handleAddExpense} />
        </div>

        {/* Right / Sidebar Column (1/3) */}
        <div className="space-y-6">
          {/* Health Score */}
          <HealthScore client={client} />

          {/* Follow-ups */}
          <FollowUpCard
            followUps={client.followUps}
            onToggleFollowUp={handleToggleFollowUp}
            onAddFollowUp={handleAddFollowUp}
          />

          {/* Chat Panel */}
          <ChatPanel client={client} />
        </div>
      </div>
    </div>
  );
}
