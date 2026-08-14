import { extractTunnelUrl, pingTunnelLive } from '../hub/tunnel/run-tunnel';

describe('extractTunnelUrl', () => {
	it('extracts the bare-host share endpoint from zrok JSON output', () => {
		const output =
			'{"level":"INFO","source":{"file":"github.com/openziti/zrok/v2/cmd/zrok2/sharePublic.go"},"msg":"access your zrok share at the following endpoints:\\n xs2opjru3i9f.shares.zrok.io"}';
		expect(extractTunnelUrl(output, { host: 'shares.zrok.io' })).toBe(
			'https://xs2opjru3i9f.shares.zrok.io',
		);
	});

	it('matches only the shares host, not the api endpoint', () => {
		const output = [
			'{"msg":"connecting to api-v2.zrok.io"}',
			'{"msg":"share at\\n xvf5vfwhkop0.shares.zrok.io"}',
		].join('\n');
		expect(extractTunnelUrl(output, { host: 'shares.zrok.io' })).toBe(
			'https://xvf5vfwhkop0.shares.zrok.io',
		);
	});

	it('matches a custom self-host domain with an https prefix', () => {
		const output = 'tunnel ready at https://open-duck-87.corsair.cloud ok';
		expect(extractTunnelUrl(output, { host: 'corsair.cloud' })).toBe(
			'https://open-duck-87.corsair.cloud',
		);
	});

	it('normalizes a matched host to https', () => {
		expect(
			extractTunnelUrl('http://xvf5vfwhkop0.shares.zrok.io', {
				host: 'shares.zrok.io',
			}),
		).toBe('https://xvf5vfwhkop0.shares.zrok.io');
	});

	it('falls back to the standalone https line when the host does not match', () => {
		const output = [
			'connecting to https://api.zrok.io',
			'https://xvf5vfwhkop0.shares.zrok.io',
		].join('\n');
		expect(extractTunnelUrl(output, { host: 'nomatch.example.com' })).toBe(
			'https://xvf5vfwhkop0.shares.zrok.io',
		);
	});

	it('returns null when nothing matches the host and no standalone line exists', () => {
		expect(
			extractTunnelUrl('starting zrok...', { host: 'shares.zrok.io' }),
		).toBeNull();
		expect(extractTunnelUrl('')).toBeNull();
	});

	it('falls back to the last standalone https line without a host', () => {
		const output = [
			'connecting to https://api.zrok.io',
			'https://xvf5vfwhkop0.shares.zrok.io',
			'share complete',
		].join('\n');
		expect(extractTunnelUrl(output)).toBe(
			'https://xvf5vfwhkop0.shares.zrok.io',
		);
	});

	it('returns null with no host when no line is a standalone https URL', () => {
		expect(extractTunnelUrl('url: https://foo.zrok.io here')).toBeNull();
		expect(extractTunnelUrl('')).toBeNull();
	});
});

describe('pingTunnelLive', () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		global.fetch = fetchMock;
		fetchMock.mockReset();
	});

	it('POSTs to /api/dev/register with Bearer auth, no URL body, bounded by a signal', async () => {
		fetchMock.mockResolvedValue({ ok: true, status: 200 });

		await pingTunnelLive({
			apiUrl: 'https://auth.corsair.dev',
			apiKey: 'ck_dev_test',
		});

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://auth.corsair.dev/api/dev/register');
		expect(init.method).toBe('POST');
		expect(init.headers).toEqual({ authorization: 'Bearer ck_dev_test' });
		// A hung Hub must not wedge startup — the request is abort-bounded.
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('throws on a non-2xx response', async () => {
		fetchMock.mockResolvedValue({ ok: false, status: 401 });

		await expect(
			pingTunnelLive({ apiUrl: 'https://auth.corsair.dev', apiKey: 'bad' }),
		).rejects.toThrow('Hub tunnel-live ping failed (HTTP 401)');
	});
});
