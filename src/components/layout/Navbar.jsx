import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, LayoutDashboard, Users, BookOpen, Handshake, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Navbar.module.css';

const AGENT_LINKS = [
  { to: '/dashboard',  label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients',    label: 'Clients',   icon: Users },
  { to: '/training',   label: 'Training',  icon: BookOpen },
  { to: '/partners',   label: 'Partners',  icon: Handshake },
  { to: '/reports',    label: 'Reports',   icon: BarChart3 },
];

const mockNotifications = [
  { id: 1, text: "John Tan's policy expires soon", time: '2h ago', unread: true },
  { id: 2, text: 'Sarah Lim not contacted in 45 days', time: '1d ago', unread: true },
  { id: 3, text: 'New partner deal from Prudential', time: '2d ago', unread: false },
];

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const bellRef = useRef(null);
  const avatarRef = useRef(null);

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Advisor';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img
            src="/AAG_logo.png"
            alt="Advisors Alliance Group"
            className={styles.logoImg}
            onError={e => { e.target.onerror=null; e.target.src='/AAG_logo.svg'; }}
          />
        </Link>

        {/* Center Nav Links */}
        {user && (
          <ul className={styles.navLinks}>
            {role === 'agent' && AGENT_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`${styles.navLink} ${location.pathname === to ? styles.active : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right Side */}
        <div className={styles.rightSide}>
          {!user ? (
            <Link to="/login" className={`btn btn-primary btn-sm`}>Login</Link>
          ) : (
            <>
              {/* Notification Bell */}
              <div className={styles.bellWrap} ref={bellRef}>
                <button
                  className={styles.iconBtn}
                  onClick={() => { setBellOpen(o => !o); setAvatarOpen(false); }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount}</span>
                  )}
                </button>
                {bellOpen && (
                  <div className={styles.dropdown} style={{ width: 300 }}>
                    <div className={styles.dropdownHeader}>
                      <span>Notifications</span>
                      <span className={styles.dropdownSub}>{unreadCount} unread</span>
                    </div>
                    <ul className={styles.notifList}>
                      {mockNotifications.map(n => (
                        <li key={n.id} className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}>
                          <p>{n.text}</p>
                          <span>{n.time}</span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.dropdownFooter}>
                      <button className={styles.footerLink}>View all notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar Dropdown */}
              <div className={styles.avatarWrap} ref={avatarRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => { setAvatarOpen(o => !o); setBellOpen(false); }}
                >
                  <div className={styles.avatar}>{initials}</div>
                  <span className={styles.avatarName}>{displayName}</span>
                  <ChevronDown size={14} className={avatarOpen ? styles.chevronOpen : ''} />
                </button>
                {avatarOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <span>{displayName}</span>
                      <span className={styles.dropdownSub}>{role === 'agent' ? 'Financial Advisor' : 'Customer'}</span>
                    </div>
                    <ul className={styles.menuList}>
                      <li>
                        <button className={styles.menuItem}>
                          <User size={15} /> Profile
                        </button>
                      </li>
                      <li>
                        <button className={styles.menuItem}>
                          <Settings size={15} /> Settings
                        </button>
                      </li>
                    </ul>
                    <div className={styles.menuDivider} />
                    <ul className={styles.menuList}>
                      <li>
                        <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={handleLogout}>
                          <LogOut size={15} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
