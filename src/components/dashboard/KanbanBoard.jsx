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
import { GripVertical, Calendar, Tag } from 'lucide-react';
import { mockKanban } from '../../lib/mockData.js';
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

function KanbanCard({ card, isDragging = false }) {
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
      </div>
    </div>
  );
}

function SortableCard({ card }) {
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
      <KanbanCard card={card} />
    </div>
  );
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo:       mockKanban.todo,
    inprogress: mockKanban.inprogress,
    done:       mockKanban.done,
  });
  const [activeCard, setActiveCard] = useState(null);

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

  const allIds = Object.values(columns).flat().map(c => c.id);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Task Board</h3>
        <span className={styles.hint}>Drag cards between columns</span>
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
                  <span className={styles.colCount}>{columns[col.id].length}</span>
                </div>
                <div className={styles.colBody}>
                  <SortableContext
                    items={columns[col.id].map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columns[col.id].map(card => (
                      <SortableCard key={card.id} card={card} />
                    ))}
                  </SortableContext>
                  {columns[col.id].length === 0 && (
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
    </div>
  );
}
