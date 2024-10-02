import Script from 'next/script';

const Giscus = () => {
  return (
    // Generated via https://giscus.vercel.app
    <Script
      src="https://giscus.app/client.js"
      data-repo="dannyh79/dannyh79.github.io"
      data-repo-id="MDEwOlJlcG9zaXRvcnkxOTkzNjQ1MTc="
      data-category="General"
      data-category-id="DIC_kwDOC-IPpc4Ci-1k"
      data-mapping="pathname"
      data-strict="1"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="preferred_color_scheme"
      data-lang="en"
      data-loading="lazy"
      crossOrigin="anonymous"
      async
    />
  );
};

export default Giscus;
