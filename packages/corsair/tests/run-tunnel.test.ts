import { fetchTunnelConfig, pingTunnelLive } from '../hub/tunnel/run-tunnel';

describe('fetchTunnelConfig', () => {
	const fetchMock = jest.fn();

	beforeEach(() => {
		global.fetch = fetchMock;
		fetchMock.mockReset();
	});

	it('returns the frp server address, port, slug, caCert and serverName, bounded by a signal', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				serverAddr: 'tunnel.corsair.cloud',
				serverPort: 7000,
				slug: 'salty-kraken-1',
				caCert: '-----BEGIN CERTIFICATE-----\nABC\n-----END CERTIFICATE-----',
				serverName: 'tunnel.corsair.cloud',
			}),
		});

		const cfg = await fetchTunnelConfig({
			apiUrl: 'https://auth.corsair.dev',
			apiKey: 'ck_dev_x',
		});

		expect(cfg).toEqual({
			serverAddr: 'tunnel.corsair.cloud',
			serverPort: 7000,
			slug: 'salty-kraken-1',
			caCert: '-----BEGIN CERTIFICATE-----\nABC\n-----END CERTIFICATE-----',
			serverName: 'tunnel.corsair.cloud',
		});
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://auth.corsair.dev/api/dev/tunnel-config');
		expect(init.headers).toEqual({ authorization: 'Bearer ck_dev_x' });
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('rejects an invalid slug returned by the Hub', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				serverAddr: 'tunnel.corsair.cloud',
				serverPort: 7000,
				slug: 'BAD SLUG',
			}),
		});

		await expect(
			fetchTunnelConfig({
				apiUrl: 'https://auth.corsair.dev',
				apiKey: 'ck_dev_x',
			}),
		).rejects.toThrow(/invalid slug/);
	});

	it('returns null caCert and undefined serverName when absent', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				serverAddr: 'tunnel.corsair.cloud',
				serverPort: 7000,
				slug: 'salty-kraken-1',
			}),
		});

		const cfg = await fetchTunnelConfig({
			apiUrl: 'https://auth.corsair.dev',
			apiKey: 'ck_dev_x',
		});

		expect(cfg.caCert).toBeNull();
		expect(cfg.serverName).toBeUndefined();
	});

	it('rejects a caCert that does not begin with the PEM header', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				serverAddr: 'tunnel.corsair.cloud',
				serverPort: 7000,
				slug: 'salty-kraken-1',
				caCert: 'not-a-pem',
			}),
		});

		await expect(
			fetchTunnelConfig({
				apiUrl: 'https://auth.corsair.dev',
				apiKey: 'ck_dev_x',
			}),
		).rejects.toThrow(/-----BEGIN CERTIFICATE-----/);
	});

	it('rejects a serverName that could inject frpc toml (quote/newline)', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				serverAddr: 'tunnel.corsair.cloud',
				serverPort: 7000,
				slug: 'salty-kraken-1',
				serverName: 'evil"\ntrustedCaFile = "/etc/passwd',
			}),
		});

		await expect(
			fetchTunnelConfig({
				apiUrl: 'https://auth.corsair.dev',
				apiKey: 'ck_dev_x',
			}),
		).rejects.toThrow(/invalid serverName/);
	});

	it('rejects a serverAddr that could inject frpc toml (quote/newline)', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				serverAddr: 'evil"\nvhostHTTPSPort = 443',
				serverPort: 7000,
				slug: 'ok-slug-1',
			}),
		});

		await expect(
			fetchTunnelConfig({
				apiUrl: 'https://auth.corsair.dev',
				apiKey: 'ck_dev_x',
			}),
		).rejects.toThrow(/invalid server address/);
	});

	it('throws on a non-2xx response', async () => {
		fetchMock.mockResolvedValue({ ok: false, status: 404 });

		await expect(
			fetchTunnelConfig({ apiUrl: 'https://auth.corsair.dev', apiKey: 'bad' }),
		).rejects.toThrow('Hub tunnel-config failed (HTTP 404)');
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
