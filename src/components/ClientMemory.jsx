import { Brain, Users, Heart, CalendarDays, Eye, Star, Baby } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Meeting Summary': { icon: CalendarDays, color: 'bg-blue-100 text-blue-600', dotColor: 'bg-blue-500' },
  'Advisor Observation': { icon: Eye, color: 'bg-violet-100 text-violet-600', dotColor: 'bg-violet-500' },
  'Client Preference': { icon: Star, color: 'bg-amber-100 text-amber-600', dotColor: 'bg-amber-500' },
  'Life Event': { icon: Baby, color: 'bg-emerald-100 text-emerald-600', dotColor: 'bg-emerald-500' },
};

export default function ClientMemory({ client }) {
  if (!client) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
        <p className="text-sm text-gray-500">No memory data available.</p>
      </div>
    );
  }

  // Reconstruct the snapshot preferences dynamically from client fields
  const preferences = [];
  if (client.specialPreferences?.birthday) {
    preferences.push(`Birthday: ${client.specialPreferences.birthday}`);
  }
  if (client.specialPreferences?.notes) {
    const noteItems = client.specialPreferences.notes
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    preferences.push(...noteItems);
  }
  if (preferences.length === 0) {
    preferences.push('No preferences recorded');
  }

  const summary = client.memorySummary || client.needsSummary || 'No AI Client Memory summary available yet.';
  const timeline = client.memoryTimeline || [];

  return (
    <div className="space-y-5">
      {/* Client Snapshot */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Client Snapshot</h3>
        </div>
        <div className="p-5 grid sm:grid-cols-3 gap-4">
          {/* Family */}
          <div className="bg-gray-50 rounded-lg p-3.5">
            <p className="text-[0.65rem] uppercase font-semibold text-gray-400 tracking-wider mb-1.5">
              Family Details
            </p>
            <p className="text-sm text-gray-700">{client.familyDetails || 'Not specified'}</p>
          </div>

          {/* Preferences */}
          <div className="bg-gray-50 rounded-lg p-3.5">
            <p className="text-[0.65rem] uppercase font-semibold text-gray-400 tracking-wider mb-1.5">
              Special Preferences
            </p>
            <ul className="space-y-1">
              {preferences.map((pref, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                  <span className="text-aag-primary mt-0.5 shrink-0">•</span>
                  {pref}
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Profile */}
          <div className="bg-gray-50 rounded-lg p-3.5">
            <p className="text-[0.65rem] uppercase font-semibold text-gray-400 tracking-wider mb-1.5">
              Risk Profile
            </p>
            <p className="text-sm text-gray-700">{client.riskLevel || 'Medium'}</p>
          </div>
        </div>
      </div>

      {/* AI Memory Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Brain size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">AI Client Memory</h3>
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-aag-accent text-aag-primary text-[0.65rem] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-aag-primary animate-pulse-slow" />
            RAG Powered
          </span>
        </div>
        <div className="p-5">
          <div className="bg-gradient-to-br from-gray-50 to-aag-accent/20 rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      </div>

      {/* Memory Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Heart size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Memory Timeline</h3>
        </div>
        <div className="p-5">
          {timeline.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No timeline events recorded yet.</p>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="space-y-4">
                {timeline.map((event, i) => {
                  const config = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['Meeting Summary'];
                  const Icon = config.icon;
                  return (
                    <div key={i} className="flex items-start gap-3.5 relative animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                      {/* Dot */}
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${config.color} shrink-0 z-10 ring-2 ring-white`}>
                        <Icon size={14} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-800">{event.date}</span>
                          <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${config.color}`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
