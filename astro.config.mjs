// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
<<<<<<< HEAD
	site: process.env.SITE_URL || 'https://example.com',
	redirects: {
		'/blog/first-post/': '/blog/',
		'/blog/second-post/': '/blog/',
		'/blog/third-post/': '/blog/',
		'/blog/markdown-style-guide/': '/blog/',
		'/blog/using-mdx/': '/blog/',
	},
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
=======
  site: 'https://example.com',
	output: 'server',

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Atkinson',
          cssVariable: '--font-atkinson',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/atkinson-regular.woff'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/atkinson-bold.woff'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
>>>>>>> bb5f19e (feature(ssr): convert static site into dynamic site)
	],

  adapter: node({
    mode: 'standalone',
  }),
});