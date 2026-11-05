import { lookup } from 'node:dns/promises';

/**
 * Downloads a caller-supplied URL for a multipart upload without letting the
 * caller reach the host's own network.
 *
 * Placid takes uploads as multipart, and a caller holding only a public URL
 * cannot build a Blob itself, so the bytes are fetched here and forwarded. That
 * makes `file_url` a server-side request: without checks, a tenant could point
 * it at loopback, a private range, or a cloud metadata endpoint and have the
 * response forwarded onward. Every hostname is resolved and every resolved
 * address is checked; redirects are followed by hand so each hop is checked
 * too.
 *
 * Reference for the blocked ranges: RFC 6890 and the AWS/GCP metadata
 * addresses (169.254.169.254, fd00:ec2::254).
 */

/** Longest a single upload download may take, including every redirect hop. */
export const DOWNLOAD_TIMEOUT_MS = 30_000;

/**
 * Cap on the bytes read into memory. Placid's docs do not state an upload
 * limit; 25 MB covers a high-resolution image or a font several times over
 * while keeping one call from exhausting the host.
 */
export const DOWNLOAD_MAX_BYTES = 25 * 1024 * 1024;

/** Redirects are followed by hand, so the number is bounded here. */
const MAX_REDIRECTS = 3;

const BLOCKED_V4: ReadonlyArray<readonly [string, number]> = [
	['0.0.0.0', 8],
	['10.0.0.0', 8],
	['100.64.0.0', 10],
	['127.0.0.0', 8],
	['169.254.0.0', 16],
	['172.16.0.0', 12],
	['192.0.0.0', 24],
	['192.0.2.0', 24],
	['192.88.99.0', 24],
	['192.168.0.0', 16],
	['198.18.0.0', 15],
	['198.51.100.0', 24],
	['203.0.113.0', 24],
	['224.0.0.0', 4],
	['240.0.0.0', 4],
];

function toV4(ip: string): number | undefined {
	const parts = ip.split('.');
	if (parts.length !== 4) return undefined;
	let value = 0;
	for (const part of parts) {
		if (!/^\d{1,3}$/.test(part)) return undefined;
		const n = Number(part);
		if (n > 255) return undefined;
		value = value * 256 + n;
	}
	return value;
}

/** True when the IPv4 address falls in a range the host must not reach. */
function isBlockedV4(ip: string): boolean {
	const value = toV4(ip);
	if (value === undefined) return true;
	return BLOCKED_V4.some(([base, bits]) => {
		const baseValue = toV4(base);
		if (baseValue === undefined) return false;
		const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
		return (value & mask) === (baseValue & mask);
	});
}

/**
 * Expands an IPv6 address to eight 16-bit groups. Handles `::` compression and
 * a trailing dotted-quad (`::ffff:127.0.0.1`).
 *
 * A colon means the input is an address literal, so anything that does not
 * parse as a real IPv6 address is rejected rather than padded: treating
 * `1:2:3` as valid would let an odd host string slip past the check.
 */
function toV6(ip: string): number[] | undefined {
	let text = ip;
	const zone = text.indexOf('%');
	if (zone !== -1) text = text.slice(0, zone);

	// A dotted-quad tail is two groups.
	const lastColon = text.lastIndexOf(':');
	const tail = text.slice(lastColon + 1);
	if (tail.includes('.')) {
		const v4 = toV4(tail);
		if (v4 === undefined) return undefined;
		text = `${text.slice(0, lastColon + 1)}${(v4 >>> 16).toString(16)}:${(v4 & 0xffff).toString(16)}`;
	}

	const halves = text.split('::');
	if (halves.length > 2) return undefined;
	const parse = (part: string) =>
		part === '' ? [] : part.split(':').filter((g) => g !== '');

	const head = parse(halves[0] ?? '');
	const rest = halves.length === 2 ? parse(halves[1] ?? '') : [];

	if (![...head, ...rest].every((g) => /^[0-9a-fA-F]{1,4}$/.test(g))) {
		return undefined;
	}

	// Without `::`, all eight groups must be present. With it, at least one
	// group must be elided, which is what makes `1:2:3` invalid rather than a
	// valid address with zero padding.
	if (halves.length === 1) {
		return head.length === 8
			? head.map((g) => Number.parseInt(g, 16))
			: undefined;
	}
	const fill = 8 - head.length - rest.length;
	if (fill < 1) return undefined;
	const groups = [...head, ...Array<string>(fill).fill('0'), ...rest];
	return groups.map((g) => Number.parseInt(g, 16));
}

function isBlockedV6(ip: string): boolean {
	const groups = toV6(ip);
	if (!groups) return true;

	// `::ffff:a.b.c.d` and `::a.b.c.d` embed an IPv4 address; judge that.
	const firstFiveZero = groups.slice(0, 5).every((g) => g === 0);
	if (firstFiveZero && (groups[5] === 0xffff || groups[5] === 0)) {
		const v4 = `${groups[6]! >> 8}.${groups[6]! & 0xff}.${groups[7]! >> 8}.${groups[7]! & 0xff}`;
		if (isBlockedV4(v4)) return true;
	}

	// Unspecified (::).
	if (groups.every((g) => g === 0)) return true;
	// Loopback (::1).
	if (groups.slice(0, 7).every((g) => g === 0) && groups[7] === 1) return true;
	// Unique local (fc00::/7).
	if ((groups[0]! & 0xfe00) === 0xfc00) return true;
	// Link-local (fe80::/10).
	if ((groups[0]! & 0xffc0) === 0xfe80) return true;
	// Multicast (ff00::/8).
	if ((groups[0]! & 0xff00) === 0xff00) return true;
	// 6to4 (2002::/16) can embed an arbitrary v4 address; NAT64 (64:ff9b::/96)
	// maps one in the last two groups.
	if (groups[0] === 0x2002) return true;
	if (
		groups[0] === 0x0064 &&
		groups[1] === 0xff9b &&
		groups.slice(2, 6).every((g) => g === 0)
	) {
		return true;
	}
	return false;
}

