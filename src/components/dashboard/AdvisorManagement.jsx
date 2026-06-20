import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase.js';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Search, Users, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './AdvisorManagement.module.css';

export default function AdvisorManagement() {
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState(null); // null means adding new
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    status: 'active',
    teamSize: 0,
    totalClients: 0,
  });
  const [formError, setFormError] = useState('');

  // Load advisors in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'advisors'), (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAdvisors(list);
      setLoading(false);
    }, (error) => {
      console.error('Error loading advisors:', error);
      setLoading(false);
    });
    return unsub;
  }, []);

  const openAddModal = () => {
    setEditingAdvisor(null);
    setFormData({
      name: '',
      designation: '',
      email: '',
      phone: '',
      status: 'active',
      teamSize: 0,
      totalClients: 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (advisor) => {
    setEditingAdvisor(advisor);
    setFormData({
      name: advisor.name || '',
      designation: advisor.designation || '',
      email: advisor.email || '',
      phone: advisor.phone || '',
      status: advisor.status || 'active',
      teamSize: advisor.teamSize || 0,
      totalClients: advisor.totalClients || 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdvisor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { name, designation, email, phone, status, teamSize, totalClients } = formData;
    if (!name.trim() || !designation.trim() || !email.trim()) {
      setFormError('Please fill in Name, Designation, and Email.');
      return;
    }

    try {
      const id = editingAdvisor ? editingAdvisor.id : `adv-${Date.now()}`;
      const avatar = editingAdvisor
        ? (editingAdvisor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

      const advisorDoc = {
        id,
        name,
        designation,
        email,
        phone,
        status,
        avatar,
        teamSize: Number(teamSize) || 0,
        totalClients: Number(totalClients) || 0,
      };

      await setDoc(doc(db, 'advisors', id), advisorDoc);
      closeModal();
    } catch (error) {
      console.error('Error saving advisor:', error);
      setFormError('Failed to save advisor. Please try again.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove advisor ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'advisors', id));
        // Optional: also clean up messaging threads if wanted, but leaving them is safer for archive
      } catch (error) {
        console.error('Error deleting advisor:', error);
        alert('Failed to delete advisor.');
      }
    }
  };

  const filteredAdvisors = advisors.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.section}>
      {/* Header Area */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Users size={20} className={styles.titleIcon} />
          <h2 className={styles.title}>Manage Advisors ({advisors.length})</h2>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search advisors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button className={styles.addBtn} onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Advisor</span>
          </button>
        </div>
      </div>

      {/* Advisors Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '32px', textAlignment: 'center', color: 'var(--text-muted)' }}>
            Loading advisors...
          </div>
        ) : filteredAdvisors.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Advisor</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Phone</th>
                <th className={styles.th}>Team Size</th>
                <th className={styles.th}>Total Clients</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvisors.map((advisor) => (
                <tr key={advisor.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.profileCell}>
                      <img
                        src={advisor.avatar}
                        alt={advisor.name}
                        className={styles.avatar}
                      />
                      <div>
                        <div className={styles.name}>{advisor.name}</div>
                        <div className={styles.designation}>{advisor.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>{advisor.email}</td>
                  <td className={styles.td}>{advisor.phone || '-'}</td>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{advisor.teamSize ?? 0}</td>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{advisor.totalClients ?? 0}</td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.statusBadge} ${
                        advisor.status === 'active'
                          ? styles.statusActive
                          : advisor.status === 'away'
                          ? styles.statusAway
                          : styles.statusOffline
                      }`}
                    >
                      <span className={styles.statusDot} />
                      {advisor.status === 'active' ? 'Active' : advisor.status === 'away' ? 'Away' : 'Offline'}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions} style={{ justifyContent: 'flex-end' }}>
                      <button
                        className={`${styles.actionBtn} ${styles.reportBtn}`}
                        onClick={() => navigate(`/reports?advisorId=${advisor.id}`)}
                        title="View Report"
                      >
                        <BarChart3 size={13} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => openEditModal(advisor)}
                        title="Edit Advisor"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(advisor.id, advisor.name)}
                        title="Delete Advisor"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            No advisors found. Click "Add Advisor" to get started.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingAdvisor ? 'Edit Advisor Details' : 'Add New Advisor'}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                {formError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px' }}>
                    {formError}
                  </div>
                )}

                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. Sarah Chen"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="designation">Designation *</label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. Senior Wealth Manager"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. sarah.chen@gmail.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="phone">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g. +65 9123 4567"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="teamSize">Team Size</label>
                    <input
                      type="number"
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="totalClients">Total Clients</label>
                    <input
                      type="number"
                      id="totalClients"
                      name="totalClients"
                      value={formData.totalClients}
                      onChange={handleInputChange}
                      className={styles.input}
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="active">Active</option>
                      <option value="away">Away</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingAdvisor ? 'Save Changes' : 'Add Advisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
