import { Shield, CalendarDays, DollarSign, FileCheck } from 'lucide-react';

const PLAN_ICONS = {
  'Life Insurance': Shield,
  'Term Life Insurance': Shield,
  'Whole Life Insurance': Shield,
  'Medical Insurance': Shield,
  'Takaful Plan': Shield,
  'Investment Plan': DollarSign,
  'Investment-Linked Plan': DollarSign,
  'Unit Trust (Growth)': DollarSign,
  'Education Fund': FileCheck,
  'Education Fund (Child 1)': FileCheck,
  'Education Fund (Child 2)': FileCheck,
};

export default function PolicyCard({ plans }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-5">
        <p className="text-sm text-gray-500">No active plans.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Active Plans & Policies</h3>
        </div>
        <span className="text-[0.7rem] text-gray-400 font-medium">{plans.length} plan{plans.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="p-4 space-y-3">
        {plans.map((plan, i) => {
          const Icon = PLAN_ICONS[plan.name] || Shield;
          return (
            <div
              key={i}
              className="flex items-start gap-3.5 p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-9 h-9 rounded-lg bg-aag-accent flex items-center justify-center shrink-0">
                <Icon size={16} className="text-aag-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900">{plan.name}</h4>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} className="text-gray-400" />
                    {plan.premium}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} className="text-gray-400" />
                    Renewal: {plan.renewal}
                  </span>
                  {plan.coverage && (
                    <span className="flex items-center gap-1">
                      <Shield size={12} className="text-gray-400" />
                      Coverage: {plan.coverage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
