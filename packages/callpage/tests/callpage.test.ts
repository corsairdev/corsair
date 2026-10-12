import { errorHandlers } from '../error-handlers';
import { callpage } from '../index';

const plugin = callpage({ key: 'test-key', authType: 'api_key' });

describe('CallPage plugin', () => {
	it('uses API key authentication by default', () => {
		expect(plugin.id).toBe('callpage');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers the six database entities', () => {
		expect(Object.keys(plugin.schema?.entities ?? {}).sort()).toEqual([
			'calls',
			'managers',
			'smsMessages',
			'users',
			'voiceMessages',
			'widgets',
		]);
	});

	it('exposes every endpoint group and defines no webhooks', () => {
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'calls',
			'managers',
			'root',
			'sms',
			'users',
			'voiceMessages',
			'widgets',
		]);
		expect(plugin.webhooks).toEqual({});
	});

	it('registers rate-limit error handlers', () => {
		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBe(
			errorHandlers.RATE_LIMIT_ERROR,
		);
	});
});
