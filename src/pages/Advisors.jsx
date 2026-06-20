import AdvisorManagement from '../components/dashboard/AdvisorManagement.jsx';
import styles from './ManagerDashboard.module.css';

export default function Advisors() {
  const today = new Date().toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Advisor Administration</h1>
          <p className={styles.pageDate}>{today} · Global Directory</p>
        </div>
      </div>
      <AdvisorManagement />
    </div>
  );
}
