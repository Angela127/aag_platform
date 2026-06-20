import { useState, useRef, useEffect } from 'react';
import styles from './Reports.module.css';
import {
  monthlyRevenue, quarterlyRevenue, yearlyRevenue, productSales,
  kpiData, opportunityClients, clientHealth, benchmarkData,
  networkNodes, networkEdges, aiSummaryData,
} from '../lib/reportData.js';

// ─── Utility ─────────────────────────────────────────────────────────────────
function fmt(n, prefix = '', suffix = '') {
  if (n === undefined || n === null) return '—';
  if (typeof n !== 'number') return n;
  if (n >= 1000000) return `${prefix}${(n / 1000000).toFixed(2)}M${suffix}`;
  if (n >= 1000) return `${prefix}${(n / 1000).toFixed(1)}K${suffix}`;
  return `${prefix}${n.toLocaleString()}${suffix}`;
}

function pct(curr, prev) {
  if (!prev) return 0;
  return (((curr - prev) / prev) * 100).toFixed(1);
}

const avatarColors = ['#1e40af','#065f46','#5b21b6','#9d174d','#b45309','#0e7490','#6b21a8','#166534'];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
}
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// ─── Mini Line Chart (SVG) ────────────────────────────────────────────────────
function MiniLineChart({ data, valueKey, colorStroke = '#870105', height = 160 }) {
  if (!data || data.length === 0) return null;
  const values = data.map(d => d[valueKey]);
  const min = Math.min(...values) * 0.9;
  const max = Math.max(...values) * 1.05;
  const W = 540; const H = height;
  const pad = { t: 16, r: 16, b: 32, l: 48 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  const px = i => pad.l + (i / (data.length - 1)) * iW;
  const py = v => pad.t + iH - ((v - min) / (max - min)) * iH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(d[valueKey])}`).join(' ');
  const areaPath = `${linePath} L${px(data.length - 1)},${pad.t + iH} L${px(0)},${pad.t + iH} Z`;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => min + ((max - min) / ticks) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorStroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={colorStroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={pad.l} y1={py(v)} x2={pad.l + iW} y2={py(v)} stroke="#e8e5e0" strokeWidth="1" strokeDasharray="4 3" />
          <text x={pad.l - 6} y={py(v) + 4} textAnchor="end" fontSize="9" fill="#9a9a9a">
            {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1)}
          </text>
        </g>
      ))}
      {/* X labels */}
      {data.map((d, i) => {
        const step = Math.ceil(data.length / 6);
        if (i % step !== 0 && i !== data.length - 1) return null;
        return (
          <text key={i} x={px(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9a9a9a">
            {d.month || d.quarter || d.year}
          </text>
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#grad-${valueKey})`} />
      {/* Line */}
      <path d={linePath} fill="none" stroke={colorStroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {data.map((d, i) => (
        <circle key={i} cx={px(i)} cy={py(d[valueKey])} r="3.5" fill={colorStroke} stroke="#fff" strokeWidth="2">
          <title>{`${d.month || d.quarter || d.year}: ${fmt(d[valueKey], '', '')}`}</title>
        </circle>
      ))}
    </svg>
  );
}

