import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/productApi';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((items) => setCategories(items.slice(0, 6)))
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="ShopSphere home">
            <span className={styles.logoIcon}>S</span>
            <span className={styles.logoText}>ShopSphere</span>
          </Link>
          <p className={styles.tagline}>Discover. Compare. Shop Smarter.</p>
          <p className={styles.desc}>
            Your destination for curated essentials across electronics, beauty, fashion, home, and more.
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Shop</h3>
            <ul role="list">
              <li><Link to="/products" className={styles.colLink}>All Products</Link></li>
              {categories.map((category) => (
                <li key={category.slug}><Link to={`/products?category=${category.slug}`} className={styles.colLink}>{category.name}{typeof category.count === 'number' ? ` (${category.count})` : ''}</Link></li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Account</h3>
            <ul role="list">
              <li><Link to="/cart" className={styles.colLink}>Cart</Link></li>
              <li><Link to="/wishlist" className={styles.colLink}>Wishlist</Link></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Company</h3>
            <ul role="list">
              <li><Link to="/about" className={styles.colLink}>About Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {year} ShopSphere. Built for everyday shopping.</p>
        <p>Curated for Indian shoppers.</p>
      </div>
    </footer>
  );
}
