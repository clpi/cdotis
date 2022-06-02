import preprocess from 'svelte-preprocess';
import mdsvex from 'mdsvex';
import vercel from '@sveltejs/adapter-vercel'
// import adapter from '@sveltejs/adapter-static'

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
	adapter: vercel(),
	vite: () => ({
	    optimizeDeps: {
		include: [
		    "highlight.js/lib/core",
		]
	    },
	    resolve: {
		/* alias: {
		    $stores: resolve(__dirname, './src/stores'),
		    $components: resolve(__dirname, './src/lib/shared/components'),
		    $ui: resolve(__dirname, './src/lib/shared/ui'),
		    $layouts: resolve(__dirname, './src/lib/layouts'),
		    $shared: resolve(__dirname, './src/lib/shared'),
		    $models: resolve(__dirname, './src/lib/models'),
		    $data: resolve(__dirname, './src/lib/data'),
		    $core: resolve(__dirname, './src/lib/core'),
		    $utils: resolve(__dirname, './src/lib/utils'),
		    $environment: resolve(__dirname, './src/environments'),
		}, */
	    },
	    envPrefix: ['VITE_', 'SVELTEKIT_STARTER_'],
	    // plugins: [imagetools({ force: true })],
	}),
     },
};

export default config;
		/* adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		}) */
