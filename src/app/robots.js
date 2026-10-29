export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beegodelivery.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/store-portal/', '/delivery-portal/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

