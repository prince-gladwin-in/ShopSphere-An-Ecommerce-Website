import styles from './EmptyState.module.css';

export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message = '',
  action = null,
}) {
  return (
    <div className={styles.empty} role="status">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
}
