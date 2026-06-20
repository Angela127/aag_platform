import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { db, auth } from '../lib/firebase.js';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, Phone, Briefcase, MapPin, AlignLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, role } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designation: '',
    location: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const defaultName = user?.displayName || user?.email?.split('@')[0] || '';
  const userInitials = formData.name
    ? formData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'AD';

  // Load profile from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: user.displayName || data.name || defaultName,
            phone: data.phone || '',
            designation: data.designation || (role === 'manager' ? 'Regional Director' : 'Financial Advisor'),
            location: data.location || 'AAG Headquarters, Singapore',
            bio: data.bio || 'Professional adviser securing clients\' financial futures.',
          });
        } else {
          // Initialize form with defaults
          setFormData({
            name: user.displayName || defaultName,
            phone: '',
            designation: role === 'manager' ? 'Regional Director' : 'Financial Advisor',
            location: 'AAG Headquarters, Singapore',
            bio: 'Professional adviser securing clients\' financial futures.',
          });
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, role, defaultName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      // 1. Update Firebase Auth Profile (DisplayName)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name,
        });
      }

      // 2. Save/Update Extended Info in Firestore
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        designation: formData.designation,
        location: formData.location,
        bio: formData.bio,
        email: user.email,
        role: role,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'userProfiles', user.uid), profileData, { merge: true });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageDate}>Manage your personal credentials, designation, and biography</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Left Sidebar: Display Card */}
        <div className={styles.leftCol}>
          <div className={styles.profileCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarCircle}>{userInitials}</div>
              <div className={styles.roleBadge} style={{ backgroundColor: role === 'manager' ? '#870105' : '#1e40af' }}>
                <ShieldCheck size={12} />
                <span>{role === 'manager' ? 'Manager' : 'Advisor'}</span>
              </div>
            </div>

            <h2 className={styles.displayName}>{formData.name || 'Advisors Alliance'}</h2>
            <p className={styles.displayDesignation}>{formData.designation}</p>
            
            <div className={styles.profileDivider} />

            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>System Email</span>
                <span className={styles.metaValue}>{user?.email}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Office Location</span>
                <span className={styles.metaValue}>{formData.location || 'Not Specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Editing Form */}
        <div className={styles.rightCol}>
          <div className={styles.formCard}>
            <h3 className={styles.cardTitle}>Edit Profile Information</h3>
            
            {saveSuccess && (
              <div className={styles.successAlert}>
                <CheckCircle2 size={16} />
                <span>Changes saved successfully! Navigation headers and database documents updated.</span>
              </div>
            )}

            {error && (
              <div className={styles.errorAlert}>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">
                    <User size={13} className={styles.labelIcon} />
                    <span>Full Name *</span>
                  </label>
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
                  <label className={styles.label} htmlFor="phone">
                    <Phone size={13} className={styles.labelIcon} />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g. +65 9876 5432"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="designation">
                    <Briefcase size={13} className={styles.labelIcon} />
                    <span>Designation / Role Title</span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g. Senior Wealth Advisor"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="location">
                    <MapPin size={13} className={styles.labelIcon} />
                    <span>Office Location</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g. AAG East Branch"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label} htmlFor="bio">
                    <AlignLeft size={13} className={styles.labelIcon} />
                    <span>Biography & Specializations</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Tell us about your expertises, core certifications (e.g., CFP, ChFC), or personal bio..."
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? 'Saving changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
