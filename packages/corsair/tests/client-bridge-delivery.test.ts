import {
	buildClientBridgeBrowserDeliveryUrl,
	prepareClientBridgeDeliveryTransport,
} from '../hub/client-bridge-delivery';

describe('client-bridge-delivery', () => {
	it('builds a connections.sync browser delivery URL', () => {
		const url = buildClientBridgeBrowserDeliveryUrl({
			deliveryMode: 'connections.sync',
			deliveryUrl: 'http://localhost:3000/api/corsair',
			projectId: 'proj_test',
			signingSecret: 'signing-secret',
			hubOrigin: 'https://hub.corsair.dev',
			requestId: 'sync-request-1',
		});

		expect(url).toContain('http://localhost:3000/api/corsair?d=');
	});

	it('builds a connect.create_link browser delivery URL', () => {
		const url = buildClientBridgeBrowserDeliveryUrl({
			deliveryMode: 'connect.create_link',
			deliveryUrl: 'http://localhost:3000/api/corsair',
			projectId: 'proj_test',
			signingSecret: 'signing-secret',
			hubOrigin: 'https://hub.corsair.dev',
			requestId: 'connect-request-1',
			tenantId: 'default',
			plugins: ['slack', 'github'],
		});

		expect(url).toContain('http://localhost:3000/api/corsair?d=');
	});

	it('uses browser transport in development', () => {
		const result = prepareClientBridgeDeliveryTransport({
			deliveryMode: 'connect.create_link',
			deliveryUrl: 'http://localhost:3000/api/corsair',
			projectId: 'proj_test',
			signingSecret: 'signing-secret',
			environmentSlug: 'development',
			hubOrigin: 'https://hub.corsair.dev',
			tenantId: 'default',
			plugins: ['slack'],
		});

		expect(result.transport).toBe('browser');
		if (result.transport !== 'browser') return;
		expect(result.requestId).toBeTruthy();
		expect(result.deliveryUrl).toContain('?d=');
	});

	it('uses server transport in production', () => {
		const result = prepareClientBridgeDeliveryTransport({
			deliveryMode: 'connect.create_link',
			deliveryUrl: 'https://app.example.com/api/corsair',
			projectId: 'proj_test',
			signingSecret: 'signing-secret',
			environmentSlug: 'production',
			tenantId: 'default',
			plugins: ['slack'],
		});

		expect(result.transport).toBe('server');
	});

	it('normalizes hubOrigin to an origin for postMessage', () => {
		const url = buildClientBridgeBrowserDeliveryUrl({
			deliveryMode: 'connect.create_link',
			deliveryUrl: 'http://localhost:3000/api/corsair',
			projectId: 'proj_test',
			signingSecret: 'signing-secret',
			hubOrigin: 'https://hub.corsair.dev/dashboard/project/abc',
			requestId: 'connect-request-2',
			tenantId: 'default',
			plugins: ['slack'],
		});

		const token = new URL(url).searchParams.get('d');
		expect(token).toBeTruthy();
		const payloadBase64 = token!.split('.')[0]!;
		const payload = JSON.parse(
			Buffer.from(payloadBase64, 'base64url').toString('utf-8'),
		) as { hubOrigin?: string };
		expect(payload.hubOrigin).toBe('https://hub.corsair.dev');
	});
});
