// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Layout from './components/Layout.vue';
import './style.less';

export default {
  extends: DefaultTheme,
  Layout,

} satisfies Theme;
