import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, Tag, Filter, ArrowRight, X, Plus } from 'lucide-react';
import styles from './KanbanBoard.module.css';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#dc2626', bg: '#fef2f2' },
  medium: { label: 'Medium', color: '#d97706', bg: '#fffbeb' },
  low:    { label: 'Low',    color: '#16a34a', bg: '#f0fdf4' },
};

const COLUMNS = [
  { id: 'todo',       label: 'To-Do',       accent: '#6366f1' },
  { id: 'inprogress', label: 'In Progress',  accent: '#d97706' },
  { id: 'done',       label: 'Done',         accent: '#16a34a' },
];

function KanbanCard({ card, columnId, onMove, isDragging = false }) {
  const p = PRIORITY_CONFIG[card.priority];
  return (
    <div className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.priorityDot} style={{ background: p.color }} />
        <span className={styles.cardClient}>
          <Tag size={11} /> {card.client}
        </span>
        <span className={styles.priorityBadge} style={{ color: p.color, background: p.bg }}>
          {p.label}
        </span>
      </div>
      <p className={styles.cardTask}>{card.task}</p>
      <div className={styles.cardFooter}>
        <span className={styles.dueDate}>
          <Calendar size={11} />
          {new Date(card.dueDate).toLocaleDateString('en-SG', { day:'numeric', month:'short' })}
        </span>
        {columnId !== 'done' && onMove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(card.id, columnId);
            }}
            className={styles.moveBtn}
            title={columnId === 'todo' ? 'Move to In Progress' : 'Move to Done'}
          >
            <span>{columnId === 'todo' ? 'Start' : 'Complete'}</span>
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

function SortableCard({ card, columnId, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={14} />
      </div>
      <KanbanCard card={card} columnId={columnId} onMove={onMove} />
    </div>
  );
}

export default function KanbanBoard({ selectedDate, columns, setColumns }) {
  const [isFiltered, setIsFiltered] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  // Task creation form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [due, setDue] = useState(selectedDate);
  const [priority, setPriority] = useState('medium');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const findColumn = (id) => {
    for (const [colId, cards] of Object.entries(columns)) {
      if (cards.find(c => c.id === id)) return colId;
    }
    return null;
  };

  const handleDragStart = ({ active }) => {
    const colId = findColumn(active.id);
    const card = columns[colId]?.find(c => c.id === active.id);
    setActiveCard(card);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);
    if (!over) return;

    const fromCol = findColumn(active.id);
    const toCol = findColumn(over.id) || over.id; // over could be column itself

    if (!fromCol) return;

    if (fromCol === toCol) {
      const items = columns[fromCol];
      const oldIdx = items.findIndex(c => c.id === active.id);
      const newIdx = items.findIndex(c => c.id === over.id);
      if (oldIdx !== newIdx) {
        setColumns(prev => ({ ...prev, [fromCol]: arrayMove(items, oldIdx, newIdx) }));
      }
    } else {
      const card = columns[fromCol].find(c => c.id === active.id);
      setColumns(prev => ({
        ...prev,
        [fromCol]: prev[fromCol].filter(c => c.id !== active.id),
        [toCol]:   [...prev[toCol], card],
      }));
    }
  };

  // Move task card to next status via quick-action button
  const handleMoveCard = (cardId, currentColId) => {
    const nextColMap = {
      todo: 'inprogress',
      inprogress: 'done',
    };
    const toCol = nextColMap[currentColId];
    if (!toCol) return;

    setColumns(prev => {
      const card = prev[currentColId].find(c => c.id === cardId);
      if (!card) return prev;
      return {
        ...prev,
        [currentColId]: prev[currentColId].filter(c => c.id !== cardId),
        [toCol]: [...prev[toCol], card],
      };
    });
  };

  // Open the add task modal and prefill the due date
  const handleOpenModal = () => {
    setClientName('');
    setTaskDesc('');
    setDue(selectedDate);
    setPriority('medium');
    setShowAddModal(true);
  };

  // Handle task submission
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !taskDesc.trim() || !due) {
      return;
    }

    const newTask = {
      id: `k_${Date.now()}`,
      client: clientName.trim(),
      task: taskDesc.trim(),
      dueDate: due,
      priority: priority,
    };

    setColumns(prev => ({
      ...prev,
      todo: [newTask, ...prev.todo],
    }));

    setShowAddModal(false);
  };

  // Compute tasks to display based on isFiltered setting
  const displayColumns = {};
  for (const [colId, cards] of Object.entries(columns)) {
    displayColumns[colId] = isFiltered
      ? cards.filter(c => c.dueDate === selectedDate)
      : cards;
  }

  const allIds = Object.values(displayColumns).flat().map(c => c.id);

  // Format selected date safely for display
  const formatSelectedDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Task Board</h3>
          <span className={styles.hint}>
            {isFiltered
              ? `Showing tasks due on ${formatSelectedDate(selectedDate)}`
              : 'Showing all tasks'} · Drag cards or use buttons to move
          </span>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleOpenModal}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={13} />
            New Task
          </button>
          <button
            onClick={() => setIsFiltered(!isFiltered)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Filter size={13} />
            {isFiltered ? 'Show All' : `Filter by Date (${formatSelectedDate(selectedDate)})`}
          </button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
          <div className={styles.board}>
            {COLUMNS.map(col => (
              <div
                key={col.id}
                className={styles.column}
                id={col.id}
              >
                <div className={styles.colHeader}>
                  <div className={styles.colDot} style={{ background: col.accent }} />
                  <span className={styles.colLabel}>{col.label}</span>
                  <span className={styles.colCount}>{displayColumns[col.id].length}</span>
                </div>
                <div className={styles.colBody}>
                  <SortableContext
                    items={displayColumns[col.id].map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {displayColumns[col.id].map(card => (
                      <SortableCard
                        key={card.id}
                        card={card}
                        columnId={col.id}
                        onMove={handleMoveCard}
                      />
                    ))}
                  </SortableContext>
                  {displayColumns[col.id].length === 0 && (
                    <div className={styles.emptyCol}>No tasks here</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeCard && <KanbanCard card={activeCard} isDragging />}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal Form */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>Create New Task</h4>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="clientName">Client Name</label>
                  <input
                    id="clientName"
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder="Enter client name (e.g., John Tan)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="taskDesc">Task Details</label>
                  <textarea
                    id="taskDesc"
                    required
                    className={styles.formTextarea}
                    placeholder="Describe the task..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="dueDate">Due Date</label>
                    <input
                      id="dueDate"
                      type="date"
                      required
                      className={styles.formInput}
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      className={styles.formSelect}
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