/** True for any address the plugin must not connect to. */
export function isBlockedAddress(ip: string): boolean {
	const bare = ip.startsWith('[') && ip.endsWith(']') ? ip.slice(1, -1) : ip;
	if (bare.includes(':')) return isBlockedV6(bare);
	return isBlockedV4(bare);
}

export class UnsafeUrlError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnsafeUrlError';
	}
}

export type DownloadDeps = {
	/** Resolves a hostname. Injected so tests need no network. */
	resolve?: (hostname: string) => Promise<string[]>;
	fetchImpl?: typeof fetch;
};

async function defaultResolve(hostname: string): Promise<string[]> {
	const records = await lookup(hostname, { all: true, verbatim: true });
	return records.map((record) => record.address);
}

/**
 * Rejects a URL unless it is http(s) and every address its host resolves to is
 * public. A literal IP is checked directly.
 *
 * Residual risk: the name is resolved here and again by `fetch`, so a
 * deliberately rebinding DNS server could answer differently the second time.
 * Closing that window needs a custom agent that pins the checked address,
 * which `corsair/http` does not expose. The check still stops the ordinary
 * case of a caller naming an internal host outright.
 */
export async function assertPublicUrl(
	raw: string,
	deps: DownloadDeps = {},
): Promise<URL> {
	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		throw new UnsafeUrlError('file_url must be an absolute URL.');
	}
	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new UnsafeUrlError('file_url must use http or https.');
	}

	const hostname = url.hostname.replace(/^\[|\]$/g, '');
	if (hostname === '') {
		throw new UnsafeUrlError('file_url must include a host.');
	}

	const literal = hostname.includes(':') || toV4(hostname) !== undefined;
	const addresses = literal
		? [hostname]
		: await (deps.resolve ?? defaultResolve)(hostname).catch(() => {
				throw new UnsafeUrlError(`Could not resolve ${hostname}.`);
			});

	if (addresses.length === 0) {
		throw new UnsafeUrlError(`Could not resolve ${hostname}.`);
	}
	// Every answer must be public: one private answer is enough to reach it.
	for (const address of addresses) {
		if (isBlockedAddress(address)) {
			throw new UnsafeUrlError(
				`file_url points at ${hostname}, which resolves to a private or reserved address. Use a publicly reachable URL.`,
			);
		}
	}
	return url;
}

async function readCapped(
	response: Response,
	maxBytes: number,
): Promise<Uint8Array> {
	const body = response.body;
	if (!body) {
		const buffer = new Uint8Array(await response.arrayBuffer());
		if (buffer.byteLength > maxBytes) {
			throw new UnsafeUrlError(
				`file_url is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`,
			);
		}
		return buffer;
	}

	const reader = body.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		if (!value) continue;
		total += value.byteLength;
		if (total > maxBytes) {
			// Stop pulling: the point of the cap is not to buffer the rest.
			await reader.cancel().catch(() => undefined);
			throw new UnsafeUrlError(
				`file_url is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`,
			);
		}
		chunks.push(value);
	}

	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

export function filenameFromUrl(fileUrl: string, fallback: string): string {
	try {
		const last = new URL(fileUrl).pathname.split('/').pop();
		return last && last.includes('.') ? last : fallback;
	} catch {
		return fallback;
	}
}

/**
 * Fetches `fileUrl` and wraps it as a `File` for the multipart body. Each
 * redirect hop is validated, the whole download shares one deadline, and the
 * body is capped while it is read.
 */
export async function downloadAsFile(
	fileUrl: string,
	filename: string | undefined,
	fallbackName: string,
	deps: DownloadDeps = {},
): Promise<File> {
	const fetchImpl = deps.fetchImpl ?? fetch;
	const signal = AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS);

	let current = await assertPublicUrl(fileUrl, deps);
	for (let hop = 0; ; hop++) {
		const response = await fetchImpl(current, { redirect: 'manual', signal });

		const location = response.headers.get('location');
		if (response.status >= 300 && response.status < 400 && location) {
			if (hop >= MAX_REDIRECTS) {
				throw new UnsafeUrlError(
					`file_url redirected more than ${MAX_REDIRECTS} times.`,
				);
			}
			// Resolve relative to the hop that sent it, then vet the new host.
			current = await assertPublicUrl(
				new URL(location, current).toString(),
				deps,
			);
			continue;
		}

		if (!response.ok) {
			throw new Error(
				`Could not download file_url (${response.status}). It must be publicly reachable.`,
			);
		}

		const bytes = await readCapped(response, DOWNLOAD_MAX_BYTES);
		const mime =
			response.headers.get('content-type')?.split(';')[0] ||
			'application/octet-stream';
		return new File(
			[new Uint8Array(bytes)],
			filename ?? filenameFromUrl(current.toString(), fallbackName),
			{ type: mime },
		);
	}
}
