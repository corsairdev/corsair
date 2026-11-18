import * as zlib from 'node:zlib';
import type { DownloadDeps } from './endpoints/download';
import {
	DOWNLOAD_MAX_BYTES,
	downloadAsFile,
	isBlockedAddress,
	pinnedLookup,
	resolvePublicUrl,
	UnsafeUrlError,
} from './endpoints/download';

/**
 * Wraps a jest mock as a transport.
 *
 * unknown: `jest.fn` returns `Mock<...>`, whose call signature does not line up
 * with the transport type even when the implementation matches. The double cast
 * is the narrowest way to hand the mock to production code; it is only ever
 * called from these tests.
 */
function asTransport(mock: jest.Mock): NonNullable<DownloadDeps['transport']> {
	// unknown: see the note above; the mock's signature is close enough at
	// runtime and the cast is confined to tests.
	return mock as unknown as NonNullable<DownloadDeps['transport']>;
}

// A public address, so the resolver never needs the network.
const publicResolve = async () => ['93.184.216.34'];
const resolveTo = (addresses: string[]) => async () => addresses;

function body(...chunks: Uint8Array[]): AsyncIterable<Uint8Array> {
	return (async function* () {
		for (const chunk of chunks) yield chunk;
	})();
}

describe('isBlockedAddress', () => {
	it('blocks loopback, private and link-local IPv4 ranges', () => {
		for (const ip of [
			'127.0.0.1',
			'127.255.255.254',
			'10.0.0.1',
			'10.255.255.255',
			'172.16.0.1',
			'172.31.255.255',
			'192.168.1.1',
			'169.254.169.254',
			'100.64.0.1',
			'0.0.0.0',
			'224.0.0.1',
			'255.255.255.255',
		]) {
			expect(isBlockedAddress(ip)).toBe(true);
		}
	});

	it('allows ordinary public IPv4 addresses', () => {
		for (const ip of ['1.1.1.1', '8.8.8.8', '93.184.216.34', '172.15.0.1']) {
			expect(isBlockedAddress(ip)).toBe(false);
		}
	});

	// 172.16/12 ends at 172.31; the neighbours must stay reachable.
	it('does not over-block the edges of the private ranges', () => {
		expect(isBlockedAddress('172.32.0.1')).toBe(false);
		expect(isBlockedAddress('11.0.0.1')).toBe(false);
		expect(isBlockedAddress('9.255.255.255')).toBe(false);
	});

	it('blocks IPv6 loopback, link-local, unique-local and multicast', () => {
		for (const ip of [
			'::1',
			'::',
			'fe80::1',
			'fc00::1',
			'fd12:3456::1',
			'ff02::1',
		]) {
			expect(isBlockedAddress(ip)).toBe(true);
		}
	});

	it('blocks IPv4 addresses embedded in IPv6', () => {
		expect(isBlockedAddress('::ffff:127.0.0.1')).toBe(true);
		expect(isBlockedAddress('::ffff:169.254.169.254')).toBe(true);
		expect(isBlockedAddress('::ffff:10.0.0.1')).toBe(true);
	});

	it('allows a public IPv6 address and an IPv4-mapped public one', () => {
		expect(isBlockedAddress('2606:4700:4700::1111')).toBe(false);
		expect(isBlockedAddress('::ffff:8.8.8.8')).toBe(false);
	});

	// RFC 8215 local-use translation prefix: a deployment can map it onto
	// private IPv4 space, so 64:ff9b:1::a00:1 may reach 10.0.0.1.
	it('blocks the local-use IPv4/IPv6 translation prefix', () => {
		expect(isBlockedAddress('64:ff9b:1::a00:1')).toBe(true);
		expect(isBlockedAddress('64:ff9b:1:ffff::1')).toBe(true);
		// The neighbouring /48 is not part of it.
		expect(isBlockedAddress('64:ff9b:2::1')).toBe(false);
	});

	it('treats an unparseable address as blocked', () => {
		expect(isBlockedAddress('not-an-ip')).toBe(true);
		expect(isBlockedAddress('999.1.1.1')).toBe(true);
		expect(isBlockedAddress('1:2:3')).toBe(true);
	});
});

