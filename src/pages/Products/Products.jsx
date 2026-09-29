import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, searchProducts, getProductsByCategory } from '../../services/productApi';
import ProductCard from '../../components/ProductCard/ProductCard';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { useDebounce } from '../../hooks';
import { formatCategory } from '../../utils/helpers';
import { usePageTitle } from '../../hooks';
import styles from './Products.module.css';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name-asc',   label: 'Name A → Z' },
  { value: 'name-desc',  label: 'Name Z → A' },
];

function sortProducts(products, sortKey) {
  const arr = [...products];
  switch (sortKey) {
    case 'price-asc':  return arr.sort((a, b) => a.price - b.price);
    case 'price-desc': return arr.sort((a, b) => b.price - a.price);
    case 'rating':     return arr.sort((a, b) => b.rating - a.rating);
    case 'name-asc':   return arr.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':  return arr.sort((a, b) => b.title.localeCompare(a.title));
    default:           return arr;
  }
}

function filterProducts(products, { minPrice, maxPrice, minRating }) {
  return products.filter(p => {
    const finalPrice = p.price * (1 - p.discountPercentage / 100);
    if (finalPrice < minPrice) return false;
    if (maxPrice < 2000 && finalPrice > maxPrice) return false;
    if (p.rating < minRating) return false;
    return true;
  });
}

export default function Products() {
  usePageTitle('Products');
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch]   = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort]       = useState('default');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const debouncedSearch = useDebounce(search, 450);

  // Sync search params to URL
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (category)        params.category = category;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, setSearchParams]);

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(cats => setCategories(cats))
      .catch(() => {});
  }, []);

  // Load products whenever search/category changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (debouncedSearch) {
        result = await searchProducts(debouncedSearch, 100);
        setAllProducts(result.products);
      } else if (category) {
        result = await getProductsByCategory(category, 100);
        setAllProducts(result.products);
      } else {
        result = await getProducts(100, 0);
        setAllProducts(result.products);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products. Please try again.');
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Apply client-side filter + sort
  const filtered = filterProducts(allProducts, { minPrice, maxPrice, minRating });
  const sorted   = sortProducts(filtered, sort);

  function clearFilters() {
    setSearch('');
    setCategory('');
    setSort('default');
    setMinPrice(0);
    setMaxPrice(2000);
    setMinRating(0);
  }

  const hasFilters = search || category || sort !== 'default' || minPrice > 0 || maxPrice < 2000 || minRating > 0;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>
            {category ? formatCategory(category) : search ? `Results for "${search}"` : 'All Products'}
          </h1>
          <p className={styles.pageCount}>
            {!loading && `${sorted.length} product${sorted.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Sidebar Toggle (mobile) */}
        <button
          className={`btn btn-ghost ${styles.filterToggle}`}
          onClick={() => setSidebarOpen(v => !v)}
          aria-expanded={sidebarOpen}
          aria-controls="filter-sidebar"
        >
          🔧 Filters {hasFilters && '•'}
        </button>

        {/* Sidebar */}
        <aside
          id="filter-sidebar"
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
          aria-label="Product filters"
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          {/* Search */}
          <fieldset className={styles.filterGroup}>
            <legend className={styles.filterLabel}>Search</legend>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="search"
                className={`input ${styles.searchInput}`}
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search products"
              />
              {search && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >✕</button>
              )}
            </div>
          </fieldset>

          {/* Category */}
          <fieldset className={styles.filterGroup}>
            <legend className={styles.filterLabel}>Category</legend>
            <div className={styles.categoryList}>
              <button
                className={`${styles.catBtn} ${!category ? styles.catActive : ''}`}
                onClick={() => setCategory('')}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  className={`${styles.catBtn} ${category === cat.slug ? styles.catActive : ''}`}
                  onClick={() => setCategory(cat.slug)}
                >
                  {cat.name || formatCategory(cat.slug)}{typeof cat.count === 'number' ? ` (${cat.count})` : ''}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Price Range */}
          <fieldset className={styles.filterGroup}>
            <legend className={styles.filterLabel}>
              Price Range: $0 — {maxPrice < 2000 ? `$${maxPrice}` : '$2000+'}
            </legend>
            <input
              type="range"
              className={styles.rangeSlider}
              min={0}
              max={2000}
              step={10}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              aria-label={`Maximum price: $${maxPrice}`}
            />
            <div className={styles.rangeLabels}>
              <span>$0</span>
              <span>$2000+</span>
            </div>
          </fieldset>

          {/* Rating */}
          <fieldset className={styles.filterGroup}>
            <legend className={styles.filterLabel}>Minimum Rating</legend>
            <div className={styles.ratingButtons}>
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button
                  key={r}
                  className={`${styles.ratingBtn} ${minRating === r ? styles.ratingActive : ''}`}
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? 'Any' : `${r}★+`}
                </button>
              ))}
            </div>
          </fieldset>
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          {/* Sort bar */}
          <div className={styles.sortBar}>
            <p className={styles.resultCount}>
              {!loading && `${sorted.length} result${sorted.length !== 1 ? 's' : ''}`}
            </p>
            <div className={styles.sortWrap}>
              <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
              <select
                id="sort-select"
                className={`input ${styles.sortSelect}`}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* States */}
          {loading && <ProductGridSkeleton count={12} />}

          {error && <ErrorState message={error} onRetry={fetchProducts} />}

          {!loading && !error && sorted.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No products found"
              message={
                search
                  ? `No results for "${search}". Try different keywords or clear your filters.`
                  : 'No products match the selected filters.'
              }
              action={
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              }
            />
          )}

          {!loading && !error && sorted.length > 0 && (
            <div className="product-grid">
              {sorted.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
