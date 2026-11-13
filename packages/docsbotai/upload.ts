import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { isIP } from 'node:net';

// Hash the key and URL instead of retaining either credential in memory.
// Limit retention and size independently of the provider's signed URL lifetime.
const approved = new Map<string, number>();
const maxEntries = 1024;
const lifetimeMs = 15 * 60 * 1000;
const fingerprint = (key: string, url: string) =>
	createHash('sha256')
		.update(JSON.stringify([key, url]))
		.digest('hex');

export function rememberUploadUrl(key: string, url: string): void {
	const now = Date.now();
	for (const [id, expiry] of approved) {
		if (expiry <= now) approved.delete(id);
	}
	if (approved.size >= maxEntries) {
		const oldest = approved.keys().next().value;
		if (oldest) approved.delete(oldest);
	}
	approved.set(fingerprint(key, url), now + lifetimeMs);
}

// Only globally routable IPv4 unicast addresses are eligible. Reject
// special-use allocations conservatively; IPv6 and mapped addresses are denied.
function isPublicAddress(address: string): boolean {
	if (isIP(address) === 4) {
		const [a, b, c] = address.split('.').map(Number);
		if (a === undefined || b === undefined || c === undefined) return false;
		return !(
			a === 0 ||
			a === 10 ||
			a === 127 ||
			a >= 224 ||
			(a === 100 && b >= 64 && b <= 127) ||
			(a === 169 && b === 254) ||
			(a === 172 && b >= 16 && b <= 31) ||
			(a === 192 && (b === 0 || b === 168 || b === 88)) ||
			(a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
			(a === 203 && b === 0 && c === 113)
		);
	}
	// Restrict to IPv4 for now: this avoids IPv6 transition/tunneling ranges
	// and still supports the documented Google Storage hostname's A records.
	return false;
}

export async function uploadToStorage(
	key: string,
	uploadUrl: string,
	data: Uint8Array,
): Promise<void> {
	const url = new URL(uploadUrl);
	if (
		url.protocol !== 'https:' ||
		url.hostname !== 'storage.googleapis.com' ||
		url.port ||
		url.username ||
		url.password ||
		url.hash
	)
		throw new Error('Upload URL must use the documented HTTPS storage host');
	const id = fingerprint(key, uploadUrl);
	const expiry = approved.get(id);
	if (!key || !expiry || expiry <= Date.now()) {
		approved.delete(id);
		throw new Error('Upload URL must be obtained from DocsBot in this process');
	}
	// Resolve once and pin the chosen address in the actual TLS connection; do
	// not let the HTTP stack perform a second lookup susceptible to rebinding.
	let addresses: Array<{ address: string; family: number }>;
	try {
		addresses = await lookup(url.hostname, { all: true, family: 4 });
	} catch {
		throw new Error('Storage address lookup failed');
	}
	if (
		!Array.isArray(addresses) ||
		!addresses.length ||
		addresses.some(
			({ address, family }) => family !== 4 || !isPublicAddress(address),
		)
	)
		throw new Error('Storage address is not public');
	const selected = addresses[0];
	if (!selected) throw new Error('Storage address lookup failed');
	await new Promise<void>((resolve, reject) => {
		const req = request(
			url,
			{
				method: 'PUT',
				agent: false,
				family: 4,
				headers: { 'Content-Type': 'application/octet-stream' },
				lookup: (_hostname, _options, callback) =>
					callback(null, selected.address, 4),
			},
			(response) => {
				const status = response.statusCode ?? 0;
				response.on('error', () => reject(new Error('Storage upload failed')));
				response.on('aborted', () =>
					reject(new Error('Storage upload failed')),
				);
				response.on('end', () => {
					if (status < 200 || status >= 300)
						reject(new Error(`Storage upload failed (${status})`));
					else resolve();
				});
				response.resume();
			},
		);
		req.on('error', () => reject(new Error('Storage upload failed')));
		req.end(data);
	});
}
