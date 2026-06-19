import { CheckCircle2, AlertTriangle } from 'lucide-react';

function getScoreColor(score) {
  if (score >= 80) return { stroke: '#10b981', bg: '#ecfdf5', label: 'Healthy', textColor: 'text-emerald-700' };
  if (score >= 50) return { stroke: '#f59e0b', bg: '#fffbeb', label: 'Needs Attention', textColor: 'text-amber-700' };
  return { stroke: '#ef4444', bg: '#fef2f2', label: 'High Risk', textColor: 'text-red-700' };
}

export default function HealthScore({ client }) {
  const score = client.healthScore;
  const factors = client.healthFactors;
  const style = getScoreColor(score);

  // SVG circle params
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const healthItems = [
    {
      ok: factors.recentContact,
      label: 'Recency of Contact',
      good: 'Contacted recently',
      bad: 'Not contacted in over 30 days',
    },
    {
      ok: factors.planComplete,
      label: 'Plan Completeness',
      good: 'All policy information complete',
      bad: 'Incomplete policy coverage',
    },
    {
      ok: !factors.renewalSoon,
      label: 'Upcoming Renewals',
      good: 'No renewals due soon',
      bad: 'Renewal due within 30 days',
    },
    {
      ok: factors.outstandingFollowUps === 0,
      label: 'Outstanding Follow-ups',
      good: 'No pending follow-ups',
      bad: `${factors.outstandingFollowUps} pending follow-up${factors.outstandingFollowUps !== 1 ? 's' : ''}`,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Client Health Score</h3>
      </div>

      <div className="p-5">
        {/* Circular Score */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
              />
              {/* Score ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={style.stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{score}%</span>
              <span className={`text-xs font-medium ${style.textColor}`}>{style.label}</span>
            </div>
          </div>
        </div>

        {/* Health Breakdown */}
        <div className="space-y-2.5">
          {healthItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg ${
                item.ok ? 'bg-emerald-50/60' : 'bg-amber-50/60'
              }`}
            >
              {item.ok ? (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                <p className="text-[0.7rem] text-gray-500 mt-0.5">
                  {item.ok ? item.good : item.bad}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
