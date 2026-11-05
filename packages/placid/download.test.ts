import {
	assertPublicUrl,
	DOWNLOAD_MAX_BYTES,
	downloadAsFile,
	isBlockedAddress,
	UnsafeUrlError,
} from './endpoints/download';

/**
 * Wraps a jest mock as `typeof fetch`.
 *
 * unknown: `jest.fn` returns `Mock<...>`, whose call signature does not match
 * the DOM `fetch` overloads even when the implementation has the right shape.
 * The double cast is the narrowest way to hand the mock to production code that
 * takes `typeof fetch`; the mock is never called outside these tests.
 */
function asFetch(mock: jest.Mock): typeof fetch {
	return mock as unknown as typeof fetch;
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

	it('treats an unparseable address as blocked', () => {
		expect(isBlockedAddress('not-an-ip')).toBe(true);
		expect(isBlockedAddress('999.1.1.1')).toBe(true);
		expect(isBlockedAddress('1:2:3')).toBe(true);
	});
});

describe('assertPublicUrl', () => {
	const resolveTo = (addresses: string[]) => async () => addresses;

	it('accepts a public http(s) URL', async () => {
		await expect(
			assertPublicUrl('https://example.com/a.jpg', {
				resolve: resolveTo(['93.184.216.34']),
			}),
		).resolves.toBeInstanceOf(URL);
	});

	it('rejects a non-http protocol', async () => {
		await expect(
			assertPublicUrl('file:///etc/passwd', {
				resolve: resolveTo(['1.1.1.1']),
			}),
		).rejects.toBeInstanceOf(UnsafeUrlError);
		await expect(
			assertPublicUrl('gopher://example.com', {
				resolve: resolveTo(['1.1.1.1']),
			}),
		).rejects.toBeInstanceOf(UnsafeUrlError);
	});

	it('rejects a host that resolves to loopback', async () => {
		await expect(
			assertPublicUrl('http://localhost:8080/a.jpg', {
				resolve: resolveTo(['127.0.0.1']),
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('rejects when any of several answers is private', async () => {
		// One private answer is enough to reach the internal service.
		await expect(
			assertPublicUrl('https://mixed.example/a.jpg', {
				resolve: resolveTo(['93.184.216.34', '10.0.0.5']),
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('rejects the cloud metadata address outright', async () => {
		await expect(
			assertPublicUrl('http://169.254.169.254/latest/meta-data/', {
				resolve: resolveTo(['169.254.169.254']),
			}),
		).rejects.toThrow(/private or reserved/);
	});

	it('rejects a host that does not resolve', async () => {
		await expect(
			assertPublicUrl('https://nope.invalid/a.jpg', {
				resolve: async () => {
					throw new Error('ENOTFOUND');
				},
			}),
		).rejects.toThrow(/Could not resolve/);
	});

	it('rejects a relative string that is not a URL', async () => {
		await expect(
			assertPublicUrl('/a.jpg', { resolve: resolveTo(['1.1.1.1']) }),
		).rejects.toThrow(/absolute URL/);
	});
});

describe('downloadAsFile', () => {
	const publicResolve = async () => ['93.184.216.34'];

	it('returns a File with the response bytes and type', async () => {
		const fetchImpl = asFetch(
			jest.fn(async () => {
				return new Response(new Uint8Array([1, 2, 3]), {
					status: 200,
					headers: { 'Content-Type': 'image/png' },
				});
			}),
		);

		const file = await downloadAsFile(
			'https://example.com/logo.png',
			undefined,
			'fallback',
			{ resolve: publicResolve, fetchImpl },
		);

		expect(file.name).toBe('logo.png');
		expect(file.type).toBe('image/png');
		expect(file.size).toBe(3);
	});

	it('sends redirect: manual so each hop can be vetted', async () => {
		const fetchImpl = asFetch(
			jest.fn(async () => {
				return new Response(new Uint8Array([1]), {
					status: 200,
					headers: { 'Content-Type': 'image/png' },
				});
			}),
		);

		await downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
			resolve: publicResolve,
			fetchImpl,
		});

		expect(fetchImpl).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ redirect: 'manual' }),
		);
	});

	it('follows a redirect to another public host', async () => {
		let call = 0;
		const fetchImpl = asFetch(
			jest.fn(async () => {
				call += 1;
				if (call === 1) {
					return new Response(null, {
						status: 302,
						headers: { Location: 'https://cdn.example/b.png' },
					});
				}
				return new Response(new Uint8Array([9]), {
					status: 200,
					headers: { 'Content-Type': 'image/png' },
				});
			}),
		);

		const file = await downloadAsFile(
			'https://example.com/a.png',
			undefined,
			'f',
			{ resolve: publicResolve, fetchImpl },
		);

		expect(file.name).toBe('b.png');
		expect(fetchImpl).toHaveBeenCalledTimes(2);
	});

	it('refuses a redirect to a private host instead of following it', async () => {
		const fetchImpl = asFetch(
			jest.fn(async () => {
				return new Response(null, {
					status: 302,
					headers: { Location: 'http://127.0.0.1/admin' },
				});
			}),
		);

		await expect(
			downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
				// The first host is public; the redirect target is not.
				resolve: async (hostname) =>
					hostname === '127.0.0.1' ? ['127.0.0.1'] : ['93.184.216.34'],
				fetchImpl,
			}),
		).rejects.toThrow(/private or reserved/);
		expect(fetchImpl).toHaveBeenCalledTimes(1);
	});

	it('stops after the redirect limit', async () => {
		const fetchImpl = asFetch(
			jest.fn(async () => {
				return new Response(null, {
					status: 302,
					headers: { Location: 'https://example.com/again.png' },
				});
			}),
		);

		await expect(
			downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
				resolve: publicResolve,
				fetchImpl,
			}),
		).rejects.toThrow(/redirected more than/);
	});

	it('rejects a body larger than the cap without buffering it all', async () => {
		// One chunk over the limit is enough to trip the guard.
		const oversized = new Uint8Array(DOWNLOAD_MAX_BYTES + 1);
		const fetchImpl = asFetch(
			jest.fn(async () => {
				return new Response(oversized, {
					status: 200,
					headers: { 'Content-Type': 'application/octet-stream' },
				});
			}),
		);

		await expect(
			downloadAsFile('https://example.com/big.bin', 'big.bin', 'f', {
				resolve: publicResolve,
				fetchImpl,
			}),
		).rejects.toThrow(/larger than/);
	});

	it('reports a failed download with the status', async () => {
		const fetchImpl = asFetch(
			jest.fn(async () => {
				return new Response('nope', { status: 403 });
			}),
		);

		await expect(
			downloadAsFile('https://example.com/a.png', 'a.png', 'f', {
				resolve: publicResolve,
				fetchImpl,
			}),
		).rejects.toThrow(/publicly reachable/);
	});
});
