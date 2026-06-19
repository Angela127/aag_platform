import styles from './CustomerPortal.module.css';

export default function CustomerPortal() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>🏗️</div>
        <h1 className={styles.title}>Customer Portal</h1>
        <p className={styles.sub}>
          Your personal financial dashboard is being built.<br />
          Check back soon — great things are coming.
        </p>
        <div className={styles.badge}>Coming Soon</div>
      </div>
    </div>
  );
}
