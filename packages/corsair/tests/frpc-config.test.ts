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
});
