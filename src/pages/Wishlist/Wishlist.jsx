import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import { formatPrice, discountedPrice, truncate } from '../../utils/helpers';
import { usePageTitle } from '../../hooks';
import styles from './Wishlist.module.css';

function WishlistItemCard({ item }) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { addToast } = useToast();
  const finalPrice = discountedPrice(item.price, item.discountPercentage);
  const inCart = isInCart(item.id);

  return (
    <article className={`card ${styles.wishCard}`}>
      <Link to={`/products/${item.id}`} className={styles.cardImg}>
        <img
          src={item.thumbnail}
          alt={item.title}
          width={200}
          height={200}
          loading="lazy"
        />
      </Link>
      <div className={styles.cardBody}>
        <Link to={`/products/${item.id}`} className={styles.cardTitle}>
          {truncate(item.title, 55)}
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(finalPrice)}</span>
          {item.discountPercentage > 0.5 && (
            <span className={styles.original}>{formatPrice(item.price)}</span>
          )}
        </div>
        <div className={styles.cardActions}>
          <button
            className={`btn ${inCart ? 'btn-ghost' : 'btn-primary'} btn-sm`}
            onClick={() => {
              addToCart(item);
              addToast(`${truncate(item.title, 30)} added to cart`, 'success');
            }}
          >
            {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              removeFromWishlist(item.id);
              addToast('Removed from wishlist', 'info');
            }}
            aria-label={`Remove ${item.title} from wishlist`}
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Wishlist() {
  usePageTitle('Wishlist');
  const { items } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          icon="🤍"
          title="Your wishlist is empty"
          message="Save products you love by clicking the heart icon. They'll be waiting for you here."
          action={<Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>}
        />
      </div>
    );
  }

  function addAllToCart() {
    items.forEach(item => addToCart(item));
    addToast(`All ${items.length} items added to cart!`, 'success');
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Wishlist</h1>
            <p className={styles.subtitle}>{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={addAllToCart}>
            🛒 Add All to Cart
          </button>
        </div>
        <div className={styles.grid}>
          {items.map(item => <WishlistItemCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
