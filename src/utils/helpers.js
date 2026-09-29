/**
 * Format a price value to INR string.
 */
export function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

/**
 * Calculate discounted price.
 */
export function discountedPrice(price, discountPercentage) {
  return price - (price * discountPercentage) / 100;
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to maxLength, adding ellipsis.
 */
export function truncate(str = '', maxLength = 120) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Slugify a string for URL use.
 */
export function slugify(str = '') {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Debounce a function.
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format category slug to display name.
 */
const CATEGORY_LABELS = {
  'mobiles-electronics': 'Mobiles & Electronics',
  'computers-accessories': 'Computers & Accessories',
  'fashion': 'Fashion',
  'footwear': 'Footwear',
  'beauty-personal-care': 'Beauty & Personal Care',
  'home-kitchen': 'Home & Kitchen',
  'furniture': 'Furniture',
  'grocery-gourmet': 'Grocery & Gourmet',
  'books-stationery': 'Books & Stationery',
  'toys-games': 'Toys & Games',
  'sports-fitness': 'Sports & Fitness',
  'bags-luggage': 'Bags & Luggage',
  general: 'General'
};

export function formatCategory(slug = '') {
  const key = String(slug || '').toLowerCase();
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  return key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate star rating display.
 * Returns array of 'full', 'half', or 'empty'.
 */
export function getRatingStars(rating) {
  const stars = [];
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.25 && rating - full < 0.75;
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('full');
    else if (i === full && half) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}
