import defaultTheme from 'vitepress/theme';
import { defineConfig } from 'vitepress';
import { getPosts } from './theme/serverUtils';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '幺叁叁',
  description: 'Ysansan blog',
  themeConfig: {
    posts: await getPosts(),
  },
});
