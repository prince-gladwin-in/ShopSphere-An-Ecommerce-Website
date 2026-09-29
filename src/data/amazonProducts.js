const VEHICLE_KEYWORDS = [
  'motorcycle', 'motorcycles', 'vehicle', 'vehicles', 'automotive', 'cars', 'car', 'bike', 'bikes'
];

const CATEGORY_ORDER = [
  'mobiles-electronics',
  'computers-accessories',
  'fashion',
  'footwear',
  'beauty-personal-care',
  'home-kitchen',
  'furniture',
  'grocery-gourmet',
  'books-stationery',
  'toys-games',
  'sports-fitness',
  'bags-luggage',
  'general'
];

const CATEGORY_META = {
  'mobiles-electronics': { name: 'Mobiles & Electronics', keywords: ['electronics', 'smartphone', 'mobile', 'headphone', 'earbuds', 'speaker', 'television', 'tv', 'watch', 'camera', 'tablet', 'charger', 'cable'] },
  'computers-accessories': { name: 'Computers & Accessories', keywords: ['computer', 'laptop', 'desktop', 'keyboard', 'mouse', 'printer', 'monitor', 'adapter', 'usb', 'network', 'hard disk', 'memory card', 'storage'] },
  'fashion': { name: 'Fashion', keywords: ['shirt', 'dress', 'fashion', 'clothing', 'kurta', 'jeans', 'jacket', 'coat', 'saree', 'lehenga', 'tops', 'hoodie'] },
  'footwear': { name: 'Footwear', keywords: ['shoe', 'shoes', 'sandal', 'slipper', 'boot', 'sandals'] },
  'beauty-personal-care': { name: 'Beauty & Personal Care', keywords: ['beauty', 'skincare', 'cosmetics', 'personal care', 'lipstick', 'cream', 'serum', 'perfume', 'makeup', 'hair'] },
  'home-kitchen': { name: 'Home & Kitchen', keywords: ['home', 'kitchen', 'cookware', 'heater', 'vacuum', 'mixer', 'water purifier', 'geyser', 'appliance', 'iron'] },
  'furniture': { name: 'Furniture', keywords: ['furniture', 'chair', 'table', 'sofa', 'bed', 'desk', 'cabinet', 'stool'] },
  'grocery-gourmet': { name: 'Grocery & Gourmet', keywords: ['grocery', 'food', 'tea', 'coffee', 'snack', 'spice', 'oil', 'rice', 'flour', 'nuts', 'gourmet'] },
  'books-stationery': { name: 'Books & Stationery', keywords: ['book', 'stationery', 'notebook', 'pen', 'pencil', 'bag', 'diary', 'backpack', 'paper'] },
  'toys-games': { name: 'Toys & Games', keywords: ['toy', 'games', 'game', 'puzzle', 'board', 'playing'] },
  'sports-fitness': { name: 'Sports & Fitness', keywords: ['sports', 'fitness', 'yoga', 'exercise', 'treadmill', 'gym', 'ball', 'racket', 'cycling'] },
  'bags-luggage': { name: 'Bags & Luggage', keywords: ['bag', 'luggage', 'backpack', 'travel', 'trolley', 'suitcase'] },
  general: { name: 'General', keywords: [] }
};

