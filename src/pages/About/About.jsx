import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import styles from './About.module.css';

const TEAM = [
  { name: 'Product Vision', role: 'Capstone Project', emoji: '🎯' },
  { name: 'Frontend Architecture', role: 'React + Vite', emoji: '⚛️' },
  { name: 'API Integration', role: 'DummyJSON REST API', emoji: '🌐' },
  { name: 'UX Design', role: 'Mobile-First Responsive', emoji: '📱' },
];

const TECH = [
  { name: 'React 19', desc: 'UI library with hooks & context', icon: '⚛️' },
  { name: 'Vite 8', desc: 'Lightning-fast build tool', icon: '⚡' },
  { name: 'React Router 7', desc: 'Client-side SPA routing', icon: '🔀' },
  { name: 'CSS Modules', desc: 'Scoped, maintainable styles', icon: '🎨' },
  { name: 'DummyJSON API', desc: 'Realistic product data', icon: '🛒' },
  { name: 'LocalStorage', desc: 'Persistent cart & wishlist', icon: '💾' },
];

export default function About() {
  usePageTitle('About');

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="badge badge-primary" style={{ padding: '6px 16px', fontSize: 'var(--font-size-sm)' }}>
            Capstone Project
          </span>
          <h1 className={styles.heroTitle}>About ShopSphere</h1>
          <p className={styles.heroDesc}>
            ShopSphere is a production-ready e-commerce product catalog built as a college capstone project — demonstrating modern frontend architecture, REST API integration, responsive design, performance optimization, and accessibility best practices.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              📂 View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* What we built */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We Built</h2>
            <p className="section-subtitle">A full-featured product discovery platform from scratch.</p>
          </div>
          <div className={styles.pillarsGrid}>
            {TEAM.map(item => (
              <div key={item.name} className={`card ${styles.pillarCard}`}>
                <span className={styles.pillarIcon}>{item.emoji}</span>
                <h3 className={styles.pillarTitle}>{item.name}</h3>
                <p className={styles.pillarRole}>{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className={`section ${styles.techSection}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-subtitle">Built with modern, production-grade tools.</p>
          </div>
          <div className={styles.techGrid}>
            {TECH.map(t => (
              <div key={t.name} className={`card ${styles.techCard}`}>
                <span className={styles.techIcon}>{t.icon}</span>
                <h3 className={styles.techName}>{t.name}</h3>
                <p className={styles.techDesc}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Key Features</h2>
          </div>
          <div className={styles.featuresGrid}>
            {[
              ['🔍', 'Search & Filter', 'Real-time search with debouncing, category, price range, and rating filters.'],
              ['🛒', 'Shopping Cart', 'Persistent cart with quantity management, discount calculations, and free shipping threshold.'],
              ['❤️', 'Wishlist', 'Save products with duplicate prevention and move-to-cart functionality.'],
              ['🌙', 'Dark Mode', 'Full dark/light theme with system preference detection and localStorage persistence.'],
              ['📱', 'Responsive Design', 'Mobile-first approach with fluid layouts from 320px to 1440px+.'],
              ['⚡', 'Performance', 'Lazy loading, skeleton loaders, debounced search, and code splitting.'],
              ['♿', 'Accessibility', 'ARIA roles, keyboard navigation, semantic HTML, and visible focus states.'],
              ['🌐', 'REST API', 'Centralized API service with error handling and response normalization.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">{icon}</span>
                <div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section-sm ${styles.cta}`}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to explore?</h2>
            <p className={styles.ctaDesc}>Browse our full catalog of curated products.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Explore Products →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
