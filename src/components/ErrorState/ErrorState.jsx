import styles from './ErrorState.module.css';

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry = null,
}) {
  return (
    <div className={styles.error} role="alert">
      <span className={styles.icon} aria-hidden="true">⚠️</span>
      <h2 className={styles.title}>Oops! Something went wrong</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
