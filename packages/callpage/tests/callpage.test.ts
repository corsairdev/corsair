import { errorHandlers } from '../error-handlers';
import { callpage } from '../index';

const plugin = callpage({ key: 'test-key', authType: 'api_key' });

describe('CallPage plugin', () => {
	it('uses API key authentication by default', () => {
		expect(plugin.id).toBe('callpage');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes calls, users, widgets and webhook surfaces', () => {
		expect(plugin.endpoints?.calls.get).toBeDefined();
		expect(plugin.endpoints?.calls.history).toBeDefined();
		expect(plugin.endpoints?.users.list).toBeDefined();
		expect(plugin.endpoints?.widgets.call).toBeDefined();
		expect(plugin.webhooks?.event.received).toBeDefined();
	});

	it('registers rate-limit error handlers', () => {
		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBeDefined();
		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBe(
			errorHandlers.RATE_LIMIT_ERROR,
		);
	});
});
