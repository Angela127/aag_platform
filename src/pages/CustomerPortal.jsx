import ChatWidget from '../components/chat/ChatWidget.jsx';
import styles from './CustomerPortal.module.css';

export default function CustomerPortal() {
  return (
    <div className={styles.page}>
      <div className={styles.chatWrapper}>
        <ChatWidget isInline={true} />
      </div>
    </div>
  );
}
