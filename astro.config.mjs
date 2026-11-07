import { defineConfig } from 'astro/config';

// Keep the old WordPress URLs exactly: /about-testlab/ etc.
export default defineConfig({
  site: 'https://testlabcdo.com',
  trailingSlash: 'always',
});
