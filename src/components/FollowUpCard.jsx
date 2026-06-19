import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Flag, Plus, X } from 'lucide-react';

const PRIORITY_CONFIG = {
  high: { color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', icon: AlertTriangle, iconColor: 'text-red-500', label: 'High' },
  medium: { color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: Flag, iconColor: 'text-amber-500', label: 'Medium' },
  low: { color: 'bg-gray-50 border-gray-200', badge: 'bg-gray-100 text-gray-600', icon: Clock, iconColor: 'text-gray-400', label: 'Low' },
};

export default function FollowUpCard({ followUps = [], onToggleFollowUp, onAddFollowUp }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const normalizedFollowUps = (followUps || []).map((f, i) => ({
    ...f,
    id: i,
    completed: f.completed || false,
  }));

  const pending = normalizedFollowUps.filter((f) => !f.completed);
  const completed = normalizedFollowUps.filter((f) => f.completed);

  const handleToggle = (id) => {
    if (onToggleFollowUp) {
      onToggleFollowUp(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim() || !date) return;

    // Convert date "YYYY-MM-DD" to "D MMM YYYY" (e.g., "25 Jun 2026")
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (onAddFollowUp) {
      onAddFollowUp({
        task: task.trim(),
        date: formattedDate,
        priority,
        completed: false,
      });
    }

    setTask('');
    setDate('');
    setPriority('medium');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Follow-up Actions</h3>
        </div>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <span className="text-[0.7rem] font-semibold text-aag-primary bg-aag-accent px-2 py-0.5 rounded-full">
              {pending.length} pending
            </span>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-aag-primary transition-colors cursor-pointer"
            title="Add Follow-up"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3 animate-slide-up">
          <div>
            <label className="text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Task Description</label>
            <input
              type="text"
              placeholder="e.g. Schedule policy review"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 bg-white outline-none focus:border-aag-primary focus:ring-1 focus:ring-aag-primary/20"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Due Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 bg-white outline-none focus:border-aag-primary focus:ring-1 focus:ring-aag-primary/20"
                required
              />
            </div>
            <div>
              <label className="text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 bg-white outline-none focus:border-aag-primary"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setTask('');
                setDate('');
                setPriority('medium');
              }}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-1.5 rounded-lg bg-aag-primary text-white text-xs font-medium hover:bg-aag-primary-dark transition-colors cursor-pointer"
            >
              Add Action
            </button>
          </div>
        </form>
      )}

      <div className="p-4 space-y-2.5">
        {normalizedFollowUps.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No follow-ups scheduled.</p>
        ) : (
          <>
            {/* Pending */}
            {pending.map((f) => {
              const config = PRIORITY_CONFIG[f.priority] || PRIORITY_CONFIG.low;
              const Icon = config.icon;
              return (
                <div
                  key={f.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${config.color} transition-all duration-200 animate-fade-in`}
                >
                  <button
                    onClick={() => handleToggle(f.id)}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 hover:border-aag-primary flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    title="Mark as done"
                  >
                    {/* empty checkbox */}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${config.badge}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium mt-1">{f.task}</p>
                    <p className="text-[0.7rem] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock size={11} /> {f.date}
                    </p>
                  </div>
                  <Icon size={16} className={`${config.iconColor} shrink-0 mt-1`} />
                </div>
              );
            })}

            {/* Completed */}
            {completed.length > 0 && (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="text-[0.65rem] uppercase font-semibold text-gray-400 tracking-wider mb-2">
                  Completed
                </p>
                {completed.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 mb-1.5 animate-fade-in"
                  >
                    <button
                      onClick={() => handleToggle(f.id)}
                      className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center shrink-0 cursor-pointer"
                      title="Mark as pending"
                    >
                      <CheckCircle2 size={14} className="text-white" />
                    </button>
                    <p className="text-sm text-gray-400 line-through flex-1">{f.task}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