describe('resolvePublicUrl', () => {
	it('accepts a public http(s) URL and returns its addresses', async () => {
		const resolved = await resolvePublicUrl('https://example.com/a.jpg', {
			resolve: resolveTo(['93.184.216.34']),
		});

		expect(resolved.url).toBeInstanceOf(URL);
		expect(resolved.addresses).toEqual(['93.184.216.34']);
	});

	it('rejects a non-http protocol', async () => {
		await expect(
			resolvePublicUrl('file:///etc/passwd', {
				resolve: resolveTo(['1.1.1.1']),
			}),
		).rejects.toBeInstanceOf(UnsafeUrlError);
		await expect(
			resolvePublicUrl('gopher://example.com', {
				resolve: resolveTo(['1.1.1.1']),
			}),
		).rejects.toBeInstanceOf(UnsafeUrlError);
	});

	it('rejects a host that resolves to loopback', async () => {
		await expect(
			resolvePublicUrl('http://localhost:8080/a.jpg', {
				resolve: resolveTo(['127.0.0.1']),
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('rejects when any of several answers is private', async () => {
		// One private answer is enough to reach the internal service.
		await expect(
			resolvePublicUrl('https://mixed.example/a.jpg', {
				resolve: resolveTo(['93.184.216.34', '10.0.0.5']),
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('rejects the cloud metadata address outright', async () => {
		await expect(
			resolvePublicUrl('http://169.254.169.254/latest/meta-data/', {
				resolve: resolveTo(['169.254.169.254']),
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('rejects a host that does not resolve', async () => {
		await expect(
			resolvePublicUrl('https://nope.invalid/a.jpg', {
				resolve: async () => {
					throw new Error('ENOTFOUND');
				},
			}),
		).rejects.toThrow(/Could not resolve/);
	});

	it('gives up on a lookup that outlasts the deadline', async () => {
		const controller = new AbortController();
		const pending = resolvePublicUrl(
			'https://slow.example/a.jpg',
			{ resolve: () => new Promise<string[]>(() => {}) },
			controller.signal,
		);
		controller.abort(new Error('deadline'));
		await expect(pending).rejects.toThrow('deadline');
	}, 5_000);

	it('rejects a relative string that is not a URL', async () => {
		await expect(
			resolvePublicUrl('/a.jpg', { resolve: resolveTo(['1.1.1.1']) }),
		).rejects.toThrow(/absolute URL/);
	});
});

describe('pinnedLookup', () => {
	// This is the check that closes the DNS-rebinding window: the socket goes to
	// a vetted address, and the resolver is not consulted again.
	it('always answers with the vetted address, whatever the hostname', (done) => {
		const lookup = pinnedLookup(['93.184.216.34']);

		// The second argument is normally a lookup options object.
		lookup('rebind.example', { family: 0 } as never, (error, address) => {
			expect(error).toBeNull();
			expect(address).toBe('93.184.216.34');
			done();
		});
	});

	it('reports family 6 for a v6 address', (done) => {
		const lookup = pinnedLookup(['2606:4700:4700::1111']);

		lookup('example.com', {} as never, (error, address, family) => {
			expect(error).toBeNull();
			expect(address).toBe('2606:4700:4700::1111');
			expect(family).toBe(6);
			done();
		});
	});

	it('errors when there is nothing to pin', (done) => {
		const lookup = pinnedLookup([]);

		lookup('example.com', {} as never, (error) => {
			expect(error).toBeInstanceOf(Error);
			done();
		});
	});

	// Node asks for the whole set when `all` is set, e.g. on connection reuse.
	// Answering with a single address there makes Node throw
	// "Invalid IP address: undefined", so both shapes are covered.
	it('answers with an address list when all is requested', (done) => {
		const lookup = pinnedLookup(['93.184.216.34', '1.1.1.1']);

		lookup('example.com', { all: true } as never, (error, records) => {
			expect(error).toBeNull();
			expect(records).toEqual([
				{ address: '93.184.216.34', family: 4 },
				{ address: '1.1.1.1', family: 4 },
			]);
			done();
		});
	});
});

describe('downloadAsFile', () => {
	it('returns a File with the response bytes and type', async () => {
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-type': 'image/png' },
				body: body(new Uint8Array([1, 2, 3])),
			})),
		);

		const file = await downloadAsFile(
			'https://example.com/logo.png',
			undefined,
			'fallback',
			{ resolve: publicResolve, transport },
		);

		expect(file.name).toBe('logo.png');
		expect(file.type).toBe('image/png');
		expect(file.size).toBe(3);
	});

	it('connects to the vetted address it resolved', async () => {
		const transportMock = jest.fn(async () => ({
			status: 200,
			headers: { 'content-type': 'image/png' },
			body: body(new Uint8Array([1])),
		}));
		const transport = asTransport(transportMock);

		await downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
			resolve: resolveTo(['93.184.216.34']),
			transport,
		});

		// The address travels with the request, so the transport pins it.
		expect(transportMock).toHaveBeenCalledWith(
			expect.anything(),
			['93.184.216.34'],
			expect.anything(),
		);
	});

	it('follows a redirect to another public host', async () => {
		let call = 0;
		const transport = asTransport(
			jest.fn(async () => {
				call += 1;
				if (call === 1) {
					return {
						status: 302,
						headers: { location: 'https://cdn.example/b.png' },
						body: body(),
					};
				}
				return {
					status: 200,
					headers: { 'content-type': 'image/png' },
					body: body(new Uint8Array([9])),
				};
			}),
		);

		const file = await downloadAsFile(
			'https://example.com/a.png',
			undefined,
			'f',
			{ resolve: publicResolve, transport },
		);

		expect(file.name).toBe('b.png');
		expect(call).toBe(2);
	});

	it('refuses a redirect to a private host instead of following it', async () => {
		const transport = asTransport(
			jest.fn(async () => ({
				status: 302,
				headers: { location: 'http://127.0.0.1/admin' },
				body: body(),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
				// The first host is public; the redirect target is not.
				resolve: async (hostname) =>
					hostname === '127.0.0.1' ? ['127.0.0.1'] : ['93.184.216.34'],
				transport,
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('stops after the redirect limit', async () => {
		const transport = asTransport(
			jest.fn(async () => ({
				status: 302,
				headers: { location: 'https://example.com/again.png' },
				body: body(),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/redirected more than/);
	});

	it('rejects a body larger than the cap', async () => {
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-type': 'application/octet-stream' },
				body: body(new Uint8Array(DOWNLOAD_MAX_BYTES + 1)),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/big.bin', 'big.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/larger than/);
	});

	it('stops reading past the cap instead of buffering the rest', async () => {
		let pulled = 0;
		const endless: AsyncIterable<Uint8Array> = {
			[Symbol.asyncIterator]() {
				return {
					next: async () => {
						pulled += 1;
						// 1 MB per chunk; the cap is 25.
						return { done: false, value: new Uint8Array(1024 * 1024) };
					},
				};
			},
		};
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-type': 'application/octet-stream' },
				body: endless,
			})),
		);

		await expect(
			downloadAsFile('https://example.com/big.bin', 'big.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/larger than/);
		// It gave up near the cap, not after draining an endless stream.
		expect(pulled).toBeLessThanOrEqual(27);
	});

	it('reports a failed download with the status', async () => {
		const transport = asTransport(
			jest.fn(async () => ({
				status: 403,
				headers: {},
				body: body(),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/publicly reachable/);
	});

	// node:http hands back the bytes as sent, unlike fetch. Without decoding,
	// Placid would receive gzip bytes named logo.png.
	it('decodes a gzip body before building the file', async () => {
		const original = Buffer.from('the real image bytes');
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-type': 'image/png', 'content-encoding': 'gzip' },
				body: body(new Uint8Array(zlib.gzipSync(original))),
			})),
		);

		const file = await downloadAsFile(
			'https://example.com/logo.png',
			undefined,
			'f',
			{
				resolve: publicResolve,
				transport,
			},
		);

		expect(Buffer.from(await file.arrayBuffer())).toEqual(original);
	});

	it('decodes a deflate body', async () => {
		const original = Buffer.from('deflated font bytes');
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: {
					'content-type': 'font/ttf',
					'content-encoding': 'deflate',
				},
				body: body(new Uint8Array(zlib.deflateSync(original))),
			})),
		);

		const file = await downloadAsFile(
			'https://example.com/f.ttf',
			'f.ttf',
			'f',
			{
				resolve: publicResolve,
				transport,
			},
		);

		expect(Buffer.from(await file.arrayBuffer())).toEqual(original);
	});

	it('decodes a brotli body', async () => {
		const original = Buffer.from('brotli bytes');
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-encoding': 'br' },
				body: body(new Uint8Array(zlib.brotliCompressSync(original))),
			})),
		);

		const file = await downloadAsFile(
			'https://example.com/a.bin',
			'a.bin',
			'f',
			{
				resolve: publicResolve,
				transport,
			},
		);

		expect(Buffer.from(await file.arrayBuffer())).toEqual(original);
	});

	it('passes an identity body through untouched', async () => {
		const original = Buffer.from('plain bytes');
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-encoding': 'identity' },
				body: body(new Uint8Array(original)),
			})),
		);

		const file = await downloadAsFile(
			'https://example.com/a.bin',
			'a.bin',
			'f',
			{
				resolve: publicResolve,
				transport,
			},
		);

		expect(Buffer.from(await file.arrayBuffer())).toEqual(original);
	});

	it('refuses an encoding it cannot decode', async () => {
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-encoding': 'compress' },
				body: body(new Uint8Array([1, 2])),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.bin', 'a.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/unsupported Content-Encoding/);
	});

	it('applies the cap to the decoded size, not the compressed one', async () => {
		// 26 MB of zeros compresses to a few KB; the decoded size must trip it.
		const big = Buffer.alloc(DOWNLOAD_MAX_BYTES + 1024, 0);
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-encoding': 'gzip' },
				body: body(new Uint8Array(zlib.gzipSync(big))),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.bin', 'a.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/larger than/);
	});

	it('rejects a declared Content-Length over the cap without reading', async () => {
		let pulled = false;
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-length': String(DOWNLOAD_MAX_BYTES + 1) },
				body: {
					[Symbol.asyncIterator]() {
						return {
							next: async () => {
								pulled = true;
								return { done: true, value: undefined };
							},
						};
					},
				},
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.bin', 'a.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/larger than/);
		expect(pulled).toBe(false);
	});

	// A compressed body whose connection drops mid-transfer, or whose 30 second
	// deadline fires, errors on the source stream. That error has to reach the
	// caller as a rejection; left unhandled it is an uncaught 'error' event.
	it('rejects when a compressed body fails mid-transfer', async () => {
		const compressed = new Uint8Array(
			zlib.gzipSync(Buffer.from('x'.repeat(4096))),
		);
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-encoding': 'gzip' },
				body: (async function* () {
					yield compressed.slice(0, 10);
					throw new Error('socket hang up');
				})(),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.bin', 'a.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow('socket hang up');
	}, 5_000);

	// Stored (level 0) gzip is slightly larger than its content, so this body
	// decodes to just under the cap while its encoded bytes go over it.
	it('caps the encoded bytes as well as the decoded ones', async () => {
		const encoded = new Uint8Array(
			zlib.gzipSync(Buffer.alloc(DOWNLOAD_MAX_BYTES - 100), { level: 0 }),
		);
		expect(encoded.byteLength).toBeGreaterThan(DOWNLOAD_MAX_BYTES);
		const transport = asTransport(
			jest.fn(async () => ({
				status: 200,
				headers: { 'content-encoding': 'gzip' },
				body: (async function* () {
					for (let i = 0; i < encoded.byteLength; i += 1024 * 1024) {
						yield encoded.subarray(i, i + 1024 * 1024);
					}
				})(),
			})),
		);

		await expect(
			downloadAsFile('https://example.com/a.bin', 'a.bin', 'f', {
				resolve: publicResolve,
				transport,
			}),
		).rejects.toThrow(/larger than/);
	}, 20_000);

	describe('shared deadline', () => {
		afterEach(() => jest.restoreAllMocks());

		it('applies to the first lookup', async () => {
			const controller = new AbortController();
			jest.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
			const pending = downloadAsFile('https://slow.example/a.png', 'a', 'f', {
				resolve: () => new Promise<string[]>(() => {}),
				transport: asTransport(jest.fn()),
			});
			controller.abort(new Error('deadline'));
			await expect(pending).rejects.toThrow('deadline');
		}, 5_000);

		it('applies to the lookup for a redirect hop', async () => {
			const controller = new AbortController();
			jest.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
			const transport = asTransport(
				jest.fn(async () => {
					// The redirect's lookup hangs; the deadline fires while it waits.
					setImmediate(() => controller.abort(new Error('deadline')));
					return {
						status: 302,
						headers: { location: 'https://slow.example/b.png' },
						body: body(),
					};
				}),
			);
			await expect(
				downloadAsFile('https://example.com/a.png', 'a', 'f', {
					resolve: async (hostname) =>
						hostname === 'slow.example'
							? new Promise<string[]>(() => {})
							: ['93.184.216.34'],
					transport,
				}),
			).rejects.toThrow('deadline');
		}, 5_000);
	});

	describe('releases responses it does not read', () => {
		function respond(
			status: number,
			headers: Record<string, string>,
			cancel: jest.Mock,
		) {
			return { status, headers, body: body(new Uint8Array([1])), cancel };
		}

		it('on a redirect', async () => {
			const first = jest.fn();
			let call = 0;
			const transport = asTransport(
				jest.fn(async () => {
					call += 1;
					return call === 1
						? respond(302, { location: 'https://cdn.example/b.png' }, first)
						: respond(200, {}, jest.fn());
				}),
			);
			await downloadAsFile('https://example.com/a.png', 'a', 'f', {
				resolve: publicResolve,
				transport,
			});
			expect(first).toHaveBeenCalled();
		});

		it.each([
			['a failed status', 403, {}],
			[
				'a declared length over the cap',
				200,
				{ 'content-length': String(DOWNLOAD_MAX_BYTES + 1) },
			],
			['an unsupported encoding', 200, { 'content-encoding': 'compress' }],
		])('on %s', async (_label, status, headers) => {
			const cancel = jest.fn();
			const transport = asTransport(
				jest.fn(async () => respond(status, headers, cancel)),
			);
			await expect(
				downloadAsFile('https://example.com/a.bin', 'a.bin', 'f', {
					resolve: publicResolve,
					transport,
				}),
			).rejects.toThrow();
			expect(cancel).toHaveBeenCalled();
		});
	});
});
