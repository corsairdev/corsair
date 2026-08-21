import { buildFrpcConfig } from '../hub/tunnel/frpc-config';

describe('buildFrpcConfig', () => {
	const toml = buildFrpcConfig({
		serverAddr: 'tunnel.corsair.cloud',
		serverPort: 7000,
		apiKey: 'ck_dev_abc',
		slug: 'salty-kraken-42',
		localPort: 41234,
	});

	it('carries the server address, port, key, slug, and local port', () => {
		expect(toml).toContain('serverAddr = "tunnel.corsair.cloud"');
		expect(toml).toContain('serverPort = 7000');
		expect(toml).toContain('metadatas.token = "ck_dev_abc"');
		expect(toml).toContain('subdomain = "salty-kraken-42"');
		expect(toml).toContain('localPort = 41234');
	});

	it('exits on login failure and never bakes in a path (Hub injects locations)', () => {
		expect(toml).toContain('loginFailExit = true');
		expect(toml).not.toContain('locations');
	});

	it('emits no TLS lines when caCertPath is absent', () => {
		expect(toml).not.toContain('transport.tls');
	});

	it('omits metadatas.path when no deliveryPath is given', () => {
		expect(toml).not.toContain('metadatas.path');
	});

	describe('deliveryPath', () => {
		it('declares a custom deliveryPath via metadatas.path', () => {
			const t = buildFrpcConfig({
				serverAddr: 'tunnel.corsair.cloud',
				serverPort: 7000,
				apiKey: 'ck_dev_abc',
				slug: 'salty-kraken-42',
				localPort: 41234,
				deliveryPath: '/external/api/corsair',
			});
			expect(t).toContain('metadatas.path = "/external/api/corsair"');
		});

		it('throws on a deliveryPath that is not a safe absolute path', () => {
			for (const bad of ['api/corsair', '/api/"x"', '/api/\nx', 'https://x']) {
				expect(() =>
					buildFrpcConfig({
						serverAddr: 'tunnel.corsair.cloud',
						serverPort: 7000,
						apiKey: 'ck_dev_abc',
						slug: 'salty-kraken-42',
						localPort: 41234,
						deliveryPath: bad,
					}),
				).toThrow(/deliveryPath/);
			}
		});
	});

	describe('TLS verification', () => {
		const tlsToml = buildFrpcConfig({
			serverAddr: 'tunnel.corsair.cloud',
			serverPort: 7000,
			apiKey: 'ck_dev_abc',
			slug: 'salty-kraken-42',
			localPort: 41234,
			caCertPath: '/tmp/corsair-frpc-abc/ca.crt',
			serverName: 'tunnel.corsair.cloud',
		});

		it('enables TLS with trustedCaFile and serverName when caCertPath is set', () => {
			expect(tlsToml).toContain('transport.tls.enable = true');
			expect(tlsToml).toContain(
				'transport.tls.trustedCaFile = "/tmp/corsair-frpc-abc/ca.crt"',
			);
			expect(tlsToml).toContain(
				'transport.tls.serverName = "tunnel.corsair.cloud"',
			);
		});

		it('falls back to serverAddr for serverName when serverName is omitted', () => {
			const t = buildFrpcConfig({
				serverAddr: '127.0.0.1',
				serverPort: 7000,
				apiKey: 'ck_dev_abc',
				slug: 'slug-1',
				localPort: 41234,
				caCertPath: '/tmp/ca.crt',
			});
			expect(t).toContain('transport.tls.serverName = "127.0.0.1"');
		});
	});
});
