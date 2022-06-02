import { mdsvex, compile ,escapeSvelte } from './node_modules/mdsvex/dist/main.cjs.js';
import adapter from '@sveltejs/adapter-vercel'
import preprocess from "svelte-preprocess";
// import adapter from '@sveltejs/adapter-static'

export const  config =  {
    preprocess: [
        preprocess({postcss: true, typescript: true}), 
        mdsvex({extensions: ['.svelte', '.svx', '.md'] })
    ],
    extension: [ ".svelte", ".svx", ".md"],
    kit: {
	    adapter: adapter({

	    }),
	    envPrefix: ".env",
	    vite: () => ({
	        optimizeDeps: {
		        include: [
		            "highlight.js/lib/core",
		        ],
		    }
		}),
	    envPrefix: ['VITE_', 'SVELTEKIT_STARTER_'],
        alias: {},
        appDir: '_app',
        browser: {
        hydrate: true,
        router: true
        },
        csp: {
        mode: 'auto',
        directives: {
            'default-src': undefined
            // ...
        }
        },
        endpointExtensions: ['.js', '.ts'],
        files: {
        assets: 'static',
        hooks: 'src/hooks',
        lib: 'src/lib',
        params: 'src/params',
        routes: 'src/routes',
        serviceWorker: 'src/service-worker',
        template: 'src/app.html'
        },
        floc: false,
        inlineStyleThreshold: 0,
        methodOverride: {
        parameter: '_method',
        allowed: []
        },
        outDir: '.svelte-kit',
        package: {
        dir: 'package',
        emitTypes: true,
        // excludes all .d.ts and files starting with _ as the name
        exports: (filepath) => !/^_|\/_|\.d\.ts$/.test(filepath),
        files: () => true
        },
        paths: {
        assets: '',
        base: ''
        },
        prerender: {
        concurrency: 1,
        crawl: true,
        default: false,
        enabled: true,
        entries: ['*'],
        onError: 'fail'
        },
        routes: (filepath) => !/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(filepath),
        serviceWorker: {
        register: true,
        files: (filepath) => !/\.DS_Store/.test(filepath)
        },
        trailingSlash: 'never',
        version: {
        name: Date.now().toString(),
        pollInterval: 0
        },
        vite: () => ({})
},
}




export default config;
