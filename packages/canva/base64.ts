function canonicalizeBase64(base64: string): string {
	const normalized = base64
		.replace(/\s+/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const remainder = normalized.length % 4;
	if (remainder === 1) {
		throw new Error('Invalid base64 input');
	}
	const padded =
		remainder === 0 ? normalized : normalized + '='.repeat(4 - remainder);
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(padded)) {
		throw new Error('Invalid base64 input');
	}
	return padded;
}

export function decodeBase64ToBytes(base64: string): Uint8Array {
	const canonical = canonicalizeBase64(base64);

	if (typeof Buffer !== 'undefined') {
		return new Uint8Array(Buffer.from(canonical, 'base64'));
	}

	const binary = atob(canonical);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export function encodeUtf8ToBase64(value: string): string {
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(value, 'utf8').toString('base64');
	}

	const bytes = new TextEncoder().encode(value);
	let binary = '';
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}
