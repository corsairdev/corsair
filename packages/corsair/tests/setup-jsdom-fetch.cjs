/**
 * setupFilesAfterEnv: patches Node's native fetch onto the jsdom window.
 *
 * In jsdom, `globalThis` is the jsdom window, which has no fetch.
 * `global` is the actual Node.js global, which has fetch in Node 18+.
 * We force-copy it so tests that hit real localhost servers can use fetch.
 */
const nodeFetch = global.fetch;
const nodeRequest = global.Request;
const nodeResponse = global.Response;
const nodeHeaders = global.Headers;

if (typeof nodeFetch === 'function') {
	// Force override regardless of what jsdom has
	Object.defineProperty(globalThis, 'fetch', {
		value: nodeFetch,
		writable: true,
		configurable: true,
	});
	Object.defineProperty(globalThis, 'Request', {
		value: nodeRequest,
		writable: true,
		configurable: true,
	});
	Object.defineProperty(globalThis, 'Response', {
		value: nodeResponse,
		writable: true,
		configurable: true,
	});
	Object.defineProperty(globalThis, 'Headers', {
		value: nodeHeaders,
		writable: true,
		configurable: true,
	});
}
