import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, X, Filter, Users, HeartPulse, AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react';
import ClientCard from '../components/ClientCard.jsx';
import { db } from '../lib/firebase.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const FILTER_TABS = [
  { key: 'all', label: 'All Clients', icon: Users },
  { key: 'healthy', label: 'Healthy', icon: HeartPulse },
  { key: 'attention', label: 'Needs Attention', icon: AlertTriangle },
  { key: 'high-risk', label: 'High Risk', icon: ShieldAlert },
];

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    age: '',
    occupation: '',
    riskLevel: 'Medium',
  });

  // Fetch clients from Firestore customers collection on mount
  useEffect(() => {
    async function fetchClients() {
      try {
        const querySnapshot = await getDocs(collection(db, 'customers'));
        const clientsList = [];
        querySnapshot.forEach((doc) => {
          clientsList.push({ id: doc.id, ...doc.data() });
        });
        setClients(clientsList);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please check your Firestore rules/connection.');
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Search filter
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(lower);
        const occMatch = c.occupation?.toLowerCase().includes(lower);
        const planMatch = c.plans?.some((p) => p.name?.toLowerCase().includes(lower));
        return nameMatch || occMatch || planMatch;
      });
    }

    // Category filter
    if (activeFilter === 'healthy') {
      result = result.filter((c) => (c.healthScore || 0) >= 80);
    } else if (activeFilter === 'attention') {
      result = result.filter((c) => (c.healthScore || 0) >= 50 && (c.healthScore || 0) < 80);
    } else if (activeFilter === 'high-risk') {
      result = result.filter((c) => (c.healthScore || 0) < 50);
    }

    return result;
  }, [clients, search, activeFilter]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.age || !newClient.occupation) return;

    setLoading(true);
    setError('');
    try {
      const clientPayload = {
        name: newClient.name,
        age: parseInt(newClient.age, 10),
        occupation: newClient.occupation,
        healthScore: 70,
        riskLevel: newClient.riskLevel,
        lastContact: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        activePlans: 0,
        avatar: '',
        specialPreferences: { birthday: '', notes: '' },
        familyDetails: '',
        plans: [],
        followUps: [],
        expenses: [],
        healthFactors: {
          recentContact: true,
          planComplete: false,
          renewalSoon: false,
          outstandingFollowUps: 0,
        },
        memorySummary: `Client profile created for ${newClient.name}.`,
        memoryTimeline: [
          { date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), category: 'Life Event', description: 'Client onboarded to platform.' }
        ],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Write to Firestore customers collection
      const docRef = await addDoc(collection(db, 'customers'), clientPayload);
      const newClientObj = { id: docRef.id, ...clientPayload };
      
      setClients((prev) => [newClientObj, ...prev]);
      setNewClient({ name: '', age: '', occupation: '', riskLevel: 'Medium' });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding client:', err);
      setError('Failed to add client to database.');
    } finally {
      setLoading(false);
    }
  };

  // Count per category
  const counts = useMemo(() => ({
    all: clients.length,
    healthy: clients.filter((c) => (c.healthScore || 0) >= 80).length,
    attention: clients.filter((c) => (c.healthScore || 0) >= 50 && (c.healthScore || 0) < 80).length,
    'high-risk': clients.filter((c) => (c.healthScore || 0) < 50).length,
  }), [clients]);

  if (loading && clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={36} className="text-aag-primary animate-spin" />
        <p className="text-sm text-gray-500">Loading clients list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage client relationships and monitor client health from Firestore
            </p>
          </div>
          <button
            id="add-client-btn"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-aag-primary text-white text-sm font-medium hover:bg-aag-primary-dark transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-lg">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="client-search"
            type="text"
            placeholder="Search by name, occupation, or plan type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-aag-primary focus:ring-2 focus:ring-aag-primary/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400 mr-1" />
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                id={`filter-${tab.key}`}
                onClick={() => setActiveFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-aag-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon size={13} />
                {tab.label}
                <span className={`ml-0.5 text-[0.65rem] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No clients found matching your criteria.</p>
          <button
            onClick={() => { setSearch(''); setActiveFilter('all'); }}
            className="mt-2 text-sm text-aag-primary hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add New Client</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Lim"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 bg-white outline-none focus:border-aag-primary focus:ring-2 focus:ring-aag-primary/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    value={newClient.age}
                    onChange={(e) => setNewClient({ ...newClient, age: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 bg-white outline-none focus:border-aag-primary focus:ring-2 focus:ring-aag-primary/10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Risk Level</label>
                  <select
                    value={newClient.riskLevel}
                    onChange={(e) => setNewClient({ ...newClient, riskLevel: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 bg-white outline-none focus:border-aag-primary"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Engineer"
                  value={newClient.occupation}
                  onChange={(e) => setNewClient({ ...newClient, occupation: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 bg-white outline-none focus:border-aag-primary focus:ring-2 focus:ring-aag-primary/10"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-aag-primary text-white text-sm font-medium hover:bg-aag-primary-dark transition-colors cursor-pointer"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
