import AdvisorManagement from '../components/dashboard/AdvisorManagement.jsx';
import { Users } from 'lucide-react';
import styles from './ManagerDashboard.module.css';

export default function Advisors() {
  const today = new Date().toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            <Users size={32} className={styles.titleIcon} />
            Advisor Administration
          </h1>
          <p className={styles.pageDate}>
            {today} · Global Directory of advisors, performance tracking, and resource management
          </p>
        </div>
      </div>
      <AdvisorManagement />
    </div>
  );
}