// ─── Client/Net Growth Chart ──────────────────────────────────────────────────
function ClientGrowthChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.newClients + d.lostClients)) * 1.3;
  const H = 160;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: H, paddingTop: 16 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 1, height: '100%' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 1, flex: 1 }}>
            <div title={`New: ${d.newClients}`} style={{ width: '60%', height: `${(d.newClients / maxVal) * 100}%`, background: '#065f46', borderRadius: '3px 3px 0 0', transition: 'height 0.5s ease', minHeight: 2 }} />
            <div title={`Lost: ${d.lostClients}`} style={{ width: '60%', height: `${(d.lostClients / maxVal) * 60}%`, background: '#991b1b', borderRadius: '0 0 3px 3px', transition: 'height 0.5s ease', minHeight: 2 }} />
          </div>
          {(i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) && (
            <div style={{ fontSize: '0.6rem', color: '#9a9a9a', whiteSpace: 'nowrap', marginTop: 3 }}>{d.month}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── AUM Growth Chart ─────────────────────────────────────────────────────────
function AUMChart({ data }) {
  return <MiniLineChart data={data} valueKey="aum" colorStroke="#1e40af" />;
}

// ─── Product Sales Horizontal Bar ────────────────────────────────────────────
function ProductSalesChart({ mode }) {
  const data = productSales[mode] || productSales.monthly;
  const maxRev = Math.max(...data.map(d => d.revenue));
  const colors = ['#870105','#1e40af','#065f46','#b45309','#5b21b6','#0e7490'];
  return (
    <div className={styles.productGrid}>
      {data.map((d, i) => (
        <div key={d.product} className={styles.productRow}>
          <div className={styles.productName}>{d.product}</div>
          <div className={styles.productBarWrap}>
            <div
              className={styles.productBar}
              style={{ width: `${(d.revenue / maxRev) * 100}%`, background: colors[i % colors.length] }}
            >
              <span className={styles.productBarText}>{d.sales} sold</span>
            </div>
          </div>
          <div className={styles.productGrowth} style={{ color: d.growth >= 0 ? '#065f46' : '#991b1b' }}>
            {d.growth >= 0 ? '↑' : '↓'}{Math.abs(d.growth)}%
          </div>
          <div className={styles.productRevenue}>{fmt(d.revenue, 'RM ')}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Radar / Spider Chart for Benchmarking ────────────────────────────────────
function RadarChart({ data }) {
  const { metrics, you, teamAvg, branchAvg, topPerformer } = data;
  const n = metrics.length;
  const cx = 130; const cy = 130; const r = 100;
  const angleStep = (2 * Math.PI) / n;
  const rings = [20, 40, 60, 80, 100];

  function point(val, idx, maxVal = 100) {
    const a = idx * angleStep - Math.PI / 2;
    const d = (val / maxVal) * r;
    return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) };
  }

  // normalise each metric by topPerformer value
  function normPts(arr) {
    return metrics.map((_, i) => point(Math.min((arr[i] / topPerformer[i]) * 100, 100), i));
  }

  function polyPath(pts) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
  }

  const youPts       = normPts(you);
  const teamPts      = normPts(teamAvg);
  const branchPts    = normPts(branchAvg);
  const topPts       = normPts(topPerformer);

  return (
    <svg viewBox={`0 0 260 260`} style={{ width: '100%', maxWidth: 260, height: 'auto' }}>
      {/* Rings */}
      {rings.map(ring => {
        const pts = metrics.map((_, i) => point(ring, i));
        return <polygon key={ring} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#e8e5e0" strokeWidth="1" />;
      })}
      {/* Spokes */}
      {metrics.map((_, i) => {
        const p = point(100, i);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e8e5e0" strokeWidth="1" />;
      })}
      {/* Labels */}
      {metrics.map((m, i) => {
        const p = point(118, i);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill="#5a5a5a" fontWeight="600">{m}</text>;
      })}
      {/* Series */}
      <path d={polyPath(topPts)} fill="rgba(135,1,5,0.06)" stroke="#870105" strokeWidth="1.5" strokeDasharray="4 2" />
      <path d={polyPath(branchPts)} fill="rgba(180,83,9,0.08)" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4 2" />
      <path d={polyPath(teamPts)} fill="rgba(30,64,175,0.08)" stroke="#1e40af" strokeWidth="1.5" />
      <path d={polyPath(youPts)} fill="rgba(6,95,70,0.15)" stroke="#065f46" strokeWidth="2.5" />
      {/* You dots */}
      {youPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#065f46" stroke="#fff" strokeWidth="1.5" />)}
    </svg>
  );
}

// ─── Network Graph (Enhanced) ────────────────────────────────────────────────
const NODE_POSITIONS = {
  advisor: { x: 50, y: 50 },       // percent of container
  john:    { x: 20, y: 22 },
  sarah:   { x: 65, y: 14 },
  david:   { x: 80, y: 46 },
  emily:   { x: 72, y: 74 },
  michael: { x: 22, y: 74 },
  alice:   { x: 10, y: 48 },
  lead1:   { x: 6,  y: 18 },
  lead2:   { x: 52, y: 5  },
  lead3:   { x: 92, y: 28 },
  lead4:   { x: 91, y: 66 },
  lead5:   { x: 37, y: 5  },
};

function NetworkGraph() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 700, h: 420 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getPos = (id) => {
    const p = NODE_POSITIONS[id] || { x: 50, y: 50 };
    return { x: (p.x / 100) * dims.w, y: (p.y / 100) * dims.h };
  };

  const isHighlighted = (nodeId) => {
    if (!selected && !hovered) return true;
    const focus = selected || hovered;
    if (focus === nodeId) return true;
    return networkEdges.some(e =>
      (e.from === focus && e.to === nodeId) || (e.to === focus && e.from === nodeId)
    );
  };

  const isEdgeHighlighted = (edge) => {
    if (!selected && !hovered) return true;
    const focus = selected || hovered;
    return edge.from === focus || edge.to === focus;
  };

  const selectedNode = networkNodes.find(n => n.id === selected);
  const connectedEdges = selected
    ? networkEdges.filter(e => e.from === selected || e.to === selected)
    : [];

  const nodeSize = (node) => {
    const base = { advisor: 34, client: 22, lead: 13 }[node.type] || 18;
    return selected === node.id ? base + 5 : base;
  };

  return (
    <div style={{ display: 'flex', gap: 0, height: 420 }}>
      {/* ── SVG Graph ── */}
      <div
        ref={containerRef}
        className={styles.networkWrap}
        style={{ flex: 1, height: '100%', borderRadius: selected ? '12px 0 0 12px' : 12, transition: 'border-radius 0.2s' }}
      >
        <svg width={dims.w} height={dims.h} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            {/* Glow filter for advisor */}
            <filter id="glow-advisor" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-selected" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Gradient for edges */}
            <linearGradient id="edge-client" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#870105" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#870105" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background grid dots */}
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#e8e5e0" opacity="0.6" />
          </pattern>
          <rect width={dims.w} height={dims.h} fill="url(#dots)" />

          {/* ── Edges ── */}
          {networkEdges.map((edge, i) => {
            const from = getPos(edge.from);
            const to   = getPos(edge.to);
            const highlighted = isEdgeHighlighted(edge);
            const isRef = edge.type === 'referral';
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isRef ? '#c4c0bb' : '#870105'}
                  strokeWidth={isRef ? 1.2 : edge.strength * 0.9 + 0.5}
                  strokeDasharray={isRef ? '6 4' : undefined}
                  strokeOpacity={highlighted ? (isRef ? 0.7 : 0.85) : 0.1}
                  style={{ transition: 'stroke-opacity 0.25s' }}
                />
                {/* Flow particle on highlighted client edges */}
                {highlighted && !isRef && (
                  <circle r="3" fill="#870105" opacity="0.7">
                    <animateMotion dur={`${2.5 - edge.strength * 0.2}s`} repeatCount="indefinite">
                      <mpath href={`#edge-path-${i}`} />
                    </animateMotion>
                  </circle>
                )}
                <path id={`edge-path-${i}`} d={`M${from.x},${from.y} L${to.x},${to.y}`} fill="none" stroke="none" />
              </g>
            );
          })}

          {/* ── Nodes ── */}
          {networkNodes.map(node => {
            const pos = getPos(node.id);
            const r = nodeSize(node);
            const lit = isHighlighted(node.id);
            const isSel = selected === node.id;
            const isAdv = node.type === 'advisor';
            const isLead = node.type === 'lead';
            const fillColor = isAdv ? '#870105' : isLead ? '#f0eff4' : node.color;
            const strokeColor = isAdv ? '#ff5555' : isLead ? '#c4c0bb' : 'rgba(255,255,255,0.9)';

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer', transition: 'opacity 0.25s' }}
                opacity={lit ? 1 : 0.15}
                onClick={() => setSelected(s => s === node.id ? null : node.id)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Selection / hover ring */}
                {(isSel || hovered === node.id) && (
                  <circle cx={pos.x} cy={pos.y} r={r + 8}
                    fill="none"
                    stroke={isAdv ? '#870105' : node.color || '#870105'}
                    strokeWidth="2"
                    strokeOpacity="0.35"
                    strokeDasharray={isLead ? '4 3' : undefined}
                  />
                )}
                {/* Outer pulse ring for advisor */}
                {isAdv && (
                  <circle cx={pos.x} cy={pos.y} r={r + 14} fill="none" stroke="#870105" strokeWidth="1" strokeOpacity="0.2">
                    <animate attributeName="r" values={`${r + 8};${r + 18};${r + 8}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.25;0;0.25" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Main circle */}
                <circle
                  cx={pos.x} cy={pos.y} r={r}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isAdv ? 2.5 : isLead ? 1.5 : 2}
                  filter={isAdv ? 'url(#glow-advisor)' : isSel ? 'url(#glow-selected)' : undefined}
                  style={{ transition: 'r 0.2s' }}
                />
                {/* Initials */}
                <text
                  x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isAdv ? 11 : isLead ? 7.5 : 9}
                  fontWeight="800"
                  fill={isLead ? '#6b7280' : '#fff'}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {isAdv ? '★' : initials(node.label)}
                </text>
                {/* Name label below */}
                <text
                  x={pos.x} y={pos.y + r + 11}
                  textAnchor="middle"
                  fontSize={isAdv ? 9.5 : isLead ? 8 : 9}
                  fontWeight={isAdv ? '800' : '600'}
                  fill={isAdv ? '#870105' : '#5a5a5a'}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {node.label.split(' ')[0]}
                </text>
                {/* Referral count badge for clients */}
                {node.type === 'client' && node.referrals > 0 && (
                  <>
                    <circle cx={pos.x + r - 2} cy={pos.y - r + 2} r="8" fill="#065f46" stroke="#fff" strokeWidth="1.5" />
                    <text x={pos.x + r - 2} y={pos.y - r + 2} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="800" fill="#fff" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {node.referrals}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Side Panel (slides in on node click) ── */}
      {selected && selectedNode && (
        <div className={styles.networkSidePanel}>
          <button className={styles.networkSidePanelClose} onClick={() => setSelected(null)}>✕</button>
          <div className={styles.networkSideAvatar} style={{ background: selectedNode.type === 'advisor' ? '#870105' : selectedNode.color || '#6b7280' }}>
            {selectedNode.type === 'advisor' ? '★' : initials(selectedNode.label)}
          </div>
          <div className={styles.networkSideName}>{selectedNode.label}</div>
          <div className={styles.networkSideType}>
            {selectedNode.type === 'advisor' ? 'Your Account' : selectedNode.type === 'client' ? 'Active Client' : 'Referral Lead'}
          </div>

          {selectedNode.type === 'client' && (
            <div className={styles.networkSideStats}>
              <div className={styles.networkSideStat}>
                <div className={styles.networkSideStatVal}>{selectedNode.referrals}</div>
                <div className={styles.networkSideStatLbl}>Referrals</div>
              </div>
              <div className={styles.networkSideStat}>
                <div className={styles.networkSideStatVal}>{selectedNode.revenue}</div>
                <div className={styles.networkSideStatLbl}>AUM</div>
              </div>
            </div>
          )}

          {selectedNode.type === 'advisor' && (
            <div className={styles.networkSideStats}>
              <div className={styles.networkSideStat}>
                <div className={styles.networkSideStatVal}>127</div>
                <div className={styles.networkSideStatLbl}>Clients</div>
              </div>
              <div className={styles.networkSideStat}>
                <div className={styles.networkSideStatVal}>RM 10.6M</div>
                <div className={styles.networkSideStatLbl}>Total AUM</div>
              </div>
            </div>
          )}

          {selectedNode.type === 'lead' && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 8, textAlign: 'center' }}>
              Referred by <strong>{selectedNode.referredBy}</strong>
            </div>
          )}

          {selectedNode.type === 'client' && selectedNode.product && (
            <div style={{ marginTop: 10, padding: '6px 12px', background: 'var(--aag-accent)', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, color: 'var(--aag-primary)', textAlign: 'center' }}>
              {selectedNode.product}
            </div>
          )}

          {/* Connected nodes */}
          {connectedEdges.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>Connections</div>
              {connectedEdges.map((edge, i) => {
                const otherId = edge.from === selected ? edge.to : edge.from;
                const other = networkNodes.find(n => n.id === otherId);
                if (!other) return null;
                return (
                  <div key={i}
                    className={styles.networkSideConn}
                    onClick={() => setSelected(otherId)}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: other.type === 'advisor' ? '#870105' : other.color || '#9a9a9a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {other.type === 'advisor' ? '★' : initials(other.label)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{other.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{edge.type === 'referral' ? 'Referral' : `Strength ${edge.strength}/5`}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>›</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AI Executive Summary ─────────────────────────────────────────────────────
function AISummary({ mode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const data = aiSummaryData[mode] || aiSummaryData.monthly;

  if (dismissed) return null;
  return (
    <div className={styles.aiSummaryWrap}>
      <div className={styles.aiSummaryCard}>
        <div className={styles.aiSummaryHeader} onClick={() => setCollapsed(c => !c)}>
          <div className={styles.aiHeaderLeft}>
            <div className={styles.aiIconWrap}>🤖</div>
            <div>
              <div className={styles.aiTitle}>AI Executive Summary</div>
              <div className={styles.aiSubtitle}>Generated by AAG Intelligence Engine · {mode === 'monthly' ? 'June 2026' : 'FY 2025-2026'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className={styles.aiCollapseBtn} onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}>
              {collapsed ? '▼ Expand' : '▲ Collapse'}
            </button>
            <button className={styles.aiDismissBtn} onClick={e => { e.stopPropagation(); setDismissed(true); }} title="Dismiss">
              ✕
            </button>
          </div>
        </div>
        {!collapsed && (
          <div className={styles.aiSummaryBody}>
            <div className={styles.aiHeadline}>💡 {data.headline}</div>
            <div className={styles.aiThreeCol}>
              <div className={styles.aiColumn}>
                <div className={`${styles.aiColumnTitle} ${styles.green}`}>✅ Key Achievements</div>
                {data.achievements.map((item, i) => (
                  <div key={i} className={styles.aiItem}>
                    <div className={`${styles.aiBullet} ${styles.green}`} />
                    {item}
                  </div>
                ))}
              </div>
              <div className={styles.aiColumn}>
                <div className={`${styles.aiColumnTitle} ${styles.red}`}>⚠️ Key Concerns</div>
                {data.concerns.map((item, i) => (
                  <div key={i} className={styles.aiItem}>
                    <div className={`${styles.aiBullet} ${styles.red}`} />
                    {item}
                  </div>
                ))}
              </div>
              <div className={styles.aiColumn}>
                <div className={`${styles.aiColumnTitle} ${styles.blue}`}>🎯 Suggested Actions</div>
                {data.nextActions.map((item, i) => (
                  <div key={i} className={styles.aiItem}>
                    <div className={`${styles.aiBullet} ${styles.blue}`} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────
function KPICards({ mode }) {
  const kpis = kpiData[mode] || kpiData.monthly;
  const cards = [
    { ...kpis.totalRevenue, icon: '💰', bg: '#fff5f5', iconColor: '#870105', id: 'revenue' },
    { ...kpis.aum,          icon: '📈', bg: '#eff6ff', iconColor: '#1e40af', id: 'aum'     },
    { ...kpis.activeClients,icon: '👥', bg: '#ecfdf5', iconColor: '#065f46', id: 'clients' },
    { ...kpis.policiesSold, icon: '📋', bg: '#f5f3ff', iconColor: '#5b21b6', id: 'policies'},
  ];
  return (
    <div className={styles.kpiGrid}>
      {cards.map((card) => {
        const change = pct(card.current, card.prev);
        const isPos = change >= 0;
        const displayVal = card.id === 'revenue'
          ? `RM ${card.current >= 1000 ? (card.current / 1000).toFixed(0) + 'K' : card.current.toLocaleString()}`
          : card.id === 'aum'
          ? `RM ${card.current}M`
          : card.current.toLocaleString();

        return (
          <div key={card.id} className={styles.kpiCard}>
            <div className={styles.kpiCardTop}>
              <div className={styles.kpiIconWrap} style={{ background: card.bg, color: card.iconColor }}>
                <span style={{ fontSize: '1.1rem' }}>{card.icon}</span>
              </div>
              <div className={`${styles.kpiChange} ${isPos ? styles.kpiChangePos : styles.kpiChangeNeg}`}>
                {isPos ? '↑' : '↓'} {Math.abs(change)}%
              </div>
            </div>
            <div className={styles.kpiValue}>{displayVal}</div>
            <div className={styles.kpiLabel}>{card.label}</div>
            <div className={styles.kpiPrev}>
              vs prev: {card.id === 'revenue'
                ? `RM ${card.prev >= 1000 ? (card.prev / 1000).toFixed(0) + 'K' : card.prev}`
                : card.id === 'aum' ? `RM ${card.prev}M` : card.prev}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Revenue Trend Section ────────────────────────────────────────────────────
function RevenueTrend({ mode }) {
  const [revTab, setRevTab] = useState('monthly');

  useEffect(() => {
    setRevTab('monthly');
  }, [mode]);

  const chartData = revTab === 'monthly' ? monthlyRevenue
    : revTab === 'quarterly' ? quarterlyRevenue
    : yearlyRevenue;

  const valueKey = 'revenue';
  const aiInsight = mode === 'monthly'
    ? '🤖 Revenue peaked during March (+25.5%) driven by retirement planning demand. June shows continued acceleration at +18.1% MoM.'
    : '🤖 Wealth management product sales are growing 23% faster than insurance products. Retirement planning is your #1 revenue driver at 40% of total revenue.';

  return (
    <div className={styles.chartCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleIcon}>📊</div>
          Revenue Trend
        </div>
        <div className={styles.chartSubTabs}>
          {['monthly','quarterly','yearly'].map(t => (
            <button key={t} className={`${styles.chartSubTab} ${revTab === t ? styles.chartSubTabActive : ''}`} onClick={() => setRevTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chartArea}>
        <MiniLineChart data={chartData} valueKey={valueKey} colorStroke="#870105" />
      </div>
      <div className={styles.aiInsightPill}>
        <span className={styles.aiInsightIcon}>🤖</span>
        <span>{aiInsight}</span>
      </div>
    </div>
  );
}

// ─── Client & AUM Charts ──────────────────────────────────────────────────────
function ClientAUMCharts({ mode }) {
  return (
    <div className={styles.chartsRow}>
      <div className={styles.chartCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon}>👥</div>
            Client Growth Trend
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: '0.72rem', color: 'var(--text-muted)', alignItems: 'center' }}>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><span style={{ width: 8, height: 8, background: '#065f46', borderRadius: 2, display: 'inline-block' }} />New</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><span style={{ width: 8, height: 8, background: '#991b1b', borderRadius: 2, display: 'inline-block' }} />Lost</span>
          </div>
        </div>
        <ClientGrowthChart data={monthlyRevenue} />
        <div className={styles.aiInsightPill}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>Net client growth was +1 in June. January saw highest churn (6 clients lost) — review exit patterns to prevent recurrence.</span>
        </div>
      </div>
      <div className={styles.chartCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon}>📈</div>
            AUM Growth Trend
          </div>
          <span className={styles.sectionBadge}>RM Millions</span>
        </div>
        <div className={styles.chartArea}>
          <AUMChart data={monthlyRevenue} />
        </div>
        <div className={styles.aiInsightPill}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>AUM crossed RM 10M milestone in June 2026. Consistent 8.2% average MoM growth. Top clients Michael Koh and David Wong account for 36% of total AUM.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Product Sales Chart Section ──────────────────────────────────────────────
function ProductSalesSection({ mode }) {
  return (
    <div className={styles.chartCard} style={{ marginBottom: 20 }}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleIcon}>📦</div>
          Product Sales Performance
        </div>
        <span className={styles.sectionBadge}>{mode === 'monthly' ? 'Jun 2026' : 'FY 2025-26'}</span>
      </div>
      <ProductSalesChart mode={mode} />
      <div className={styles.aiInsightPill}>
        <span className={styles.aiInsightIcon}>🤖</span>
        <span>Retirement Planning is your strongest product with {mode === 'monthly' ? '31%' : '28%'} growth. Medical/CI products declined — consider refreshing your client communication on health protection coverage.</span>
      </div>
    </div>
  );
}

// ─── Opportunity Radar Section ────────────────────────────────────────────────
function OpportunityRadar() {
  const urgencyColors = { high: '#991b1b', medium: '#92400e', low: '#065f46' };
  const urgencyBg = { high: '#fef2f2', medium: '#fffbeb', low: '#ecfdf5' };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleIcon}>🎯</div>
          Opportunity Radar
          <span className={styles.sectionBadge} style={{ background: '#fef2f2', color: '#991b1b' }}>AI-Powered</span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {opportunityClients.length} opportunities identified
        </div>
      </div>
      <div style={{ padding: '16px 16px 4px' }}>
        <div className={styles.aiInsightPill} style={{ marginBottom: 12, marginTop: 0 }}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>12 clients are highly suitable for retirement planning discussions this quarter. Total estimated revenue potential: <strong>RM 70,600</strong>.</span>
        </div>
        <div className={styles.opportunityGrid}>
          {opportunityClients.map((client, i) => (
            <div key={client.id} className={styles.opportunityCard}>
              <div className={styles.opRank} style={{ background: i < 3 ? '#ffe4d1' : '#f3f4f6', color: i < 3 ? '#870105' : '#6b7280' }}>
                {i + 1}
              </div>
              <div className={styles.opAvatar} style={{ background: avatarColor(client.name) }}>
                {initials(client.name)}
              </div>
              <div className={styles.opInfo}>
                <div className={styles.opName}>{client.name}</div>
                <div className={styles.opMeta}>
                  Age {client.age} · {client.lifeStage} · {client.income}
                </div>
                <div className={styles.opMeta} style={{ marginTop: 3, color: '#5a5a5a' }}>{client.reason}</div>
                <div className={styles.opScoreBar} style={{ marginTop: 6 }}>
                  <div className={styles.opScoreBarFill} style={{ width: `${client.opportunityScore}%`, background: client.opportunityScore >= 85 ? '#870105' : client.opportunityScore >= 70 ? '#b45309' : '#1e40af' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, minWidth: 110 }}>
                <div className={styles.opProduct}>→ {client.suggestedProduct}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: urgencyBg[client.urgency], color: urgencyColors[client.urgency] }}>
                  {client.urgency.toUpperCase()}
                </div>
                <div className={styles.opRevenue}>{client.revenuePotential}</div>
                <div className={styles.opScore}>
                  <div className={styles.opScoreValue}>{client.opportunityScore}</div>
                  <div className={styles.opScoreLabel}>Score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '8px 16px 16px' }}>
        <div className={styles.aiInsightPill}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>John Tan and Sarah Lim are your top-priority clients this quarter. Acting on these 6 opportunities could generate an estimated <strong>RM 70,600</strong> in new revenue.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Client Health Monitor ────────────────────────────────────────────────────
function ClientHealthMonitor() {
  const statusConfig = {
    healthy:   { cls: styles.statusHealthy,   dot: '#10b981', label: 'Healthy' },
    attention: { cls: styles.statusAttention, dot: '#f59e0b', label: 'Attention Needed' },
    risk:      { cls: styles.statusRisk,      dot: '#ef4444', label: 'High Risk' },
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleIcon}>💚</div>
          Client Health Monitor
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: '0.75rem' }}>
          {Object.entries(statusConfig).map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.dot, display: 'inline-block' }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '8px 16px 0' }}>
        <div className={styles.aiInsightPill} style={{ marginBottom: 0 }}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>⚠️ <strong>2 high-value clients</strong> (Michael Koh – RM 520K, Ben Seah – RM 195K) have not been contacted in over 40 days. Combined AUM at risk: <strong>RM 715,000</strong>.</span>
        </div>
      </div>
      <div className={styles.tableCardBody}>
        <table className={styles.healthTable}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Status</th>
              <th>Last Contact</th>
              <th>Last Meeting</th>
              <th>Engagement</th>
              <th>Churn Risk</th>
              <th>Frequency</th>
              <th>AUM</th>
              <th>Policies</th>
            </tr>
          </thead>
          <tbody>
            {clientHealth.map(c => {
              const cfg = statusConfig[c.status];
              const engColor = c.engagementScore >= 70 ? '#065f46' : c.engagementScore >= 50 ? '#b45309' : '#991b1b';
              const riskColor = c.churnRisk >= 60 ? '#991b1b' : c.churnRisk >= 40 ? '#b45309' : '#065f46';
              return (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className={styles.clientAvatar} style={{ background: avatarColor(c.name) }}>
                        {initials(c.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.notes}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusDot} ${cfg.cls}`}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.lastContact}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.lastMeeting}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className={styles.scoreBar}>
                        <div className={styles.scoreBarFill} style={{ width: `${c.engagementScore}%`, background: engColor }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: engColor }}>{c.engagementScore}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className={styles.scoreBar}>
                        <div className={styles.scoreBarFill} style={{ width: `${c.churnRisk}%`, background: riskColor }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: riskColor }}>{c.churnRisk}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.communicationFreq}</td>
                  <td style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.aum}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{c.policies}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Team Benchmarking ────────────────────────────────────────────────────────
function TeamBenchmarking({ mode }) {
  const { metrics, you, teamAvg, branchAvg, topPerformer, units, ranking, totalAdvisors, percentile, performanceScore } = benchmarkData;
  const colors = { you: '#065f46', team: '#1e40af', branch: '#b45309', top: '#870105' };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleIcon}>🏆</div>
          Team Benchmarking
        </div>
        <span className={styles.sectionBadge}>{mode === 'monthly' ? 'Jun 2026' : 'FY 2025-26'}</span>
      </div>
      <div style={{ padding: '20px' }}>
        <div className={styles.aiInsightPill} style={{ marginBottom: 20 }}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>You outperform <strong>72% of advisors</strong> in client retention. Cross-selling performance is below branch average. Revenue is <strong>20.6% above team average</strong>.</span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          {[['You', colors.you], ['Team Avg', colors.team], ['Branch Avg', colors.branch], ['Top Performer', colors.top]].map(([label, color]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>

        <div className={styles.benchmarkGrid}>
          <div className={styles.benchmarkMetrics}>
            {metrics.map((metric, i) => {
              const topVal = topPerformer[i];
              const rows = [
                { label: 'You',        val: you[i],        color: colors.you,    width: (you[i] / topVal) * 100 },
                { label: 'Team Avg',   val: teamAvg[i],    color: colors.team,   width: (teamAvg[i] / topVal) * 100 },
                { label: 'Branch Avg', val: branchAvg[i],  color: colors.branch, width: (branchAvg[i] / topVal) * 100 },
                { label: 'Top',        val: topPerformer[i], color: colors.top,  width: 100 },
              ];
              return (
                <div key={metric} className={styles.benchmarkRow}>
                  <div className={styles.benchmarkLabel}>{metric}</div>
                  <div className={styles.benchmarkBars}>
                    {rows.map(row => (
                      <div key={row.label} className={styles.benchmarkBarRow}>
                        <div className={styles.benchmarkBarLabel}>{row.label}</div>
                        <div className={styles.benchmarkBar}>
                          <div className={styles.benchmarkBarFill} style={{ width: `${row.width}%`, background: row.color }} />
                        </div>
                        <div className={styles.benchmarkValue} style={{ color: row.color }}>
                          {units[i] === 'RM' ? fmt(row.val, 'RM ') : `${row.val}${units[i]}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className={styles.rankCard}>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Your Ranking</div>
              <div className={styles.rankNumber}>#{ranking}</div>
              <div className={styles.rankTotal}>of {totalAdvisors} advisors</div>
              <div className={styles.rankStat}>
                <div className={styles.rankStatValue}>{percentile}th</div>
                <div className={styles.rankStatLabel}>Percentile</div>
              </div>
              <div className={styles.rankStat}>
                <div className={styles.rankStatValue}>{performanceScore}</div>
                <div className={styles.rankStatLabel}>Performance Score</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <RadarChart data={benchmarkData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Advisor Network Graph Section ────────────────────────────────────────────
function AdvisorNetwork() {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableCardHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionTitleIcon}>🕸️</div>
          Advisor Relationship Network
          <span className={styles.sectionBadge}>Interactive</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.85rem' }}>👆</span>
          Click any node to inspect · Hover to highlight connections
        </div>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div className={styles.aiInsightPill} style={{ marginBottom: 12 }}>
          <span className={styles.aiInsightIcon}>🤖</span>
          <span>Client <strong>Sarah Lim</strong> generated 8 referrals — highest referral value in your network. Your strongest cluster is concentrated in retirement planning clients aged 35–45.</span>
        </div>
        <NetworkGraph />
        <div className={styles.networkLegend} style={{ marginTop: 10 }}>
          <div className={styles.legendItem}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#870105', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#fff', fontWeight: 800 }}>★</div>
            You (Advisor)
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: '#1e40af' }} />
            Clients (varied colours)
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: '#e5e4e8', border: '1.5px solid #c4c0bb' }} />
            Referral Leads
          </div>
          <div className={styles.legendItem}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#fff', fontWeight: 800 }}>3</div>
            Referral count badge
          </div>
          <div className={styles.legendItem} style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ── Client bond &nbsp;·&nbsp; - - - Referral chain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// (ExportPanel removed — export handled via header button)

// ─── MAIN REPORTS PAGE ────────────────────────────────────────────────────────
export default function Reports() {
  const [filterMode, setFilterMode] = useState('monthly');
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      window.print();
      setExporting(false);
    }, 300);
  };

  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Advisor Performance Intelligence</h1>
          <p className={styles.pageSubtitle}>AI-powered analytics · June 2026 · Lim Wei Advisor · AAG Intelligence Engine</p>
        </div>
        <div className={styles.headerRight}>
          {/* Filter */}
          <div className={styles.filterBar}>
            {['monthly','yearly'].map(m => (
              <button key={m} className={`${styles.filterBtn} ${filterMode === m ? styles.filterBtnActive : ''}`} onClick={() => setFilterMode(m)}>
                {m === 'monthly' ? '📅 Monthly' : '📆 Yearly'}
              </button>
            ))}
          </div>
          {/* Export button — triggers print dialog */}
          <button className={styles.exportBtn} onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Preparing…' : '📤 Export PDF'}
          </button>
        </div>
      </div>

      {/* ── AI Executive Summary ── */}
      <AISummary mode={filterMode} />

      {/* ── KPI Cards ── */}
      <KPICards mode={filterMode} />

      {/* ── Revenue Trend + Product Sales ── */}
      <div className={styles.chartsRow}>
        <RevenueTrend mode={filterMode} />
        <ProductSalesSection mode={filterMode} />
      </div>

      {/* ── Client & AUM Charts ── */}
      <ClientAUMCharts mode={filterMode} />

      {/* ── Opportunity Radar ── */}
      <OpportunityRadar />

      {/* ── Client Health Monitor ── */}
      <ClientHealthMonitor />

      {/* ── Team Benchmarking ── */}
      <TeamBenchmarking mode={filterMode} />

      {/* ── Advisor Network Graph ── */}
      <AdvisorNetwork />
    </div>
  );
}
