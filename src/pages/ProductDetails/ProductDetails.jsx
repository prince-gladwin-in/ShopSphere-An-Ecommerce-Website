import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../../services/productApi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { ProductDetailSkeleton, ProductGridSkeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import ErrorState from '../../components/ErrorState/ErrorState';
import { formatPrice, discountedPrice, formatCategory, getRatingStars, clamp } from '../../utils/helpers';
import { usePageTitle } from '../../hooks';
import styles from './ProductDetails.module.css';

function StarRating({ rating }) {
  const stars = getRatingStars(rating);
  return (
    <span className={styles.stars} aria-label={`Rating: ${rating} out of 5`}>
      {stars.map((type, i) => (
        <span key={i} className={`${styles.star} ${styles[type]}`} aria-hidden="true">
          {type === 'full' ? '★' : type === 'half' ? '⯨' : '☆'}
        </span>
      ))}
      <span className={styles.ratingNum}>{rating.toFixed(1)} / 5</span>
    </span>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct]       = useState(null);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty]               = useState(1);

  usePageTitle(product?.title || 'Product Details');

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedImg(0);
    setQty(1);

    getProductById(id)
      .then(p => {
        setProduct(p);
        setRelatedLoading(true);
        return getRelatedProducts(p.category, p.id, 8);
      })
      .then(rel => setRelated(rel))
      .catch(err => {
        setError(err.message || 'Product not found.');
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
        setRelatedLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container section">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section">
        <ErrorState
          message={error}
          onRetry={() => navigate(0)}
        />
      </div>
    );
  }

  if (!product) return null;

  const finalPrice  = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0.5;
  const inWishlist  = isInWishlist(product.id);
  const inCart      = isInCart(product.id);
  const images      = (product.images || []).filter(Boolean);

  function handleAddToCart() {
    addToCart(product, qty);
    addToast(`${product.title} added to cart`, 'success');
  }

  function handleWishlist() {
    toggleWishlist(product);
    addToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', inWishlist ? 'info' : 'success');
  }

  function changeQty(delta) {
    setQty(prev => clamp(prev + delta, 1, Math.max(product.stock, 1)));
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <div className="container">
          <ol className={styles.breadList} role="list">
            <li><Link to="/" className={styles.breadLink}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link to="/products" className={styles.breadLink}>Products</Link></li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to={`/products?category=${product.category}`} className={styles.breadLink}>
                {formatCategory(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className={styles.breadCurrent}>{product.title}</li>
          </ol>
        </div>
      </nav>

      <div className="container">
        <div className={styles.detail}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImgWrap}>
              <img
                src={images[selectedImg] || product.thumbnail}
                alt={product.title}
                className={styles.mainImg}
                width={600}
                height={600}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
                      <defs>
                        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stop-color="#6d5efc"/>
                          <stop offset="100%" stop-color="#b5a8ff"/>
                        </linearGradient>
                      </defs>
                      <rect width="800" height="800" fill="url(#g)"/>
                      <text x="400" y="420" text-anchor="middle" font-size="38" font-family="Arial, sans-serif" font-weight="700" fill="#fff">ShopSphere</text>
                      <text x="400" y="470" text-anchor="middle" font-size="22" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.82)">${encodeURIComponent(product.title || 'Product')}</text>
                    </svg>
                  `)}`;
                }}
              />
              {hasDiscount && (
                <span className={`badge badge-danger ${styles.discountBadge}`}>
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails} role="list" aria-label="Product images">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === selectedImg ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImg(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === selectedImg}
                  >
                    <img
                      src={img}
                      alt={`${product.title} preview ${i + 1}`}
                      width={80}
                      height={80}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
                            <rect width="160" height="160" fill="#6d5efc"/>
                            <text x="80" y="88" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" font-weight="700" fill="#fff">ShopSphere</text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <div className={styles.categoryTag}>
              <Link to={`/products?category=${product.category}`} className="badge badge-primary">
                {formatCategory(product.category)}
              </Link>
              {product.brand && <span className={styles.brand}>{product.brand}</span>}
            </div>

            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.stock}>
                {product.stock > 0
                  ? <><span className={styles.inStock}>✓</span> {product.stock} in stock</>
                  : <span className={styles.outStock}>Out of stock</span>
                }
              </span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatPrice(finalPrice)}</span>
              {hasDiscount && (
                <>
                  <span className={styles.original}>{formatPrice(product.price)}</span>
                  <span className={`badge badge-success`}>
                    Save {formatPrice(product.price - finalPrice)}
                  </span>
                </>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <label className={styles.qtyLabel} id="qty-label">Quantity:</label>
              <div className={styles.qtyControl} role="group" aria-labelledby="qty-label">
                <button
                  className={`btn btn-ghost btn-sm ${styles.qtyBtn}`}
                  onClick={() => changeQty(-1)}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >−</button>
                <span className={styles.qtyNum} aria-live="polite">{qty}</span>
                <button
                  className={`btn btn-ghost btn-sm ${styles.qtyBtn}`}
                  onClick={() => changeQty(1)}
                  disabled={qty >= product.stock}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={`btn btn-primary btn-lg ${styles.addBtn}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                aria-label={`Add ${product.title} to cart`}
              >
                {product.stock === 0 ? '🚫 Out of Stock' : inCart ? '✓ Add More to Cart' : '🛒 Add to Cart'}
              </button>
              <button
                className={`btn btn-ghost ${styles.wishBtn} ${inWishlist ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={inWishlist}
              >
                {inWishlist ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tags}>
                <span className={styles.tagsLabel}>Tags:</span>
                {product.tags.map(tag => (
                  <span key={tag} className={`badge badge-primary ${styles.tag}`}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {(related.length > 0 || relatedLoading) && (
          <section className={styles.related} aria-labelledby="related-heading">
            <h2 id="related-heading" className={styles.relatedTitle}>You Might Also Like</h2>
            {relatedLoading
              ? <ProductGridSkeleton count={4} />
              : (
                <div className="product-grid">
                  {related.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )
            }
          </section>
        )}
      </div>
    </div>
  );
}
