import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, MessageSquare, Briefcase, Loader2, AlertTriangle, FileText, Brain, Users, CheckCircle2, X } from 'lucide-react';
import { db } from '../lib/firebase.js';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import HealthScore from '../components/HealthScore.jsx';
import ProfileSimilarity from '../components/ProfileSimilarity.jsx';
import ClientMemory from '../components/ClientMemory.jsx';
import MemoryChat from '../components/MemoryChat.jsx';
import PolicyCard from '../components/PolicyCard.jsx';
import ExpenseTracker from '../components/ExpenseTracker.jsx';
import FollowUpCard from '../components/FollowUpCard.jsx';
import EditClientModal from '../components/EditClientModal.jsx';
import QuestionnaireUpload from '../components/QuestionnaireUpload.jsx';
import QuestionnaireReviewForm from '../components/QuestionnaireReviewForm.jsx';
import { extractQuestionnaireData } from '../utils/questionnaireExtraction.js';

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
  if (score === undefined || score === null) return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Pending' };
  if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Healthy' };
  if (score >= 50) return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Needs Attention' };
  return { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk' };
}

function computeHealthScore(clientData) {
  if (!clientData.questionnaire) {
    return {
      healthScore: null,
      healthFactors: null
    };
  }

  const factors = clientData.healthFactors || {
    recentContact: true,
    planComplete: false,
    renewalSoon: false,
    outstandingFollowUps: 0
  };

  // Determine factors
  const hasContact = !!factors.recentContact;
  const hasPlans = (clientData.plans && clientData.plans.length > 0) || !!factors.planComplete;
  const noRenewalSoon = !factors.renewalSoon;
  const pendingFollowUps = (clientData.followUps || []).filter(f => !f.completed).length;
  const hasNoPendingFollowUps = pendingFollowUps === 0;
  const hasQuestionnaire = true;

  let score = 0;
  if (hasContact) score += 20;
  if (hasPlans) score += 20;
  if (noRenewalSoon) score += 20;
  if (hasNoPendingFollowUps) score += 20;
  if (hasQuestionnaire) score += 20;

  return {
    healthScore: score,
    healthFactors: {
      recentContact: hasContact,
      planComplete: hasPlans,
      renewalSoon: !noRenewalSoon,
      outstandingFollowUps: pendingFollowUps
    }
  };
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('snapshot');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionData, setExtractionData] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => {
        if (prev && prev.message === message) {
          return null;
        }
        return prev;
      });
    }, 4000);
  };

  const handleExtractionSuccess = async (rawText, filename) => {
    try {
      setIsExtracting(true);
      const extracted = await extractQuestionnaireData(rawText, client.name);
      setExtractionData(extracted);
      setIsReviewing(true);
    } catch (err) {
      console.error("Extraction process failed:", err);
      showNotification("Failed to parse extracted PDF text. Please check console.", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveQuestionnaire = async (formData) => {
    try {
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;
      const newTimelineEvent = {
        date: formattedDate,
        category: 'Life Event',
        description: 'Fact-Find Completed — Questionnaire submitted and processed.'
      };

      // Map questionnaire formData fields to root fields of the client document
      const rootUpdates = {
        nationality: formData.personalInfo?.nationality || '',
        maritalStatus: formData.personalInfo?.maritalStatus || '',
        gender: formData.personalInfo?.gender || '',
        mobileNumber: formData.personalInfo?.mobileNumbers?.[0] || '',
        dob: formData.personalInfo?.dateOfBirth || '',
        
        industry: formData.employmentInfo?.industry || '',
        yearsExperience: formData.employmentInfo?.yearsOfExperience || 0,
        employmentStatus: formData.employmentInfo?.employmentStatus || '',
        occupation: formData.employmentInfo?.occupation || '',
        companyName: formData.employmentInfo?.companyName || '',
        
        numDependents: formData.familyInfo?.numberOfDependents || 0,
        anyFamilyDependent: formData.familyInfo?.financiallyDependentMembers || 'No',
        familyDetails: formData.familyInfo?.summary || '',
        
        estimatedInvestableAssets: formData.financialInfo?.estimatedInvestableAssets || '',
        financialGoals: formData.financialInfo?.financialGoals || [],
        annualIncomeRange: formData.financialInfo?.annualIncomeRange || '',
        
        preferredLanguage: formData.communicationPreferences?.preferredLanguage || '',
        preferredConsultation: formData.communicationPreferences?.preferredConsultation || '',
      };

      const updatedClient = {
        ...client,
        ...rootUpdates,
        questionnaire: formData
      };
      const metrics = computeHealthScore(updatedClient);

      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, {
        ...rootUpdates,
        ...metrics,
        questionnaire: formData,
        memoryTimeline: arrayUnion(newTimelineEvent)
      });

      // Sync local state
      setClient(prev => ({
        ...prev,
        ...rootUpdates,
        ...metrics,
        questionnaire: formData,
        memoryTimeline: [...(prev.memoryTimeline || []), newTimelineEvent]
      }));

      setIsReviewing(false);
      setExtractionData(null);
      
      // Popup success notification
      showNotification("Fact-find questionnaire uploaded and client snapshot updated successfully!", "success");
      // Switch back to snapshot tab
      setActiveTab('snapshot');
    } catch (err) {
      console.error("Error saving questionnaire:", err);
      showNotification("Failed to save questionnaire data.", "error");
    }
  };

  const handleUpdateClient = async (updatedData) => {
    try {
      const updatedClient = {
        ...client,
        ...updatedData
      };
      const metrics = computeHealthScore(updatedClient);

      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, {
        ...updatedData,
        ...metrics
      });
      
      // Synchronize with questionnaires collection if it exists
      try {
        const questRef = doc(db, 'questionnaires', id);
        const questSnap = await getDoc(questRef);
        if (questSnap.exists()) {
          const questPayload = {
            nationality: updatedData.nationality,
            maritalStatus: updatedData.maritalStatus,
            gender: updatedData.gender,
            mobileNumber: updatedData.mobileNumber,
            dob: updatedData.dob,
            industry: updatedData.industry,
            yearsExperience: updatedData.yearsExperience,
            employmentStatus: updatedData.employmentStatus,
            occupation: updatedData.occupation,
            companyName: updatedData.companyName,
            numDependents: updatedData.numDependents,
            anyFamilyDependent: updatedData.anyFamilyDependent,
            familyDetails: updatedData.familyDetails,
            spouseName: updatedData.spouseName,
            childrenAges: updatedData.childrenAges,
            estimatedInvestableAssets: updatedData.estimatedInvestableAssets,
            financialGoals: updatedData.financialGoals,
            annualIncomeRange: updatedData.annualIncomeRange,
            preferredLanguage: updatedData.preferredLanguage,
            preferredConsultation: updatedData.preferredConsultation,
            updatedAt: new Date()
          };
          await updateDoc(questRef, questPayload);
          console.log("Questionnaire document successfully synchronized.");
        }
      } catch (questErr) {
        console.log("Questionnaire sync skipped:", questErr.message);
      }

      setClient((prev) => ({
        ...prev,
        ...updatedData,
        ...metrics
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error saving client edits:', err);
      showNotification('Failed to save client changes to the database.', 'error');
    }
  };

  // Fetch client details and all other clients from Firestore customers collection
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch current client details
        const docRef = doc(db, 'customers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const clientData = docSnap.data();
          let finalClient = { id: docSnap.id, ...clientData };
          
          if (clientData.healthScore === undefined) {
            const metrics = computeHealthScore(finalClient);
            await updateDoc(docRef, metrics);
            finalClient = { ...finalClient, ...metrics };
          }
          
          if (isMounted) {
            setClient(finalClient);
          }
        } else {
          if (isMounted) {
            setError('Client profile not found in database.');
          }
        }

        // 2. Fetch all other clients for similarity matching
        const querySnapshot = await getDocs(collection(db, 'customers'));
        const clientsList = [];
        querySnapshot.forEach((docVal) => {
          if (docVal.id !== id) {
            clientsList.push({ id: docVal.id, ...docVal.data() });
          }
        });
        if (isMounted) {
          setAllClients(clientsList);
        }
      } catch (err) {
        console.error('Error fetching client details/all clients:', err);
        if (isMounted) {
          setError('Failed to load client details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
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
      showNotification('Failed to add expense to database.', 'error');
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

      const updatedClient = {
        ...client,
        followUps: updatedFollowUps
      };
      const metrics = computeHealthScore(updatedClient);

      await updateDoc(docRef, {
        followUps: updatedFollowUps,
        ...metrics
      });

      // Sync local state
      setClient((prev) => ({
        ...prev,
        followUps: updatedFollowUps,
        ...metrics
      }));
    } catch (err) {
      console.error('Error toggling follow-up in Firestore:', err);
      showNotification('Failed to update follow-up task.', 'error');
    }
  };

  const handleAddFollowUp = async (newFollowUp) => {
    try {
      const docRef = doc(db, 'customers', id);
      const updatedFollowUps = [...(client.followUps || []), newFollowUp];

      const updatedClient = {
        ...client,
        followUps: updatedFollowUps
      };
      const metrics = computeHealthScore(updatedClient);

      await updateDoc(docRef, {
        followUps: updatedFollowUps,
        ...metrics
      });

      // Sync local state
      setClient((prev) => ({
        ...prev,
        followUps: updatedFollowUps,
        ...metrics
      }));
    } catch (err) {
      console.error('Error adding follow-up to Firestore:', err);
      showNotification('Failed to add follow-up task to database.', 'error');
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
  const badge = getScoreBadge(client.healthScore);

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
                {[client.occupation, client.age ? `${client.age} years old` : null].filter(Boolean).join(' · ') || 'New Client Profile'}
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
              onClick={() => setShowEditModal(true)}
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

      {/* Top Row: Snapshot / Questionnaire Tabbed Card (1/2) and AI Client Memory (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tabbed Card: Client Snapshot / Upload Questionnaire */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden flex flex-col min-h-[300px] lg:h-[300px]">
          {/* Decorative top subtle gradient bar */}
          <div className="h-0.5 bg-gradient-to-r from-aag-primary via-aag-primary-light to-aag-accent" />
          
          {/* Tabs Header */}
          <div className="border-b border-gray-100 flex items-center bg-gray-50/30">
            <button
              onClick={() => setActiveTab('snapshot')}
              className={`px-5 py-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'snapshot'
                  ? 'border-b-aag-primary text-aag-primary bg-white'
                  : 'border-b-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <Users size={14} className="text-aag-primary" />
              Client Snapshot
            </button>
            <button
              onClick={() => setActiveTab('questionnaire')}
              className={`px-5 py-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'questionnaire'
                  ? 'border-b-aag-primary text-aag-primary bg-white'
                  : 'border-b-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <FileText size={14} />
              Upload Questionnaire
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-grow flex flex-col min-h-0">
            {activeTab === 'snapshot' ? (
              <ClientMemory client={client} section="snapshot" hideShell={true} />
            ) : (
              <div className="p-4 flex-grow flex flex-col min-h-0">
                {isReviewing && extractionData ? (
                  <QuestionnaireReviewForm
                    initialData={extractionData}
                    onSave={handleSaveQuestionnaire}
                    onCancel={() => {
                      setIsReviewing(false);
                      setExtractionData(null);
                    }}
                  />
                ) : (
                  <QuestionnaireUpload
                    onExtractionStart={() => setIsExtracting(true)}
                    onExtractionSuccess={handleExtractionSuccess}
                    onExtractionError={(err) => {
                      setIsExtracting(false);
                      showNotification(err, 'error');
                    }}
                    isExtracting={isExtracting}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Client Memory (RAG) */}
        <ClientMemory client={client} section="ai-memory" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Plans & Policies */}
          <PolicyCard plans={client.plans} />

          {/* Memory Timeline */}
          <ClientMemory client={client} section="timeline" />

          {/* RAG Q&A Chat */}
          <MemoryChat client={client} />
        </div>

        {/* Right / Sidebar Column (1/3) */}
        <div className="space-y-6">
          {/* Health Score */}
          <HealthScore client={client} />

          {/* Profile Similarity Insights */}
          <ProfileSimilarity currentClient={client} allClients={allClients} />

          {/* Follow-ups */}
          <FollowUpCard
            followUps={client.followUps}
            onToggleFollowUp={handleToggleFollowUp}
            onAddFollowUp={handleAddFollowUp}
          />

          {/* Expense Tracker */}
          <ExpenseTracker initialExpenses={client.expenses} onAddExpense={handleAddExpense} />
        </div>
      </div>

      {/* Edit Client Modal */}
      <EditClientModal
        client={client}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateClient}
      />

      {/* Toast Notification */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
          }}
          className="animate-slideup"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 text-gray-400 cursor-pointer transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
