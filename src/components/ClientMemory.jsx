import { Brain, Users, Heart, CalendarDays, Eye, Star, Baby, Target, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Meeting Summary': { icon: CalendarDays, color: 'bg-blue-100 text-blue-600', dotColor: 'bg-blue-500' },
  'Advisor Observation': { icon: Eye, color: 'bg-violet-100 text-violet-600', dotColor: 'bg-violet-500' },
  'Client Preference': { icon: Star, color: 'bg-amber-100 text-amber-600', dotColor: 'bg-amber-500' },
  'Life Event': { icon: Baby, color: 'bg-emerald-100 text-emerald-600', dotColor: 'bg-emerald-500' },
};

// Client specific goals and insights data
const CLIENT_INTELLIGENCE = {
  'Sarah Lim': {
    goals: [
      { name: 'Retire Early by Age 50', target: '$1,500,000', progress: 65, status: 'On Track' },
      { name: 'Children College Savings', target: '$300,000', progress: 40, status: 'Needs Boost' },
      { name: 'Comprehensive Medical Buffer', target: '$500,000', progress: 90, status: 'Secured' }
    ],
    insights: {
      opportunities: 'High interest in sustainable ESG funds. Suggest Allianz Malaysian ESG Growth Fund (expected 7.8% yield).',
      concerns: 'Has a critical insurance gap of 30% in critical illness multiplier riders relative to family budget.',
      priorities: 'Schedule education fund sign-off session. Check declarations on health application.'
    }
  },
  'Marcus Chen': {
    goals: [
      { name: 'Estate Legacy Planning', target: '$3,000,000', progress: 30, status: 'Behind' },
      { name: 'Passive Dividend Yield Portfolio', target: '$120k/yr', progress: 55, status: 'On Track' }
    ],
    insights: {
      opportunities: 'Refinance commercial property mortgage via partner Speedy Mortgage. Free up cash flow.',
      concerns: 'Extremely high risk profile but only carries a single term policy. No health umbrella.',
      priorities: 'Schedule critical overdue review. Finalize will trust draft with legal team.'
    }
  },
  'Priya Nair': {
    goals: [
      { name: 'First Property Down Payment', target: '$150,000', progress: 75, status: 'On Track' },
      { name: 'Investment-Linked Growth Plan', target: '$300,000', progress: 30, status: 'Early Stage' }
    ],
    insights: {
      opportunities: 'Convert standard saving scheme to high-yield unit trusts. Interest in digital assets.',
      concerns: 'High medical expenses; deductible settings on insurance plans are set too high.',
      priorities: 'Confirm hospital declarations document submission.'
    }
  },
  'David Wong': {
    goals: [
      { name: 'Medical Business Expansion Fund', target: '$500,000', progress: 85, status: 'Secured' },
      { name: 'Legacy Trust Allocation', target: '$2,000,000', progress: 50, status: 'On Track' }
    ],
    insights: {
      opportunities: 'Tax relief optimization via retirement annuity plans. Introduce lawyer partner Bailiff & Co.',
      concerns: 'Extremely busy surgeon schedule prevents regular contact, increasing policy churn risks.',
      priorities: 'Follow up on medical declarations before the policy issue deadline.'
    }
  },
  'Aisha Rahman': {
    goals: [
      { name: 'Family Medical Protection Fund', target: '$400,000', progress: 20, status: 'Behind' },
      { name: 'Shariah Investment Growth', target: '$1,000,000', progress: 45, status: 'On Track' }
    ],
    insights: {
      opportunities: 'Introduce Prudential Shariah-compliant ILP scheme for high-yield returns.',
      concerns: 'Low compliance documentation score; recent contact lapse has delayed plan updates.',
      priorities: 'Organize maternity cover checklist before child delivery.'
    }
  }
};

export default function ClientMemory({ client }) {
  if (!client) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
        <p className="text-sm text-gray-500">No memory data available.</p>
      </div>
    );
  }

  // Reconstruct preferences dynamically
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

  const intel = CLIENT_INTELLIGENCE[client.name] || {
    goals: [
      { name: 'General Financial Security', target: 'N/A', progress: 50, status: 'On Track' }
    ],
    insights: {
      opportunities: 'Introduce primary medical health riders.',
      concerns: 'No review recorded in 90 days.',
      priorities: 'Verify basic onboarding documents.'
    }
  };

  const summary = client.memorySummary || client.needsSummary || 'No AI Client Memory summary available yet.';
  const timeline = client.memoryTimeline || [];

  return (
    <div className="space-y-6">
      
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

      {/* Financial Goals & Wealth Plan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Target size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Wealth & Financial Goals</h3>
        </div>
        
        <div className="p-5 space-y-4">
          {intel.goals.map((goal, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-800">{goal.name}</span>
                <span className="text-gray-500 font-medium">{goal.target} · <span className="text-aag-primary-light font-bold">{goal.status}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${goal.progress}%`,
                      backgroundColor: goal.progress >= 80 ? '#10b981' : goal.progress >= 50 ? '#f59e0b' : '#dc2626'
                    }} 
                  />
                </div>
                <span className="text-xs font-bold text-gray-600 w-8 text-right">{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations & Insights Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Sparkles size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">AI Recommendation & Insights</h3>
        </div>
        
        <div className="p-5 grid sm:grid-cols-3 gap-4">
          {/* Opportunities */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Opportunities
            </h4>
            <p className="text-sm text-emerald-950 leading-relaxed">{intel.insights.opportunities}</p>
          </div>

          {/* Concerns */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-4">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              Concerns
            </h4>
            <p className="text-sm text-rose-950 leading-relaxed">{intel.insights.concerns}</p>
          </div>

          {/* Priorities */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Brain size={14} />
              Priorities
            </h4>
            <p className="text-sm text-amber-950 leading-relaxed">{intel.insights.priorities}</p>
          </div>
        </div>
      </div>

      {/* AI Memory Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Brain size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">AI Client Memory</h3>
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-aag-accent text-aag-primary text-[0.65rem] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-aag-primary animate-pulse" />
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
