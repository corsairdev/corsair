import { ReconnectRequiredError } from '../core/auth/errors/reconnect-required';
import { parseHubReconnectBody } from '../hub/contracts/connect-api';

describe('parseHubReconnectBody', () => {
	it('extracts the scoped link + identity from a reconnect_required body', () => {
		expect(
			parseHubReconnectBody({
				error: 'refresh token rejected',
				errorType: 'reconnect_required',
				connectUrl: 'https://hub/connect/tok',
				plugin: 'notion',
				tenantId: 't1',
			}),
		).toEqual({
			message: 'refresh token rejected',
			connectUrl: 'https://hub/connect/tok',
			plugin: 'notion',
			tenantId: 't1',
			reason: null,
		});
	});

	it('keeps a null connectUrl and carries the reason when Hub cannot mint', () => {
		expect(
			parseHubReconnectBody({
				error: 'reconnect required: no OAuth app credentials',
				errorType: 'reconnect_required',
				connectUrl: null,
				plugin: 'notion',
				tenantId: 't1',
				reason: 'no_credentials',
			}),
		).toMatchObject({ connectUrl: null, reason: 'no_credentials' });
	});

	it('returns null for a non-reconnect error body', () => {
		expect(parseHubReconnectBody({ error: 'Token refresh failed' })).toBeNull();
		expect(parseHubReconnectBody(null)).toBeNull();
	});
});

describe('ReconnectRequiredError', () => {
	it('carries the connect link and identity, defaults a message', () => {
		const e = new ReconnectRequiredError({
			connectUrl: 'https://hub/connect/tok',
			plugin: 'notion',
			tenantId: 't1',
		});
		expect(e).toBeInstanceOf(Error);
		expect(e.name).toBe('ReconnectRequiredError');
		expect(e.connectUrl).toBe('https://hub/connect/tok');
		expect(e.plugin).toBe('notion');
		expect(e.message).toBe('Reconnect required');
	});
});
