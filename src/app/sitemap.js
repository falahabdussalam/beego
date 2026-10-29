import { CATEGORIES_DATA } from '../server/data/categories';
import { INITIAL_PRODUCTS, INITIAL_STORES } from '../server/data/catalog';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beegodelivery.in';

  const staticPages = [
    '',
    '/categories',
    '/search',
    '/cart',
    '/login',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryPages = CATEGORIES_DATA.map((cat) => ({
    url: `${baseUrl}/categories/${cat.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const storePages = INITIAL_STORES.map((s) => ({
    url: `${baseUrl}/stores/${s.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const productPages = INITIAL_PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...storePages, ...productPages];
}

