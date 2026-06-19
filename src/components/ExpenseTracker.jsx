import { useState, useEffect } from 'react';
import { Receipt, Plus, X, Gift, Utensils, Music, Ticket, MoreHorizontal } from 'lucide-react';

const TYPE_CONFIG = {
  Gift: { color: 'bg-pink-100 text-pink-700', icon: Gift },
  Entertainment: { color: 'bg-violet-100 text-violet-700', icon: Music },
  Meal: { color: 'bg-amber-100 text-amber-700', icon: Utensils },
  Event: { color: 'bg-blue-100 text-blue-700', icon: Ticket },
  Other: { color: 'bg-gray-100 text-gray-700', icon: MoreHorizontal },
};

const EXPENSE_TYPES = ['Gift', 'Entertainment', 'Meal', 'Event', 'Other'];

export default function ExpenseTracker({ initialExpenses, onAddExpense }) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Gift', description: '', amount: '', date: '' });

  // Sync internal state when initialExpenses changes from the database
  useEffect(() => {
    setExpenses(initialExpenses || []);
  }, [initialExpenses]);

  // Parse RM amounts to numbers for total calculation
  const parseAmount = (amtStr) => {
    const num = parseFloat(amtStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const total = expenses.reduce((sum, exp) => sum + parseAmount(exp.amount), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    const newExpense = {
      type: form.type,
      description: form.description,
      amount: form.amount.startsWith('RM') ? form.amount : `RM${form.amount}`,
      date: form.date,
    };
    if (onAddExpense) {
      await onAddExpense(newExpense);
    } else {
      setExpenses((prev) => [newExpense, ...prev]);
    }
    setForm({ type: 'Gift', description: '', amount: '', date: '' });
    setShowForm(false);
  };


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Expense Tracker</h3>
        </div>
        <button
          id="add-expense-btn"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-medium text-aag-primary hover:text-aag-primary-dark transition-colors cursor-pointer"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Running Total */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs text-gray-500">
          Total spent this year:{' '}
          <span className="font-semibold text-gray-900">RM{total.toFixed(0)}</span>
        </p>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="px-5 py-4 border-b border-gray-100 bg-aag-accent/10 animate-slide-up">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[0.7rem] font-medium text-gray-600 mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-aag-primary"
              >
                {EXPENSE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.7rem] font-medium text-gray-600 mb-1 block">Amount (RM)</label>
              <input
                type="text"
                placeholder="e.g. 150"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-aag-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[0.7rem] font-medium text-gray-600 mb-1 block">Description</label>
              <input
                type="text"
                placeholder="e.g. Birthday hamper"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-aag-primary"
              />
            </div>
            <div>
              <label className="text-[0.7rem] font-medium text-gray-600 mb-1 block">Date</label>
              <input
                type="text"
                placeholder="e.g. 15 June 2026"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-aag-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-aag-primary text-white text-sm font-medium hover:bg-aag-primary-dark transition-colors cursor-pointer"
          >
            Add Expense
          </button>
        </form>
      )}

      {/* Expense List */}
      <div className="p-4 space-y-2.5 max-h-[300px] overflow-y-auto">
        {expenses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No expenses recorded yet.</p>
        ) : (
          expenses.map((exp, i) => {
            const config = TYPE_CONFIG[exp.type] || TYPE_CONFIG.Other;
            const Icon = config.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors animate-fade-in"
              >
                <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${config.color}`}>
                      {exp.type}
                    </span>
                    <span className="text-[0.65rem] text-gray-400">{exp.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5 truncate">{exp.description}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 shrink-0">{exp.amount}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
