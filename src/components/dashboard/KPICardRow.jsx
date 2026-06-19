import { useEffect, useRef, useState } from 'react';
import { Users, BellRing, BookOpen, Handshake, TrendingUp, ArrowUpRight } from 'lucide-react';
import { mockKPIs } from '../../lib/mockData.js';
import styles from './KPICardRow.module.css';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

function KPICard({ icon: Icon, label, value, sub, accent, change }) {
  const count = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.iconWrap} style={{ background: accent + '18', color: accent }}>
          <Icon size={18} />
        </div>
        {change && (
          <span className={styles.change}>
            <ArrowUpRight size={12} />
            {change}
          </span>
        )}
      </div>
      <div className={styles.value}>
        {typeof value === 'number' ? count.toLocaleString() : value}
      </div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}

function CPDCard() {
  const { done, total } = mockKPIs.cpdProgress;
  const pct = Math.round((done / total) * 100);
  const remaining = total - done;
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.iconWrap} style={{ background: '#7c3aed18', color: '#7c3aed' }}>
          <BookOpen size={18} />
        </div>
        <span className={`badge badge-${pct >= 80 ? 'green' : 'amber'}`}>
          {pct}%
        </span>
      </div>
      <div className={styles.value}>{done}<span className={styles.valueUnit}>/{total}</span></div>
      <div className={styles.label}>CPD Hours</div>
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%`, background: pct >= 80 ? '#16a34a' : '#d97706' }} />
        </div>
        <span className={styles.sub}>{remaining} hrs left this cycle</span>
      </div>
    </div>
  );
}

export default function KPICardRow() {
  return (
    <div className={styles.row}>
      <KPICard
        icon={Users}
        label="Total Clients"
        value={mockKPIs.totalClients}
        accent="#870105"
        change="+3 this month"
      />
      <KPICard
        icon={BellRing}
        label="Active Follow-ups"
        value={mockKPIs.activeFollowups}
        accent="#d97706"
        change="5 due today"
      />
      <CPDCard />
      <KPICard
        icon={Handshake}
        label="Partner Referrals"
        value={mockKPIs.partnerReferrals}
        sub="This month"
        accent="#2563eb"
        change="+2 this week"
      />
    </div>
  );
}
