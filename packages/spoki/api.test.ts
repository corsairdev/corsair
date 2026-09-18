import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { SPOKI_BASE_URL } from './client';
import {
	getAccount,
	getAccountByPhone,
	listAccounts,
	sendMessage,
	triggerAutomation,
} from './endpoints';
import { spoki, spokiAuthConfig, spokiEndpointMeta } from './index';

const accountResponse = {
	id: 13128334,
	name: 'MyShop',
	current_credit: 8556300,
	status: 'Active',
	default_language: 'it',
	phone: '3933312345678',
	has_official_verification: false,
	daily_limit: 100000,
	phone_status: 'Connected',
	quality_score: 1,
	quality_reasons: null,
	is_active: true,
	country_code: '',
	estimated_available_conversations: 85563,
	account_type: 2,
	default_pricing_delta: 0,
	low_credit_threshold: 15000,
	has_low_credit_alert: false,
	default_prefix: '+39',
	default_country_code: 'IT',
	timezone: 'Europe/Rome',
	contacted_in_24h: 150,
	contacted_in_7d: 602,
};

const ctx = { key: 'test-api-key' } as any;

function mockFetchWith(status: number, body: unknown) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	const contentType =
		typeof body === 'string' ? 'text/plain' : 'application/json';
	return jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(payload, {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

describe('Spoki plugin', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('initializes plugin with id = spoki', () => {
		const instance = spoki({ key: 'test-api-key' });
		expect(instance.id).toBe('spoki');
	});

	it('defaults authType to api_key', () => {
		const instance = spoki();
		expect((instance.options as any)?.authType).toBe('api_key');
	});

	it('authConfig only exposes api_key', () => {
		expect(spokiAuthConfig).toHaveProperty('api_key');
		expect(spokiAuthConfig).not.toHaveProperty('oauth_2');
	});

	it('assigns risk levels to all endpoints', () => {
		expect(spokiEndpointMeta['accounts.listAccounts'].riskLevel).toBe('read');
		expect(spokiEndpointMeta['accounts.getAccount'].riskLevel).toBe('read');
		expect(spokiEndpointMeta['accounts.getAccountByPhone'].riskLevel).toBe(
			'read',
		);
		expect(spokiEndpointMeta['messaging.sendMessage'].riskLevel).toBe('write');
		expect(spokiEndpointMeta['automation.triggerAutomation'].riskLevel).toBe(
			'write',
		);
	});

	it('sends the API key on endpoint calls', async () => {
		const mockFetch = mockFetchWith(200, [accountResponse]);

		await listAccounts(ctx, {});

		const headers = new Headers(mockFetch.mock.calls[0]![1]?.headers);
		expect(headers.get('X-Spoki-Api-Key')).toBe('test-api-key');
	});

	it('listAccounts calls GET /api/1/accounts/ and returns the bare array', async () => {
		const mockFetch = mockFetchWith(200, [accountResponse]);

		const result = await listAccounts(ctx, {});

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe(`${SPOKI_BASE_URL}/accounts/`);
		expect(options?.method).toBe('GET');
		expect(result).toEqual([accountResponse]);
	});

	it('getAccount calls GET /api/1/accounts/{id}/', async () => {
		const mockFetch = mockFetchWith(200, accountResponse);

		const result = await getAccount(ctx, { accountId: 13128334 });

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe(`${SPOKI_BASE_URL}/accounts/13128334/`);
		expect(options?.method).toBe('GET');
		expect(result).toEqual(accountResponse);
	});

	it('getAccountByPhone URL-encodes the phone number', async () => {
		const mockFetch = mockFetchWith(200, accountResponse);

		await getAccountByPhone(ctx, { phone: '+39 333 12345678' });

		const [url] = mockFetch.mock.calls[0]!;
		expect(url).toBe(
			`${SPOKI_BASE_URL}/accounts/phone/${encodeURIComponent('+39 333 12345678')}/`,
		);
	});

	it('sendMessage posts the documented body to /api/1/messages/send/', async () => {
		const mockFetch = mockFetchWith(200, { uuid: 'msg-1' });

		const result = await sendMessage(ctx, {
			phone: '+3933312345678',
			text: 'Hi how can I help you?',
			metadata: { order_id: '1234' },
		});

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe(`${SPOKI_BASE_URL}/messages/send/`);
		expect(options?.method).toBe('POST');
		expect(JSON.parse(options?.body as string)).toEqual({
			type: 'Message',
			content_type: 'Text',
			phone: '+3933312345678',
			text: 'Hi how can I help you?',
			metadata: { order_id: '1234' },
		});
		expect(result).toEqual({ uuid: 'msg-1' });
	});

	it('triggerAutomation posts to the absolute automation URL outside /api/1', async () => {
		const mockFetch = mockFetchWith(200, { ok: true });

		const result = await triggerAutomation(ctx, {
			uuid: 'auto-uuid',
			secret: 'whsec-secret',
			phone: '+3933312345678',
			first_name: 'John',
		});

		const [url, options] = mockFetch.mock.calls[0]!;
		expect(url).toBe('https://api.spoki.com/wh/ap/auto-uuid/');
		expect(options?.method).toBe('POST');
		const headers = new Headers(options?.headers);
		expect(headers.get('X-Spoki-Api-Key')).toBeNull();
		expect(JSON.parse(options?.body as string)).toEqual({
			secret: 'whsec-secret',
			phone: '+3933312345678',
			first_name: 'John',
		});
		expect(result).toEqual({ ok: true });
	});

	it('getAccount validates the documented response including channels', async () => {
		mockFetchWith(200, {
			...accountResponse,
			channels: [
				{
					name: 'Main WhatsApp',
					identifier: '3933312345678',
					platform: 'WhatsApp',
					status: 'Active',
					phone_status: '🟢 Connected',
					quality_score: '🟢 Green',
					is_primary: true,
				},
			],
		});

		const result = await getAccount(ctx, { accountId: 13128334 });

		expect(result.channels?.[0]?.platform).toBe('WhatsApp');
	});

	it('rejects malformed account responses', async () => {
		mockFetchWith(200, { id: 1 });
		await expect(getAccount(ctx, { accountId: 1 })).rejects.toThrow();

		mockFetchWith(200, { id: 1 });
		await expect(
			getAccountByPhone(ctx, { phone: '+3933312345678' }),
		).rejects.toThrow();
	});

	it('rejects malformed listAccounts responses', async () => {
		mockFetchWith(200, { accounts: [] });

		await expect(listAccounts(ctx, {})).rejects.toThrow();
	});

	it('rejects a non-object sendMessage response', async () => {
		mockFetchWith(200, 'nope');

		await expect(
			sendMessage(ctx, { phone: '+3933312345678', text: 'Hi' }),
		).rejects.toThrow();
	});

	it('rejects a non-object triggerAutomation response', async () => {
		mockFetchWith(200, ['unexpected']);

		await expect(
			triggerAutomation(ctx, {
				uuid: 'auto-uuid',
				secret: 'whsec-secret',
				phone: '+3933312345678',
			}),
		).rejects.toThrow();
	});

	it('maps the documented empty 200 body from Start Automation to an empty object', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		const result = await triggerAutomation(ctx, {
			uuid: 'auto-uuid',
			secret: 'whsec-secret',
			phone: '+3933312345678',
		});

		expect(result).toEqual({});
	});

	it('rejects invalid input before making an HTTP call', async () => {
		const mockFetch = mockFetchWith(200, {});

		await expect(
			getAccount(ctx, { accountId: 'not-a-number' } as any),
		).rejects.toThrow();
		await expect(
			sendMessage(ctx, { phone: '+3933312345678' } as any),
		).rejects.toThrow();
		await expect(
			triggerAutomation(ctx, { uuid: 'u', phone: '+393' } as any),
		).rejects.toThrow();

		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('surfaces SpokiApiError with status for failed calls', async () => {
		mockFetchWith(401, { error: 'Unauthorized' });

		await expect(listAccounts(ctx, {})).rejects.toMatchObject({
			name: 'SpokiApiError',
			status: 401,
		});
	});
});
