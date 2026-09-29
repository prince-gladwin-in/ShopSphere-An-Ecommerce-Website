import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle, useFetch } from '../../hooks';
import { getProducts, getCategories } from '../../services/productApi';
import ProductCard from '../../components/ProductCard/ProductCard';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import ErrorState from '../../components/ErrorState/ErrorState';
import { formatCategory } from '../../utils/helpers';
import styles from './Home.module.css';

const CATEGORY_META = {
  'mobiles-electronics': { icon: '📱', color: '#6366f1' },
  'computers-accessories': { icon: '💻', color: '#8b5cf6' },
  'fashion': { icon: '👔', color: '#ec4899' },
  'footwear': { icon: '👟', color: '#f43f5e' },
  'beauty-personal-care': { icon: '💄', color: '#e879f9' },
  'home-kitchen': { icon: '🏠', color: '#10b981' },
  'furniture': { icon: '🛋️', color: '#f59e0b' },
  'grocery-gourmet': { icon: '🛒', color: '#84cc16' },
  'books-stationery': { icon: '📚', color: '#3b82f6' },
  'toys-games': { icon: '🧩', color: '#f472b6' },
  'sports-fitness': { icon: '⚽', color: '#06b6d4' },
  'bags-luggage': { icon: '👜', color: '#fb7185' },
};

function CategoryCard({ cat }) {
  const meta = CATEGORY_META[cat.slug] || { icon: '🏷️', color: '#6366f1' };
  return (
    <Link to={`/products?category=${cat.slug}`} className={styles.categoryCard}>
      <span className={styles.catIcon} style={{ background: `${meta.color}20`, color: meta.color }}>
        {meta.icon}
      </span>
      <span className={styles.catName}>{cat.name || formatCategory(cat.slug)}{typeof cat.count === 'number' ? ` (${cat.count})` : ''}</span>
    </Link>
  );
}

function getDealProducts(products = []) {
  return [...products]
    .filter((product) => product && product.rating > 3.5 && product.discount > 8 && product.price > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0) || (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
}

function getPopularBrands(products = []) {
  const map = new Map();

  products.forEach((product) => {
    const brand = (product.brand || '').trim();
    if (!brand) return;
    map.set(brand, (map.get(brand) || 0) + 1);
  });

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([brand, count]) => ({ brand, count }));
}

function getTrendingProducts(products = []) {
  return [...products]
    .filter((product) => product && product.rating > 0)
    .sort((a, b) => (b.reviewCount || 0) + b.rating * 100 - ((a.reviewCount || 0) + a.rating * 100))
    .slice(0, 6);
}

function getBestSellers(products = []) {
  return [...products]
    .filter((product) => product && product.rating > 0)
    .sort((a, b) => (b.rating || 0) * (b.reviewCount || 0) - (a.rating || 0) * (a.reviewCount || 0))
    .slice(0, 6);
}