const CATEGORY_DISPLAY_ORDER = Object.entries(CATEGORY_META).map(([slug, meta]) => ({ slug, name: meta.name }));

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanWhitespace(value = '') {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').replace(/[^0-9.-]/g, '');
  const number = Number.parseFloat(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function parsePrice(value) {
  const cleaned = String(value || '').replace(/[₹,\s]/g, '').replace(/inr/gi, '').replace(/rs/gi, '').replace(/\$/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDiscountPercentage(value, actualPrice, discountedPrice) {
  const normalized = String(value || '').trim();
  if (normalized) {
    const parsed = parseNumber(normalized.replace('%', ''));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  if (actualPrice > 0 && discountedPrice > 0) {
    const fraction = ((actualPrice - discountedPrice) / actualPrice) * 100;
    if (Number.isFinite(fraction) && fraction > 0) return fraction;
  }

  return 0;
}

function getBrandFromTitle(title = '') {
  const cleaned = cleanWhitespace(title);
  if (!cleaned) return '';

  const words = cleaned.split(' ');
  const firstWord = words[0];
  if (!firstWord || firstWord.length < 3) return '';

  const blockedWords = ['USB', 'Bluetooth', 'Wireless', 'Nylon', 'Portable', 'Digital', 'Premium', 'Apple', 'Samsung', 'Noise', 'Boat', 'boAt', 'Realme', 'OnePlus', 'Sony'];
  if (blockedWords.includes(firstWord)) return '';

  const hasCapital = /[A-Z]/.test(firstWord);
  if (hasCapital && !/^[0-9]/.test(firstWord)) {
    return firstWord.replace(/[^A-Za-z0-9]/g, '');
  }

  return '';
}

function isVehicleLikeCategory(rawCategory = '') {
  const text = normalizeText(rawCategory);
  return VEHICLE_KEYWORDS.some(keyword => text.includes(keyword));
}

function formatCategoryLabel(rawCategory = '') {
  const text = cleanWhitespace(rawCategory || '');
  if (!text) return 'General';

  const normalized = normalizeText(text);
  if (!normalized) return 'General';

  const fallback = text
    .replace(/[|/\\_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return fallback
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategorySlug(rawCategory = '') {
  const rawText = String(rawCategory || '').trim();
  const text = normalizeText(rawText);
  if (!text) return 'general';

  for (const [slug, meta] of Object.entries(CATEGORY_META)) {
    if (meta.keywords.some(keyword => text.includes(keyword))) {
      return slug;
    }
  }

  const rawHasMalformedDelimiters = /[|/\\_,]/.test(rawText);
  const segmentCount = rawText.split(/\s+/).filter(Boolean).length;
  if (rawHasMalformedDelimiters || segmentCount > 4) {
    return 'general';
  }

  return text
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'general';
}

export function getCategoryDetails(rawCategory = '') {
  const slug = getCategorySlug(rawCategory);
  const baseName = CATEGORY_META[slug]?.name || formatCategoryLabel(rawCategory);
  return {
    slug,
    name: baseName
  };
}

export function getAvailableCategories(products = []) {
  const counts = new Map();

  products.forEach(product => {
    const rawCategory = String(product?.subcategory || product?.categoryName || product?.category || '').trim();
    const category = String(product?.category || 'general').trim() || 'general';
    const name = product?.categoryName || product?.subcategory || CATEGORY_META[category]?.name || formatCategoryLabel(category);

    if (isVehicleLikeCategory(rawCategory) || isVehicleLikeCategory(category)) return;
    if (!category || !name) return;

    const previous = counts.get(category) || { slug: category, name, count: 0 };
    counts.set(category, {
      ...previous,
      slug: category,
      name: previous.name || name,
      count: previous.count + 1
    });
  });

  return [...counts.values()]
    .filter(item => item.count > 0 && item.slug !== 'general')
    .sort((a, b) => {
      const order = CATEGORY_ORDER.indexOf(a.slug);
      const orderB = CATEGORY_ORDER.indexOf(b.slug);
      if (order >= 0 && orderB >= 0) return order - orderB;
      if (order >= 0) return -1;
      if (orderB >= 0) return 1;
      return a.name.localeCompare(b.name);
    })
    .map(item => ({
      slug: item.slug,
      name: item.name,
      count: item.count
    }));
}

export function getShopSphereCategories() {
  return CATEGORY_ORDER.map(slug => ({
    slug,
    name: CATEGORY_META[slug]?.name || 'General'
  })).filter(category => category.name !== 'General' || category.slug === 'general');
}

function makeFallbackImage(title = '', category = 'general') {
  const label = encodeURIComponent((title || CATEGORY_META[category]?.name || 'ShopSphere').slice(0, 54));
  const bg = '#6d5efc';
  const accent = '#b5a8ff';
  const safeTitle = encodeURIComponent((title || 'ShopSphere').slice(0, 24));
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${bg}"/>
          <stop offset="100%" stop-color="${accent}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <circle cx="400" cy="280" r="120" fill="rgba(255,255,255,0.12)"/>
      <path d="M280 530c40-88 120-132 220-132s170 44 220 132" fill="rgba(255,255,255,0.12)"/>
      <text x="400" y="400" text-anchor="middle" font-size="42" font-family="Arial, sans-serif" font-weight="700" fill="#FFFFFF">ShopSphere</text>
      <text x="400" y="470" text-anchor="middle" font-size="20" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.86)">${safeTitle}</text>
    </svg>
  `)}`;
}

function isValidImageUrl(value = '') {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeImage(value = '', title = '', category = 'general') {
  if (isValidImageUrl(value)) return value;
  return makeFallbackImage(title, category);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(currentValue);
      const cleanedRow = row.map(cell => cell.replace(/\r/g, '').replace(/\n/g, ''));
      if (cleanedRow.some(cell => cell.trim() !== '')) {
        rows.push(cleanedRow);
      }
      row = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length > 0 || row.length > 0) {
    row.push(currentValue);
    const cleanedRow = row.map(cell => cell.replace(/\r/g, '').replace(/\n/g, ''));
    if (cleanedRow.some(cell => cell.trim() !== '')) {
      rows.push(cleanedRow);
    }
  }

  if (rows.length < 2) return [];

  const [header, ...dataRows] = rows;
  return dataRows.map(values => {
    const entry = {};
    header.forEach((key, index) => {
      entry[key.trim()] = (values[index] ?? '').trim();
    });
    return entry;
  });
}

function inferBrand(title = '') {
  const cleaned = cleanWhitespace(title);
  if (!cleaned) return '';
  const match = cleaned.match(/^([A-Za-z][A-Za-z0-9&-]+)/);
  if (!match) return '';
  const value = match[1];
  const blocked = ['USB', 'Wireless', 'Bluetooth', 'Nylon', 'Portable', 'Digital', 'Premium', 'Apple', 'Best', 'Amazon', 'ShopSphere'];
  if (blocked.includes(value)) return '';
  return value;
}

function normalizeAmazonProduct(row) {
  const productId = cleanWhitespace(row.product_id || row.id || '');
  const title = cleanWhitespace(row.product_name || row.title || '');
  const categoryRaw = cleanWhitespace(row.category || '');
  const categoryInfo = getCategoryDetails(categoryRaw);

  if (!productId || !title || !categoryRaw) return null;
  if (isVehicleLikeCategory(categoryRaw)) return null;

  const actualPrice = parsePrice(row.actual_price || row.price || 0);
  const discountedPrice = parsePrice(row.discounted_price || row.price || 0);
  const finalPrice = discountedPrice > 0 ? discountedPrice : actualPrice;
  const basePrice = actualPrice > 0 ? actualPrice : finalPrice;

  if (finalPrice <= 0) return null;
  if (Number.isNaN(Number(row.rating))) return null;

  const rating = Number.parseFloat(String(row.rating || '0').replace('|', ''));
  const ratingCount = Number.parseInt(String(row.rating_count || '0').replace(/,/g, '').replace(/[^0-9]/g, ''), 10) || 0;
  const description = cleanWhitespace(row.about_product || row.description || title) || title;
  const image = normalizeImage(row.img_link || row.image || '', title, categoryInfo.slug);

  return {
    id: String(productId),
    title,
    brand: inferBrand(title),
    category: categoryInfo.slug,
    categoryName: categoryInfo.name,
    subcategory: categoryRaw,
    description,
    price: basePrice,
    mrp: basePrice,
    discount: parseDiscountPercentage(row.discount_percentage, basePrice, finalPrice),
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: ratingCount,
    image,
    thumbnail: image,
    stock: 1,
    images: [image],
    tags: [categoryInfo.name]
  };
}

let catalogPromise;

export async function fetchAmazonProducts() {
  if (catalogPromise) return catalogPromise;

  catalogPromise = (async () => {
    const response = await fetch('/amazon.csv');
    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const rows = parseCsv(text);
    const uniqueProducts = new Map();

    rows.forEach(row => {
      const product = normalizeAmazonProduct(row);
      if (!product) return;
      if (!uniqueProducts.has(product.id)) {
        uniqueProducts.set(product.id, product);
      }
    });

    const products = [...uniqueProducts.values()].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    return products;
  })();

  return catalogPromise;
}

export async function getAmazonCategoryCatalog() {
  const products = await fetchAmazonProducts();
  return getAvailableCategories(products);
}
