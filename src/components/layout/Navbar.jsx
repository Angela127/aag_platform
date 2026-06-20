import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, LayoutDashboard, Users, BookOpen, Handshake, BarChart3, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Navbar.module.css';

const AGENT_LINKS = [
  { to: '/dashboard',  label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients',    label: 'Clients',   icon: Users },
  { to: '/training',   label: 'Training',  icon: BookOpen },
  { to: '/partners',   label: 'Partners',  icon: Handshake },
  { to: '/reports',    label: 'Reports',   icon: BarChart3 },
];

const MANAGER_LINKS = [
  { to: '/dashboard',         label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/manager-dashboard', label: 'Message',     icon: LayoutDashboard },
  { to: '/clients',           label: 'Clients',     icon: Users },
  { to: '/training',          label: 'Training',    icon: BookOpen },
  { to: '/partners',          label: 'Partners',    icon: Handshake },
  { to: '/reports',           label: 'Reports',     icon: BarChart3 },
];

const DEFAULT_CUSTOMER_NOTIFICATIONS = [
  { id: 'c-notif-1', text: "Medical Insurance expires in 30 days", time: '1h ago', unread: true, type: 'policy' },
  { id: 'c-notif-2', text: "Annual Policy Review scheduled for June 25", time: '3h ago', unread: true, type: 'advisor' },
  { id: 'c-notif-3', text: "Upload latest payslip is overdue!", time: '5h ago', unread: true, type: 'task' },
  { id: 'c-notif-4', text: "Sign updated policy document is pending", time: '1d ago', unread: false, type: 'task' },
];

const DEFAULT_AGENT_NOTIFICATIONS = [
  { id: 'a-notif-1', text: "John Tan's policy expires soon", time: '2h ago', unread: true, type: 'policy' },
  { id: 'a-notif-2', text: 'Sarah Lim not contacted in 45 days', time: '1d ago', unread: true, type: 'client' },
  { id: 'a-notif-3', text: 'New partner deal from Prudential', time: '2d ago', unread: false, type: 'partner' },
];

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!role) return;
    const key = role === 'customer' ? 'aag_customer_notifs' : 'aag_agent_notifs';
    
    const loadNotifs = () => {
      const stored = localStorage.getItem(key);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        const defaults = role === 'customer' ? DEFAULT_CUSTOMER_NOTIFICATIONS : DEFAULT_AGENT_NOTIFICATIONS;
        localStorage.setItem(key, JSON.stringify(defaults));
        setNotifications(defaults);
      }
    };

    loadNotifs();

    const handleUpdate = () => {
      loadNotifs();
    };
    window.addEventListener('aag-notifications-updated', handleUpdate);
    return () => {
      window.removeEventListener('aag-notifications-updated', handleUpdate);
    };
  }, [role]);

  const unreadCount = notifications.filter(n => n.unread).length;

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

  const handleMarkAsRead = (id) => {
    const key = role === 'customer' ? 'aag_customer_notifs' : 'aag_agent_notifs';
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    localStorage.setItem(key, JSON.stringify(updated));
    setNotifications(updated);
    window.dispatchEvent(new Event('aag-notifications-updated'));
  };

  const handleDismiss = (id) => {
    const key = role === 'customer' ? 'aag_customer_notifs' : 'aag_agent_notifs';
    const updated = notifications.filter(n => n.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    setNotifications(updated);
    window.dispatchEvent(new Event('aag-notifications-updated'));
  };

  const handleClearAll = () => {
    const key = role === 'customer' ? 'aag_customer_notifs' : 'aag_agent_notifs';
    localStorage.setItem(key, JSON.stringify([]));
    setNotifications([]);
    window.dispatchEvent(new Event('aag-notifications-updated'));
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Advisor';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const renderNotifItem = (n) => {
    return (
      <li key={n.id} className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}>
        <div className={styles.notifContent}>
          <p className={styles.notifText}>{n.text}</p>
          <span className={styles.notifTime}>{n.time}</span>
        </div>
        <div className={styles.notifActions}>
          {n.unread && (
            <button 
              className={styles.actionBtnRead} 
              onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }} 
              title="Mark as read"
            >
              <Check size={12} />
            </button>
          )}
          <button 
            className={styles.actionBtnDismiss} 
            onClick={(e) => { e.stopPropagation(); handleDismiss(n.id); }} 
            title="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      </li>
    );
  };

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
            {(role === 'agent' || role === 'manager') && (role === 'manager' ? MANAGER_LINKS : AGENT_LINKS).map(({ to, label }) => (
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
                  <div className={styles.dropdown} style={{ width: 340 }}>
                    <div className={styles.dropdownHeader}>
                      <span>Notifications</span>
                      <span className={styles.dropdownSub}>{unreadCount} unread</span>
                    </div>
                    
                    {role === 'customer' ? (
                      <div className={styles.notifScrollArea}>
                        {/* Policy alerts group */}
                        {notifications.some(n => n.type === 'policy') && (
                          <div className={styles.notifGroup}>
                            <h4 className={styles.groupTitle}>Policy Alerts</h4>
                            <ul className={styles.notifList}>
                              {notifications.filter(n => n.type === 'policy').map(n => renderNotifItem(n))}
                            </ul>
                          </div>
                        )}
                        {/* Advisor updates group */}
                        {notifications.some(n => n.type === 'advisor') && (
                          <div className={styles.notifGroup}>
                            <h4 className={styles.groupTitle}>Advisor Updates</h4>
                            <ul className={styles.notifList}>
                              {notifications.filter(n => n.type === 'advisor').map(n => renderNotifItem(n))}
                            </ul>
                          </div>
                        )}
                        {/* Action tasks group */}
                        {notifications.some(n => n.type === 'task') && (
                          <div className={styles.notifGroup}>
                            <h4 className={styles.groupTitle}>Action Tasks</h4>
                            <ul className={styles.notifList}>
                              {notifications.filter(n => n.type === 'task').map(n => renderNotifItem(n))}
                            </ul>
                          </div>
                        )}
                        {notifications.length === 0 && (
                          <div className={styles.emptyNotifs}>
                            No notifications
                          </div>
                        )}
                      </div>
                    ) : (
                      // Agent notifications
                      <ul className={styles.notifList}>
                        {notifications.map(n => (
                          <li key={n.id} className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}>
                            <p>{n.text}</p>
                            <span>{n.time}</span>
                          </li>
                        ))}
                        {notifications.length === 0 && (
                          <li className={styles.emptyNotifItem}>No notifications</li>
                        )}
                      </ul>
                    )}
                    
                    <div className={styles.dropdownFooter}>
                      <button className={styles.footerLink} onClick={handleClearAll}>Clear All</button>
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
                      <span className={styles.dropdownSub}>{role === 'agent' ? 'Financial Advisor' : role === 'manager' ? 'Manager' : 'Customer'}</span>
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
