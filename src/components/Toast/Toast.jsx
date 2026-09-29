import { useToast } from '../../context/ToastContext';
import styles from './Toast.module.css';

const icons = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]} ${toast.exiting ? styles.exit : ''}`}
          role="alert"
        >
          <span className={styles.icon} aria-hidden="true">{icons[toast.type]}</span>
          <p className={styles.message}>{toast.message}</p>
          <button
            className={styles.close}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
