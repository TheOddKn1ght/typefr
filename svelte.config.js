import adapter from '@sveltejs/adapter-static';	

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (/^\/icon-\d+(-maskable)?\.png$/.test(path)) return;
				throw new Error(`${message} (${path} from ${referrer})`);
			}
		}
	}
};

export default config;
