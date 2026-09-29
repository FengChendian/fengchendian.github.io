// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeCallouts from 'rehype-callouts';

// https://astro.build/config
export default defineConfig({
	site: 'https://fengchendian.github.io',
	integrations: [sitemap()],
	vite: {
		// @ts-expect-error vite version mismatch between astro and @tailwindcss/vite
		plugins: [tailwindcss()],
	},
	markdown: {
		rehypePlugins: [rehypeCallouts],
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
});
