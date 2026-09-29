import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { getCategories } from '../../services/productApi';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const { items: wishItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    getCategories()
      .then((items) => setCategories(items))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = searchVal.trim();
    if (!trimmed) return;

    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    setSearchVal('');
    closeMenu();
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.inner}>
            <Link to="/" className={styles.logo} aria-label="ShopSphere home" onClick={closeMenu}>
              <span className={styles.logoIcon}>S</span>
              <span className={styles.logoText}>ShopSphere</span>
            </Link>

            <div className={styles.location} aria-label="Deliver location">
              <span className={styles.locationLabel}>Deliver to</span>
              <strong>Vadodara 390001</strong>
            </div>

            <form className={styles.desktopSearch} onSubmit={handleSearch} role="search">
              <span aria-hidden="true">🔎</span>
              <input
                type="search"
                className="input"
                placeholder="Search for mobiles, headphones, shoes, skincare..."
                value={searchVal}
                onChange={(event) => setSearchVal(event.target.value)}
                aria-label="Search for products"
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>

            <div className={styles.userActions}>
              <button className={styles.iconBtn} type="button" aria-label="Account details">
                Account
              </button>
              <Link to="/wishlist" className={styles.iconBtn} aria-label={`Wishlist (${wishItems.length} items)`}>
                Wishlist
                {wishItems.length > 0 && <span className={styles.badge}>{wishItems.length}</span>}
              </Link>
              <Link to="/cart" className={styles.iconBtn} aria-label={`Cart (${totalItems} items)`}>
                Cart
                {totalItems > 0 && <span className={`${styles.badge} ${styles.badgeCart}`}>{totalItems > 99 ? '99+' : totalItems}</span>}
              </Link>
              <button
                className={styles.iconBtn}
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>

            <button
              className={styles.hamburger}
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
            </button>
          </div>
          <form className={`${styles.mobileSearch} ${styles.mobileSearchBar}`} onSubmit={handleSearch} role="search">
            <input
              type="search"
              className="input"
              placeholder="Search products..."
              value={searchVal}
              onChange={(event) => setSearchVal(event.target.value)}
              aria-label="Search products"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      </div>

      <div className={styles.categoryBar}>
        <div className="container">
          <nav className={styles.categoryNav} aria-label="Category navigation">
            <Link to="/products" className={styles.categoryLink}>
              ☰ All
            </Link>
            {categories.map((item) => (
              <Link key={item.slug} to={`/products?category=${item.slug}`} className={styles.categoryLink}>
                {item.name}{typeof item.count === 'number' ? ` (${item.count})` : ''}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu} ref={menuRef} aria-label="Mobile navigation">
          <div className="container">
            <ul role="list" className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/wishlist" className={styles.mobileLink} onClick={closeMenu}>
                  Wishlist {wishItems.length > 0 && `(${wishItems.length})`}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className={styles.mobileLink} onClick={closeMenu}>
                  Cart {totalItems > 0 && `(${totalItems})`}
                </NavLink>
              </li>
            </ul>

            <div className={styles.mobileTheme}>
              <button className="btn btn-ghost" type="button" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
