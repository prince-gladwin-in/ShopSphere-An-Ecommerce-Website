import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ToastContainer from './components/Toast/Toast';

/* Lazy-loaded page routes for code splitting */
const Home           = lazy(() => import('./pages/Home/Home'));
const Products       = lazy(() => import('./pages/Products/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const Cart           = lazy(() => import('./pages/Cart/Cart'));
const Wishlist       = lazy(() => import('./pages/Wishlist/Wishlist'));
const About          = lazy(() => import('./pages/About/About'));
const NotFound       = lazy(() => import('./pages/NotFound/NotFound'));

function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page…"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '12px',
        flexDirection: 'column',
        color: 'var(--color-muted)',
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} aria-hidden="true" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Navbar />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"              element={<Home />} />
                  <Route path="/products"      element={<Products />} />
                  <Route path="/products/:id"  element={<ProductDetails />} />
                  <Route path="/cart"          element={<Cart />} />
                  <Route path="/wishlist"      element={<Wishlist />} />
                  <Route path="/about"         element={<About />} />
                  <Route path="*"              element={<NotFound />} />
                </Routes>
              </Suspense>
              <Footer />
              <ToastContainer />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
