import { ssr } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.ico\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

set_paths({"base":"","assets":"/."});

// allow paths to be overridden in svelte-kit start
export function init({ paths, prerendering }) {
	set_paths(paths);
	set_prerendering(prerendering);
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"robots.txt","size":67,"type":"text/plain"}],
	layout: "src/routes/$layout.svelte",
	error: ".svelte/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/$layout.svelte", "src/routes/index.svelte"],
						b: [".svelte/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/about\/?$/,
						params: empty,
						a: ["src/routes/$layout.svelte", "src/routes/about.svelte"],
						b: [".svelte/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getContext: hooks.getContext || (() => ({})),
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const hooks = get_hooks(user_hooks);

const module_lookup = {
	"src/routes/$layout.svelte": () => import("..\\..\\src\\routes\\$layout.svelte"),".svelte/build/components/error.svelte": () => import("./components\\error.svelte"),"src/routes/index.svelte": () => import("..\\..\\src\\routes\\index.svelte"),"src/routes/about.svelte": () => import("..\\..\\src\\routes\\about.svelte")
};

const metadata_lookup = {"src/routes/$layout.svelte":{"entry":"/./_app/pages\\$layout.svelte-21fec919.js","css":["/./_app/assets/pages\\$layout.svelte-7dc66399.css"],"js":["/./_app/pages\\$layout.svelte-21fec919.js","/./_app/chunks/vendor-053f8990.js"],"styles":null},".svelte/build/components/error.svelte":{"entry":"/./_app/error.svelte-bbc27217.js","css":[],"js":["/./_app/error.svelte-bbc27217.js","/./_app/chunks/vendor-053f8990.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages\\index.svelte-5074dc91.js","css":["/./_app/assets/pages\\index.svelte-6134a108.css"],"js":["/./_app/pages\\index.svelte-5074dc91.js","/./_app/chunks/vendor-053f8990.js"],"styles":null},"src/routes/about.svelte":{"entry":"/./_app/pages\\about.svelte-ed722ec7.js","css":[],"js":["/./_app/pages\\about.svelte-ed722ec7.js","/./_app/chunks/vendor-053f8990.js"],"styles":null}};

async function load_component(file) {
	if (!module_lookup[file]) {
		console.log({ file });
	}
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

export function render(request, {
	paths = {"base":"","assets":"/."},
	local = false,
	dependencies,
	only_render_prerenderable_pages = false,
	get_static_file
} = {}) {
	return ssr({
		...request,
		host: request.headers["host"]
	}, {
		paths,
		local,
		template,
		manifest,
		load_component,
		target: "#svelte",
		entry: "/./_app/start-e2dc0408.js",
		css: ["/./_app/assets/start-a8cd1609.css"],
		js: ["/./_app/start-e2dc0408.js","/./_app/chunks/vendor-053f8990.js"],
		root,
		hooks,
		dev: false,
		amp: false,
		dependencies,
		only_render_prerenderable_pages,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => error.stack,
		get_static_file,
		ssr: true,
		router: true,
		hydrate: true
	});
}