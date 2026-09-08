class MockHeaders {
	constructor(init) {
		this.map = new Map();
		if (init) {
			if (init instanceof MockHeaders) {
				init.map.forEach((v, k) => this.map.set(k, v));
			} else if (typeof init === 'object') {
				Object.entries(init).forEach(([k, v]) =>
					this.map.set(k.toLowerCase(), String(v)),
				);
			}
		}
	}
	get(name) {
		return this.map.get(name.toLowerCase()) ?? null;
	}
	set(name, value) {
		this.map.set(name.toLowerCase(), String(value));
	}
	has(name) {
		return this.map.has(name.toLowerCase());
	}
	forEach(callback) {
		this.map.forEach(callback);
	}
}

if (typeof globalThis.Headers === 'undefined') {
	globalThis.Headers = global.Headers || MockHeaders;
}
if (typeof global.Headers === 'undefined') {
	global.Headers = globalThis.Headers || MockHeaders;
}
if (typeof globalThis.__filename === 'undefined') {
	globalThis.__filename = __filename;
}
if (typeof globalThis.__dirname === 'undefined') {
	globalThis.__dirname = __dirname;
}
