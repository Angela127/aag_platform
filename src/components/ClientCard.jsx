import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, ArrowRight } from 'lucide-react';

// Generate a deterministic color from a name string
function getAvatarColor(name) {
  const colors = [
    'bg-aag-primary', 'bg-rose-600', 'bg-amber-600',
    'bg-emerald-600', 'bg-indigo-600', 'bg-violet-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getScoreColor(score) {
  if (score === undefined || score === null) return { ring: 'text-gray-400', bg: 'bg-gray-50', text: 'text-gray-600', label: 'Pending' };
  if (score >= 80) return { ring: 'text-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Healthy' };
  if (score >= 50) return { ring: 'text-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Needs Attention' };
  return { ring: 'text-red-500', bg: 'bg-red-50', text: 'text-red-700', label: 'High Risk' };
}

export default function ClientCard({ client }) {
  const navigate = useNavigate();
  const initials = getInitials(client.name);
  const avatarColor = getAvatarColor(client.name);
  const scoreStyle = getScoreColor(client.healthScore);
  const nextFollowUp = client.followUps?.find((f) => !f.completed);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-fade-in">
      {/* Top accent stripe */}
      <div className={`h-1 ${
        client.healthScore === undefined || client.healthScore === null ? 'bg-gray-300' :
        client.healthScore >= 80 ? 'bg-emerald-500' :
        client.healthScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
      }`} />

      <div className="p-5">
        {/* Header: Avatar + Info + Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`${avatarColor} w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
              {initials}
            </div>
            <div>
              <h3 className="text-[0.95rem] font-semibold text-gray-900 leading-tight">
                {client.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {[client.age ? `${client.age} yrs` : null, client.occupation].filter(Boolean).join(' · ') || 'New Client Profile'}
              </p>
            </div>
          </div>

          {/* Health Score Circle */}
          <div className={`${scoreStyle.bg} rounded-lg px-2.5 py-1.5 text-center min-w-[56px]`}>
            <p className={`text-lg font-bold ${scoreStyle.text} leading-none`}>
              {client.healthScore !== undefined && client.healthScore !== null ? `${client.healthScore}%` : '--%'}
            </p>
            <p className={`text-[0.6rem] ${scoreStyle.text} font-medium mt-0.5`}>
              {scoreStyle.label}
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={13} className="text-gray-400 shrink-0" />
            <span>Last: {client.lastContact}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText size={13} className="text-gray-400 shrink-0" />
            <span>{client.activePlans} Active Plan{client.activePlans !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Next Follow-up */}
        {nextFollowUp && (
          <div className="bg-gray-50 rounded-lg px-3 py-2.5 mb-4">
            <p className="text-[0.65rem] text-gray-400 uppercase font-semibold tracking-wider mb-0.5">
              Next Follow-up
            </p>
            <p className="text-xs text-gray-700 font-medium leading-snug">
              {nextFollowUp.task}
            </p>
            <p className="text-[0.65rem] text-gray-400 mt-0.5">{nextFollowUp.date}</p>
          </div>
        )}

        {/* View Profile Button */}
        <button
          id={`view-profile-${client.id}`}
          onClick={() => navigate(`/clients/${client.id}`)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-aag-primary border border-aag-primary/20 bg-aag-primary/[0.03] hover:bg-aag-primary hover:text-white transition-all duration-200 cursor-pointer"
        >
          View Profile
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