function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <span className={`badge badge-primary ${styles.heroBadge}`}>Top deals • Curated for India</span>
          <h1 id="hero-heading" className={styles.heroTitle}>
            Everything You Need.
            <span className={styles.heroGradient}>One Smart Store.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover electronics, fashion, beauty, home essentials and more — curated for everyday Indian shoppers.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
            <a href="#categories" className="btn btn-secondary btn-lg">Explore Categories</a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}><strong>1500+</strong><span>Products</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>12</strong><span>Categories</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>4.5★</strong><span>Rated</span></div>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.showcaseCard}>
            <div className={styles.showcaseHeader}>
              <span className={styles.miniBadge}>Trending now</span>
              <span className={styles.flashOffer}>Up to 60% off</span>
            </div>
            <div className={styles.showcaseBody}>
              <div className={styles.showcaseGlow} />
              <div className={styles.showcaseDevice}>
                <span>🎧</span>
              </div>
            </div>
            <div className={styles.showcaseFooter}>
              <div>
                <strong>Noise Pro 2</strong>
                <small>Wireless audio</small>
              </div>
              <span>₹2,499</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceStrip() {
  const services = [
    'Free Delivery',
    'Easy Returns',
    'Secure Payments',
    'ShopSphere Assured',
  ];

  return (
    <div className={styles.serviceStrip}>
      <div className="container">
        <div className={styles.serviceRow}>
          {services.map((item) => (
            <div key={item} className={styles.serviceItem}>
              <span aria-hidden="true">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCategories() {
  const { data: cats, loading, error } = useFetch(() => getCategories(), []);
  const displayed = cats || [];

  return (
    <section id="categories" className={`section ${styles.categoriesSection}`} aria-labelledby="cat-heading">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="cat-heading" className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find everyday essentials across your favourite stores.</p>
          </div>
        </div>

        {loading && (
          <div className={styles.categoryRail}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.categorySkeleton}`} aria-hidden="true" />
            ))}
          </div>
        )}

        {error && <p className="text-center" style={{ color: 'var(--color-muted)' }}>Could not load categories.</p>}

        {!loading && !error && (
          <div className={styles.categoryRail}>
            {displayed.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DealsSection({ products, loading, error, onRetry }) {
  return (
    <section className={`section ${styles.dealsSection}`} aria-labelledby="deals-heading">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="deals-heading" className="section-title">🔥 Deals of the Day</h2>
            <p className="section-subtitle">Fresh discounts on best-selling essentials.</p>
          </div>
          <Link to="/products" className="btn btn-secondary">View all deals</Link>
        </div>

        {loading && <ProductGridSkeleton count={6} />}
        {error && <ErrorState message={error} onRetry={onRetry} />}
        {!loading && !error && (
          <div className={styles.dealGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PopularBrandsSection({ products }) {
  const brands = useMemo(() => getPopularBrands(products), [products]);

  return (
    <section className={`section ${styles.brandsSection}`} aria-labelledby="brands-heading">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="brands-heading" className="section-title">Popular Brands</h2>
            <p className="section-subtitle">Trusted names shoppers keep coming back for.</p>
          </div>
        </div>

        <div className={styles.brandGrid}>
          {brands.map(({ brand, count }) => (
            <Link key={brand} to={`/products?q=${encodeURIComponent(brand)}`} className={styles.brandCard}>
              <span className={styles.brandChip}>{brand}</span>
              <small>{count} products</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductStripSection({ title, subtitle, products, loading, error, onRetry, linkTo = '/products' }) {
  return (
    <section className={`section ${styles.stripSection}`} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`} className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <Link to={linkTo} className="btn btn-secondary">View all</Link>
        </div>

        {loading && <ProductGridSkeleton count={4} />}
        {error && <ErrorState message={error} onRetry={onRetry} />}
        {!loading && !error && (
          <div className={styles.productStripGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <section className={`section-sm ${styles.newsletter}`} aria-labelledby="newsletter-heading">
      <div className="container">
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterContent}>
            <h2 id="newsletter-heading" className={styles.newsletterTitle}>Stay in the loop</h2>
            <p className={styles.newsletterDesc}>Get curated product picks, member-only deals, and new arrivals in your inbox.</p>
          </div>

          {submitted ? (
            <div className={styles.successMsg} role="status">
              <span>🎉</span>
              <div>
                <strong>You're subscribed!</strong>
                <p>Thanks for joining ShopSphere. Expect great deals soon.</p>
              </div>
            </div>
          ) : (
            <form className={styles.newsletterForm} onSubmit={handleSubmit} noValidate>
              <div className={styles.inputGroup}>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  className={`input ${styles.newsletterInput}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  aria-describedby={error ? 'nl-error' : undefined}
                  required
                />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </div>
              {error && <p id="nl-error" className={styles.nlError} role="alert">{error}</p>}
              <p className={styles.nlPrivacy}>No spam. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle('Discover Products');

  const { data, loading, error, refetch } = useFetch(() => getProducts(24, 0), []);
  const products = data?.products || [];

  const dealProducts = useMemo(() => getDealProducts(products), [products]);
  const trendingProducts = useMemo(() => getTrendingProducts(products), [products]);
  const bestSellers = useMemo(() => getBestSellers(products), [products]);

  return (
    <main>
      <HeroSection />
      <ServiceStrip />
      <FeaturedCategories />
      <DealsSection products={dealProducts} loading={loading} error={error} onRetry={refetch} />
      <PopularBrandsSection products={products} />
      <ProductStripSection
        title="🔥 Trending in India"
        subtitle="What shoppers are discovering right now."
        products={trendingProducts}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
      <ProductStripSection
        title="Best Sellers"
        subtitle="Customer favourites selected by trusted ratings and demand."
        products={bestSellers}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
      <NewsletterSection />
    </main>
  );
}
