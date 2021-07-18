import preprocess from 'svelte-preprocess';
import mdsvex from 'mdsvex';
import vercel from '@sveltejs/adapter-vercel'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	extensions: [
		'.svelte', '.svx'
	],
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: vercel()
	 }
};

export default config;
		/* adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}) */
