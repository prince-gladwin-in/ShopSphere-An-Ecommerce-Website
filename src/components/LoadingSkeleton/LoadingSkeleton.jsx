import styles from './LoadingSkeleton.module.css';

function SkeletonCard() {
  return (
    <div className={`card ${styles.skeletonCard}`} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonImage}`} />
      <div className={styles.skeletonBody}>
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '40%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '80%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '60%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '35%', height: '1.5rem' }} />
        <div className={`skeleton ${styles.skeletonBtn}`} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" role="status" aria-label="Loading products…">
      <span className="sr-only">Loading products…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className={styles.detailSkeleton} role="status" aria-label="Loading product…">
      <span className="sr-only">Loading product…</span>
      <div className={`skeleton ${styles.detailImage}`} />
      <div className={styles.detailBody}>
        {[80, 60, 40, 100, 100, 50].map((w, i) => (
          <div key={i} className={`skeleton ${styles.skeletonLine}`} style={{ width: `${w}%`, height: i === 0 ? '2rem' : '1rem' }} />
        ))}
        <div className={`skeleton ${styles.skeletonBtn}`} style={{ width: '160px' }} />
      </div>
    </div>
  );
}
