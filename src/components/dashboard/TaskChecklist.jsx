import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Play, CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import clients from '../../data/clients.js';
import styles from './TaskChecklist.module.css';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#dc2626', bg: '#fef2f2' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fffbeb' },
  low:    { label: 'Low',    color: '#16a34a', bg: '#f0fdf4' },
};

export default function TaskChecklist({ selectedDate, columns, setColumns }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [due, setDue] = useState(selectedDate);

  // Group today's tasks
  const getTasksByDate = (date) => {
    const todo = (columns.todo || []).map(t => ({ ...t, status: 'todo' }));
    const inprogress = (columns.inprogress || []).map(t => ({ ...t, status: 'inprogress' }));
    const done = (columns.done || []).map(t => ({ ...t, status: 'done' }));
    
    return [...todo, ...inprogress, ...done].filter(t => t.dueDate === date);
  };

  const todayTasks = getTasksByDate(selectedDate);

  const handleStartTask = (taskId) => {
    setColumns(prev => {
      const task = prev.todo.find(t => t.id === taskId);
      if (!task) return prev;
      return {
        ...prev,
        todo: prev.todo.filter(t => t.id !== taskId),
        inprogress: [task, ...prev.inprogress]
      };
    });
  };

  const handleCompleteTask = (taskId, currentStatus) => {
    setColumns(prev => {
      let task;
      let newTodo = prev.todo;
      let newInprogress = prev.inprogress;

      if (currentStatus === 'todo') {
        task = prev.todo.find(t => t.id === taskId);
        newTodo = prev.todo.filter(t => t.id !== taskId);
      } else if (currentStatus === 'inprogress') {
        task = prev.inprogress.find(t => t.id === taskId);
        newInprogress = prev.inprogress.filter(t => t.id !== taskId);
      }

      if (!task) return prev;
      return {
        ...prev,
        todo: newTodo,
        inprogress: newInprogress,
        done: [task, ...prev.done]
      };
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;

    const newTask = {
      id: `task_${Date.now()}`,
      client: clientName.trim() || 'General Action',
      task: taskDesc.trim(),
      dueDate: due,
      priority: priority
    };

    setColumns(prev => ({
      ...prev,
      todo: [newTask, ...prev.todo]
    }));

    setClientName('');
    setTaskDesc('');
    setPriority('medium');
    setShowAddForm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Today's Action Items</h3>
          <p className={styles.subtitle}>
            {todayTasks.filter(t => t.status !== 'done').length} remaining of {todayTasks.length} tasks
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setDue(selectedDate);
          }}
          className={styles.addBtn}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTask} className={styles.addForm}>
          <h4 className={styles.formTitle}>Add Quick Task</h4>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Client Name</label>
              <input
                type="text"
                placeholder="Client Name (optional)"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className={styles.select}
              >
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Task Description</label>
            <textarea
              required
              rows={2}
              placeholder="e.g., Finalize insurance calculation proposals..."
              value={taskDesc}
              onChange={e => setTaskDesc(e.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              required
              value={due}
              onChange={e => setDue(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className={styles.taskList}>
        {todayTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <Sparkles size={20} className={styles.emptyIcon} />
            <p>All clean! No tasks due on this date.</p>
          </div>
        ) : (
          todayTasks.map(task => {
            const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            
            // Check if client is registered in database to resolve link
            const clientObj = clients.find(c => c.name === task.client);
            const targetUrl = clientObj ? `/clients/${clientObj.id}` : null;

            return (
              <div
                key={task.id}
                className={`${styles.taskItem} ${task.status === 'done' ? styles.taskDone : ''} ${
                  task.status === 'inprogress' ? styles.taskProgress : ''
                }`}
              >
                <div className={styles.taskContent}>
                  <div className={styles.taskHeader}>
                    {targetUrl ? (
                      <Link to={targetUrl} className={styles.clientLink}>
                        👤 {task.client}
                      </Link>
                    ) : (
                      <span className={styles.clientName}>
                        👤 {task.client}
                      </span>
                    )}

                    <span
                      className={styles.priorityBadge}
                      style={{ color: p.color, backgroundColor: p.bg }}
                    >
                      {p.label}
                    </span>

                    {task.status === 'inprogress' && (
                      <span className={styles.statusBadgeProgress}>
                        In Progress
                      </span>
                    )}
                  </div>
                  
                  <p className={styles.taskText}>{task.task}</p>
                </div>

                <div className={styles.actions}>
                  {task.status === 'todo' && (
                    <>
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className={styles.btnStart}
                        title="Start working on this task"
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Start</span>
                      </button>
                      <button
                        onClick={() => handleCompleteTask(task.id, 'todo')}
                        className={styles.btnComplete}
                        title="Complete task"
                      >
                        <Check size={12} />
                        <span>Complete</span>
                      </button>
                    </>
                  )}

                  {task.status === 'inprogress' && (
                    <button
                      onClick={() => handleCompleteTask(task.id, 'inprogress')}
                      className={styles.btnComplete}
                      title="Mark task as done"
                    >
                      <Check size={12} />
                      <span>Complete</span>
                    </button>
                  )}

                  {task.status === 'done' && (
                    <div className={styles.doneCheck} title="Completed">
                      <CheckCircle2 size={16} />
                      <span>Done</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
