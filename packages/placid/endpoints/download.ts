import { lookup } from 'node:dns/promises';
import * as http from 'node:http';
import * as https from 'node:https';
import type { LookupFunction } from 'node:net';

/**
 * Downloads a caller-supplied URL for a multipart upload without letting the
 * caller reach the host's own network.
 *
 * Placid takes uploads as multipart, and a caller holding only a public URL
 * cannot build a Blob itself, so the bytes are fetched here and forwarded. That
 * makes `file_url` a server-side request: without checks, a tenant could point
 * it at loopback, a private range, or a cloud metadata endpoint and have the
 * response forwarded onward.
 *
 * Three checks stand between the caller and the socket, and all three are
 * needed:
 *
 * 1. the scheme must be http or https;
 * 2. every address the host resolves to must be public;
 * 3. the connection is pinned to a checked address, so a DNS server that
 *    answers differently the second time cannot swap in a private one.
 *
 * Point 3 is why this uses `node:http` rather than `fetch`: `fetch` offers no
 * way to supply the address it should connect to.
 *
 * Blocked ranges follow RFC 6890, plus the metadata addresses that matter most
 * in practice (169.254.169.254 and fd00:ec2::254).
 */

/** Longest a single upload download may take. */
export const DOWNLOAD_TIMEOUT_MS = 30_000;

/**
 * Cap on the bytes read into memory. Placid does not document an upload limit;
 * 25 MB covers a high-resolution image or a font several times over while
 * keeping one call from exhausting the host.
 */
export const DOWNLOAD_MAX_BYTES = 25 * 1024 * 1024;

/** Redirects are followed by hand, so each hop is checked. */
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
	if (lastColon === -1) return undefined;
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
	// 6to4 (2002::/16) can embed an arbitrary v4 address.
	if (groups[0] === 0x2002) return true;
	// NAT64 (64:ff9b::/96) maps a v4 address into the last two groups.
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

export type TransportResponse = {
	status: number;
	headers: Record<string, string | string[] | undefined>;
	body: AsyncIterable<Uint8Array>;
};

export type DownloadDeps = {
	/** Resolves a hostname. Injected so tests need no network. */
	resolve?: (hostname: string) => Promise<string[]>;
	/**
	 * Performs one request to a pinned address. Injected so the redirect and
	 * size logic can be tested without opening a socket.
	 */
	transport?: (
		url: URL,
		addresses: readonly string[],
		signal: AbortSignal,
	) => Promise<TransportResponse>;
};

async function defaultResolve(hostname: string): Promise<string[]> {
	const records = await lookup(hostname, { all: true, verbatim: true });
	return records.map((record) => record.address);
}

/**
 * A `lookup` for `node:http`/`node:https` that always answers with an address
 * that has already been checked.
 *
 * This is what closes the DNS-rebinding window: the resolver is not consulted
 * again at connect time, so an answer that changes between the check and the
 * connection cannot redirect the socket to a private address.
 *
 * Node calls a lookup in two shapes. With `all: true` it wants the whole set
 * (`(err, [{address, family}])`); otherwise it wants one `(err, address,
 * family)`. Handling only one shape makes Node throw "Invalid IP address".
 */
export function pinnedLookup(addresses: readonly string[]): LookupFunction {
	// unknown: node types the lookup callback as an overloaded pair, which a
	// single implementation cannot satisfy directly. It is narrowed below.
	return ((_hostname: string, options: unknown, callback: unknown) => {
		const cb = callback as (
			error: Error | null,
			address: string | { address: string; family: number }[],
			family?: number,
		) => void;
		const wantsAll =
			typeof options === 'object' &&
			options !== null &&
			(options as { all?: boolean }).all === true;

		const records = addresses.map((address) => ({
			address,
			family: address.includes(':') ? 6 : 4,
		}));

		if (records.length === 0) {
			cb(new Error('No address to connect to.'), '', 0);
			return;
		}
		if (wantsAll) {
			cb(null, records);
			return;
		}
		const first = records[0]!;
		cb(null, first.address, first.family);
	}) as LookupFunction;
}

/**
 * The real transport: one HTTP(S) GET to a pinned address, honouring the
 * abort signal and reporting the raw response for the caller to read.
 */
