import { baseUrl } from './constants';

// Next v15 bug; see https://github.com/vercel/next.js/issues/68667
export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
