import type { CorsairErrorHandler } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { companyenrich } from './index';

describe('CompanyEnrich plugin setup', () => {
	it('throws AuthMissingError from keyBuilder when the stored API key is missing', async () => {
		const getApiKey = jest.fn().mockResolvedValue(null);
		const plugin = companyenrich();
		if (!plugin.keyBuilder) throw new Error('keyBuilder is not registered');

		// The key builder only reads authType and keys in this focused unit test.
		const context = {
			authType: 'api_key',
			keys: { get_api_key: getApiKey },
		};
		const missingKey = plugin.keyBuilder(context as never, 'endpoint');
		await expect(missingKey).rejects.toBeInstanceOf(AuthMissingError);
		await expect(missingKey).rejects.toMatchObject({
			name: 'AuthMissingError',
			pluginId: 'companyenrich',
			authType: 'api_key',
		});
		expect(getApiKey).toHaveBeenCalledTimes(1);
	});

	it('preserves explicit and stored API keys', async () => {
		const explicitPlugin = companyenrich({ key: 'configured-key' });
		if (!explicitPlugin.keyBuilder)
			throw new Error('keyBuilder is not registered');
		await expect(
			explicitPlugin.keyBuilder({} as never, 'endpoint'),
		).resolves.toBe('configured-key');

		const storedPlugin = companyenrich();
		if (!storedPlugin.keyBuilder)
			throw new Error('keyBuilder is not registered');
		const context = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue('stored-key') },
		};
		await expect(
			storedPlugin.keyBuilder(context as never, 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('routes caller handlers before built-ins and keeps the selected fallback last', () => {
		const callerHandler: NonNullable<CorsairErrorHandler['NETWORK_ERROR']> = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const callerAuthHandler: NonNullable<CorsairErrorHandler['AUTH_ERROR']> = {
			match: () => true,
			handler: async () => ({ maxRetries: 8 }),
		};
		const callerDefault: NonNullable<CorsairErrorHandler['DEFAULT']> = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const plugin = companyenrich({
			errorHandlers: {
				NETWORK_ERROR: callerHandler,
				AUTH_ERROR: callerAuthHandler,
				DEFAULT: callerDefault,
			},
		});
		const handlers = plugin.errorHandlers ?? {};
		const handlerNames = Object.keys(handlers);

		expect(handlers.NETWORK_ERROR).toBe(callerHandler);
		expect(handlers.AUTH_ERROR).toBe(callerAuthHandler);
		expect(handlers.DEFAULT).toBe(callerDefault);
		expect(handlerNames.indexOf('NETWORK_ERROR')).toBeLessThan(
			handlerNames.indexOf('INSUFFICIENT_CREDITS_ERROR'),
		);
		expect(handlerNames.at(-1)).toBe('DEFAULT');
	});
});
