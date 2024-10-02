'use client';

import Giscus from '@giscus/react';

export function CommentArea() {
  return (
    <Giscus
      repo="dannyh79/dannyh79.github.io"
      repoId="MDEwOlJlcG9zaXRvcnkxOTkzNjQ1MTc="
      category="General"
      categoryId="DIC_kwDOC-IPpc4Ci-1k"
      mapping="pathname"
      strict="1"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      theme="preferred_color_scheme"
      lang="en"
      loading="lazy"
    />
  );
}

export default CommentArea;
