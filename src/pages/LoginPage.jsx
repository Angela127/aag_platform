import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase.js';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole]         = useState('agent');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      let finalRole = role;
      const lowerEmail = email.toLowerCase();
      if (lowerEmail === 'manager@gmail.com') {
        finalRole = 'manager';
      } else if (lowerEmail === 'customer@gmail.com') {
        finalRole = 'customer';
      } else if (lowerEmail === 'advisor@gmail.com') {
        finalRole = 'agent';
      }
      
      localStorage.setItem('aag_role', finalRole);
      navigate(finalRole === 'customer' ? '/customer-portal' : '/dashboard');
    } catch (err) {
      const messages = {
        'auth/invalid-credential':    'Incorrect email or password.',
        'auth/user-not-found':        'No account found with this email.',
        'auth/wrong-password':        'Incorrect password.',
        'auth/too-many-requests':     'Too many attempts. Please try again later.',
        'auth/network-request-failed':'Network error. Check your connection.',
      };
      setError(messages[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left — Branding Panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandOverlay} />
        <div className={styles.brandContent}>
          <img
            src="/AAG_logo.png"
            alt="Advisors Alliance Group"
            className={styles.brandLogo}
            onError={e => { e.target.onerror=null; e.target.src='/AAG_logo.svg'; }}
          />
          <div className={styles.brandText}>
            <h1 className={styles.brandTagline}>
              <em>Impacting Lives,</em><br />
              <em>Always.</em>
            </h1>
            <p className={styles.brandSub}>A World-Class Financial Services Group</p>
          </div>
          <div className={styles.brandFooter}>
            <span>Trusted by 5,000+ financial advisors across Southeast Asia</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          {/* Role Toggle */}
          <div className={styles.roleToggle}>
            <button
              type="button"
              className={`${styles.roleBtn} ${role === 'agent' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('agent')}
            >
              Advisor
            </button>
            <button
              type="button"
              className={`${styles.roleBtn} ${role === 'manager' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('manager')}
            >
              Manager
            </button>
            <button
              type="button"
              className={`${styles.roleBtn} ${role === 'customer' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('customer')}
            >
              Customer
            </button>
          </div>

          <div className={styles.formHead}>
            <h2 className={styles.formTitle}>
              {role === 'agent' ? 'Advisor Sign In' : role === 'manager' ? 'Manager Sign In' : 'Customer Sign In'}
            </h2>
            <p className={styles.formSub}>
              {role === 'agent'
                ? 'Access your intelligence dashboard'
                : role === 'manager'
                ? 'Manage your team of advisors'
                : 'View your financial portfolio'}
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className={styles.passWrap}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input ${styles.passInput}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passToggle}
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.forgotLink}
                tabIndex={0}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className={styles.formFooter}>
            AAG Advisor Intelligence Platform &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
