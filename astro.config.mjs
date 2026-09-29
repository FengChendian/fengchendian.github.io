// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://fengchendian.github.io',
	integrations: [mdx(), sitemap()],
	vite: {
		// @ts-expect-error vite version mismatch between astro and @tailwindcss/vite
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
});
