import {
	isLoopbackUrl,
	resolveDeliveryTransport,
	usesBrowserDelivery,
	validateProductionDeliveryUrl,
} from '../hub/contracts/environment';
import { resolveHubDeliveryUrl } from '../hub/resolve-delivery-url';

describe('hub environment delivery', () => {
	it('resolves transport from environment slug', () => {
		expect(resolveDeliveryTransport('development')).toBe('browser');
		expect(resolveDeliveryTransport('production')).toBe('server');
		expect(usesBrowserDelivery('development')).toBe(true);
		expect(usesBrowserDelivery('production')).toBe(false);
	});

	it('detects loopback URLs', () => {
		expect(isLoopbackUrl('http://localhost:3000/api/corsair')).toBe(true);
		expect(isLoopbackUrl('http://127.0.0.1:3001/api/corsair')).toBe(true);
		expect(isLoopbackUrl('https://app.example.com/api/corsair')).toBe(false);
	});

	it('rejects loopback production delivery URLs', () => {
		expect(
			validateProductionDeliveryUrl('http://localhost:3000/api/corsair'),
		).toMatch(/public URL/);
		expect(
			validateProductionDeliveryUrl('https://app.example.com/api/corsair'),
		).toBeNull();
	});

	it('auto-detects localhost delivery URL from PORT', () => {
		const previousPort = process.env.PORT;
		process.env.PORT = '3001';
		delete process.env.CORSAIR_DELIVERY_URL;
		delete process.env.APP_URL;

		expect(resolveHubDeliveryUrl()).toBe(
			'http://localhost:3001/api/corsair',
		);

		if (previousPort === undefined) {
			delete process.env.PORT;
		} else {
			process.env.PORT = previousPort;
		}
	});
});
