import { Link, useLocation } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import styles from './NotFound.module.css';

export default function NotFound() {
  usePageTitle('404 — Page Not Found');
  const location = useLocation();

  return (
    <main className={styles.page} aria-labelledby="notfound-heading">
      <div className={styles.content}>
        <span className={styles.code} aria-hidden="true">404</span>
        <h1 id="notfound-heading" className={styles.title}>Page Not Found</h1>
        <p className={styles.desc}>
          The page <code className={styles.path}>{location.pathname}</code> doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary btn-lg">🏠 Back to Home</Link>
          <Link to="/products" className="btn btn-secondary btn-lg">🛍️ Browse Products</Link>
        </div>
      </div>
    </main>
  );
}