const httpTransport: NonNullable<DownloadDeps['transport']> = (
	url,
	addresses,
	signal,
) => {
	const isHttps = url.protocol === 'https:';
	const hostname = url.hostname.replace(/^\[|\]$/g, '');
	const options: https.RequestOptions = {
		method: 'GET',
		protocol: url.protocol,
		hostname,
		// The URL's port, falling back to the scheme default.
		port: url.port === '' ? undefined : Number(url.port),
		path: `${url.pathname}${url.search}`,
		headers: { Accept: '*/*' },
		// Connect to the vetted address while keeping the hostname for TLS SNI
		// and the Host header.
		lookup: pinnedLookup(addresses),
		signal,
	};
	if (isHttps) options.servername = hostname;

	return new Promise<TransportResponse>((resolve, reject) => {
		const send = isHttps ? https.request : http.request;
		const request = send(options, (response) => {
			resolve({
				status: response.statusCode ?? 0,
				headers: response.headers,
				body: response as AsyncIterable<Uint8Array>,
			});
		});
		request.on('error', reject);
		request.end();
	});
};

export type ResolvedUrl = { url: URL; addresses: string[] };

/**
 * Rejects a URL unless it is http(s) and every address its host resolves to is
 * public, and returns those addresses so the connection can be pinned to one.
 * A literal IP is checked directly.
 */
export async function resolvePublicUrl(
	raw: string,
	deps: DownloadDeps = {},
): Promise<ResolvedUrl> {
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
	// The whole set is what gets pinned, so a later change cannot help either.
	for (const address of addresses) {
		if (isBlockedAddress(address)) {
			throw new UnsafeUrlError(
				`file_url points at ${hostname}, which resolves to a private or reserved address. Use a publicly reachable URL.`,
			);
		}
	}
	return { url, addresses };
}

export function filenameFromUrl(fileUrl: string, fallback: string): string {
	try {
		const last = new URL(fileUrl).pathname.split('/').pop();
		return last && last.includes('.') ? last : fallback;
	} catch {
		return fallback;
	}
}

function headerValue(
	headers: TransportResponse['headers'],
	name: string,
): string | undefined {
	const raw = headers[name];
	const value = Array.isArray(raw) ? raw[0] : raw;
	return value;
}

async function readCapped(
	body: AsyncIterable<Uint8Array>,
	maxBytes: number,
): Promise<Uint8Array> {
	const chunks: Uint8Array[] = [];
	let total = 0;
	for await (const chunk of body) {
		total += chunk.byteLength;
		if (total > maxBytes) {
			throw new UnsafeUrlError(
				`file_url is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`,
			);
		}
		chunks.push(chunk);
	}
	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

/**
 * Fetches `fileUrl` and wraps it as a `File` for the multipart body. Each
 * redirect hop is resolved and vetted again, the connection is pinned to a
 * checked address, the whole download shares one deadline, and the body is
 * capped while it is read.
 */
export async function downloadAsFile(
	fileUrl: string,
	filename: string | undefined,
	fallbackName: string,
	deps: DownloadDeps = {},
): Promise<File> {
	const transport = deps.transport ?? httpTransport;
	const signal = AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS);

	let current = await resolvePublicUrl(fileUrl, deps);
	for (let hop = 0; ; hop++) {
		const response = await transport(current.url, current.addresses, signal);

		const location = headerValue(response.headers, 'location');
		if (response.status >= 300 && response.status < 400 && location) {
			if (hop >= MAX_REDIRECTS) {
				throw new UnsafeUrlError(
					`file_url redirected more than ${MAX_REDIRECTS} times.`,
				);
			}
			// Resolve relative to the hop that sent it, then vet the new host.
			current = await resolvePublicUrl(
				new URL(location, current.url).toString(),
				deps,
			);
			continue;
		}

		if (response.status < 200 || response.status >= 300) {
			throw new Error(
				`Could not download file_url (${response.status}). It must be publicly reachable.`,
			);
		}

		const bytes = await readCapped(response.body, DOWNLOAD_MAX_BYTES);
		const mime =
			headerValue(response.headers, 'content-type')?.split(';')[0] ||
			'application/octet-stream';
		return new File(
			[new Uint8Array(bytes)],
			filename ?? filenameFromUrl(current.url.toString(), fallbackName),
			{ type: mime },
		);
	}
}
