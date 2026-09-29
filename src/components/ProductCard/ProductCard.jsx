import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice, discountedPrice, formatCategory, getRatingStars, truncate } from '../../utils/helpers';
import styles from './ProductCard.module.css';

function getFallbackImage(product) {
  const title = encodeURIComponent((product.title || 'ShopSphere').slice(0, 48));
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#6d5efc"/>
          <stop offset="100%" stop-color="#b5a8ff"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <circle cx="400" cy="220" r="110" fill="rgba(255,255,255,0.12)"/>
      <path d="M260 430c50-90 140-150 240-150s190 60 240 150" fill="rgba(255,255,255,0.12)"/>
      <text x="400" y="330" text-anchor="middle" font-size="36" font-family="Arial, sans-serif" font-weight="700" fill="#fff">ShopSphere</text>
      <text x="400" y="380" text-anchor="middle" font-size="18" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.82)">${title}</text>
    </svg>
  `)}`;
}

function StarRating({ rating }) {
  const stars = getRatingStars(rating);
  return (
    <span className={styles.stars} aria-label={`Rating: ${rating} out of 5`}>
      {stars.map((type, i) => (
        <span key={i} className={`${styles.star} ${styles[type]}`} aria-hidden="true">
          {type === 'full' ? '★' : type === 'half' ? '⯨' : '☆'}
        </span>
      ))}
      <span className={styles.ratingNum}>({rating.toFixed(1)})</span>
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, isInCart }       = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast }                  = useToast();

  const inCart      = isInCart(product.id);
  const inWishlist  = isInWishlist(product.id);
  const finalPrice  = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0.5;

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(product);
    addToast(`${truncate(product.title, 30)} added to cart`, 'success');
  }

  function handleWishlist(e) {
    e.preventDefault();
    toggleWishlist(product);
    addToast(
      inWishlist ? 'Removed from wishlist' : `${truncate(product.title, 30)} added to wishlist`,
      inWishlist ? 'info' : 'success'
    );
  }

  return (
    <article className={`card ${styles.card}`}>
      <Link to={`/products/${product.id}`} className={styles.imageWrap} tabIndex={-1} aria-hidden="true">
        <img
          src={product.thumbnail || getFallbackImage(product)}
          alt={product.title}
          className={styles.image}
          loading="lazy"
          width={320}
          height={240}
          onError={(event) => {
            event.currentTarget.src = getFallbackImage(product);
          }}
        />
        {hasDiscount && (
          <span className={`badge badge-danger ${styles.discountBadge}`}>
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          className={`${styles.wishBtn} ${inWishlist ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>
      </Link>

      <div className={styles.body}>
        <Link to={`/products/${product.id}`} className={styles.titleLink}>
          <span className={styles.category}>{formatCategory(product.category)}</span>
          <h3 className={styles.title}>{truncate(product.title, 55)}</h3>
        </Link>

        <StarRating rating={product.rating} />

        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className={styles.original}>{formatPrice(product.price)}</span>
          )}
        </div>

        <button
          className={`btn ${inCart ? 'btn-ghost' : 'btn-primary'} ${styles.addBtn}`}
          onClick={handleAddToCart}
          aria-label={inCart ? `Add more of ${product.title} to cart` : `Add ${product.title} to cart`}
        >
          {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
        </button>
      </div>
    </article>
  );
}
