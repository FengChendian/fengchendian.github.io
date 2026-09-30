// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeCallouts from 'rehype-callouts';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://fengchendian.github.io',
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		remarkPlugins: [remarkMath, remarkReadingTime],
		rehypePlugins: [rehypeKatex, rehypeCallouts],
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
});
