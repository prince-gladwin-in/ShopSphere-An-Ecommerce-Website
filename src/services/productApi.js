import { fetchAmazonProducts, getAmazonCategoryCatalog } from '../data/amazonProducts';

const DEFAULT_LIMIT = 30;

function normalizeProduct(product) {
  return {
    ...product,
    id: String(product.id),
    category: product.category || 'general',
    title: product.title || 'ShopSphere product',
    description: product.description || product.title || 'ShopSphere product',
    price: Number(product.price) || 0,
    mrp: Number(product.mrp) || Number(product.price) || 0,
    discountPercentage: Number(product.discount) || 0,
    rating: Number(product.rating) || 0,
    stock: Number(product.stock) || 1,
    brand: product.brand || '',
    thumbnail: product.thumbnail || product.image || '',
    image: product.image || product.thumbnail || '',
    images: Array.isArray(product.images) && product.images.length ? product.images : [product.image || product.thumbnail || ''],
    tags: Array.isArray(product.tags) ? product.tags : []
  };
}

export async function getProducts(limit = DEFAULT_LIMIT, skip = 0) {
  const products = await fetchAmazonProducts();
  const sliced = products.slice(skip, skip + limit);
  return {
    products: sliced.map(normalizeProduct),
    total: products.length,
    skip,
    limit: sliced.length
  };
}

export async function getProductById(id) {
  const products = await fetchAmazonProducts();
  const product = products.find(item => String(item.id) === String(id));
  return product ? normalizeProduct(product) : null;
}

export async function getCategories() {
  return getAmazonCategoryCatalog();
}

export async function getProductsByCategory(category, limit = DEFAULT_LIMIT) {
  const products = await fetchAmazonProducts();
  const filtered = products.filter(product => product.category === category).slice(0, limit);
  return {
    products: filtered.map(normalizeProduct),
    total: filtered.length
  };
}

export async function searchProducts(query, limit = DEFAULT_LIMIT) {
  const searchValue = String(query || '').trim().toLowerCase();
  const products = await fetchAmazonProducts();

  if (!searchValue) {
    return {
      products: products.slice(0, limit).map(normalizeProduct),
      total: products.length
    };
  }

  const filtered = products.filter(product => {
    const haystack = [
      product.title,
      product.brand,
      product.category,
      product.description,
      product.subcategory
    ].join(' ').toLowerCase();

    return haystack.includes(searchValue);
  }).slice(0, limit);

  return {
    products: filtered.map(normalizeProduct),
    total: filtered.length
  };
}

export async function getRelatedProducts(category, currentId, limit = 8) {
  const products = await fetchAmazonProducts();
  const filtered = products.filter(product => product.category === category && String(product.id) !== String(currentId));
  return filtered.slice(0, limit).map(normalizeProduct);
}
