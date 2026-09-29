import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import { formatPrice, discountedPrice, truncate } from '../../utils/helpers';
import { usePageTitle } from '../../hooks';
import styles from './Cart.module.css';

function CartItemRow({ item }) {
  const { removeFromCart, updateQty } = useCart();
  const { addToast } = useToast();
  const finalPrice = discountedPrice(item.price, item.discountPercentage);

  return (
    <article className={styles.item}>
      <Link to={`/products/${item.id}`} className={styles.itemImg}>
        <img
          src={item.thumbnail}
          alt={item.title}
          width={96}
          height={96}
          loading="lazy"
        />
      </Link>
      <div className={styles.itemInfo}>
        <Link to={`/products/${item.id}`} className={styles.itemTitle}>
          {truncate(item.title, 60)}
        </Link>
        {item.discountPercentage > 0.5 && (
          <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>
            -{Math.round(item.discountPercentage)}% off
          </span>
        )}
        <div className={styles.itemPriceRow}>
          <span className={styles.itemPrice}>{formatPrice(finalPrice)}</span>
          {item.discountPercentage > 0.5 && (
            <span className={styles.itemOriginal}>{formatPrice(item.price)}</span>
          )}
        </div>
      </div>
      <div className={styles.itemControls}>
        <div className={styles.qtyGroup} role="group" aria-label={`Quantity for ${item.title}`}>
          <button
            className={`btn btn-ghost btn-sm ${styles.qtyBtn}`}
            onClick={() => {
              if (item.quantity === 1) {
                removeFromCart(item.id);
                addToast('Item removed from cart', 'info');
              } else {
                updateQty(item.id, item.quantity - 1);
              }
            }}
            aria-label="Decrease quantity"
          >−</button>
          <span className={styles.qtyNum} aria-live="polite">{item.quantity}</span>
          <button
            className={`btn btn-ghost btn-sm ${styles.qtyBtn}`}
            onClick={() => updateQty(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >+</button>
        </div>
        <span className={styles.itemSubtotal}>
          {formatPrice(finalPrice * item.quantity)}
        </span>
        <button
          className={`btn btn-ghost btn-sm ${styles.removeBtn}`}
          onClick={() => {
            removeFromCart(item.id);
            addToast('Item removed from cart', 'info');
          }}
          aria-label={`Remove ${item.title} from cart`}
        >
          🗑️
        </button>
      </div>
    </article>
  );
}

export default function Cart() {
  usePageTitle('Shopping Cart');
  const { items, subtotal, discount, delivery, total, clearCart, totalItems } = useCart();
  const { addToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Discover amazing products and start shopping!"
          action={<Link to="/products" className="btn btn-primary btn-lg">Explore Products</Link>}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart <span className={styles.count}>({totalItems})</span></h1>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              clearCart();
              addToast('Cart cleared', 'info');
            }}
          >
            🗑️ Clear Cart
          </button>
        </div>

        <div className={styles.layout}>
          {/* Items */}
          <section className={styles.items} aria-label="Cart items">
            {/* Column headers (desktop) */}
            <div className={styles.tableHead} aria-hidden="true">
              <span>Product</span>
              <span style={{ marginLeft: 'auto' }}>Qty</span>
              <span>Subtotal</span>
              <span></span>
            </div>
            {items.map(item => <CartItemRow key={item.id} item={item} />)}
          </section>

          {/* Order Summary */}
          <aside className={styles.summary} aria-label="Order summary">
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discount}`}>
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className={styles.free}>Free</span> : formatPrice(delivery)}</span>
              </div>
              {delivery === 0 && subtotal > 0 && (
                <p className={styles.freeShipNote}>🎉 You qualify for free shipping!</p>
              )}
              {delivery > 0 && (
                <p className={styles.freeShipNote}>
                  Add {formatPrice(50 - subtotal)} more for free shipping.
                </p>
              )}
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Checkout (Demo)
            </button>

            <Link to="/products" className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }}>
              ← Continue Shopping
            </Link>

            <p className={styles.secureNote}>🔒 Secure checkout · Orders are simulated (demo)</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
