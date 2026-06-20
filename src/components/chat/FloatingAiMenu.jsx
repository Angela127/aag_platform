import PropTypes from 'prop-types';
import { X, CornerDownLeft } from 'lucide-react';
import styles from './ChatWidget.module.css';

export default function FloatingAiMenu({ bullets, onSelect, onDismiss }) {
  if (!bullets || bullets.length === 0) return null;

  return (
    <div className={styles.floatingAiMenuContainer}>
      <div className={styles.floatingAiMenuHeader}>
        <h4>Suggested Responses</h4>
        <button className={styles.floatingAiMenuClose} onClick={onDismiss}>
          <X size={16} />
        </button>
      </div>
      
      <div className={styles.floatingAiMenuList}>
        {bullets.map((bullet, index) => (
          <button 
            key={index} 
            className={styles.floatingAiMenuOption}
            onClick={() => onSelect(bullet)}
          >
            <span className={styles.floatingAiMenuNumber}>{index + 1}</span>
            <span className={styles.floatingAiMenuText}>{bullet}</span>
            <CornerDownLeft size={14} className={styles.floatingAiMenuIcon} />
          </button>
        ))}
      </div>
      
      <div className={styles.floatingAiMenuFooter}>
        <button className={styles.floatingAiMenuSkip} onClick={onDismiss}>
          Skip
        </button>
      </div>
    </div>
  );
}

FloatingAiMenu.propTypes = {
  bullets: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired
};
