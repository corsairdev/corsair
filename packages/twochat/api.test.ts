import {
	TwoChatEndpointInputSchemas,
	TwoChatEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { twochat, twochatAuthConfig } from './index';

describe('TwoChat plugin', () => {
	// ─── Initialisation ────────────────────────────────────────────────────────

	it('initializes plugin with id = twochat', () => {
		const instance = twochat({ key: 'test-api-key' });
		expect(instance.id).toBe('twochat');
	});

	it('stores the provided key in options', () => {
		const instance = twochat({ key: 'test-api-key' });
		expect(instance.options?.key).toBe('test-api-key');
	});

	it('defaults authType to api_key', () => {
		const instance = twochat();
		expect((instance.options as any)?.authType).toBe('api_key');
	});

	it('authConfig only exposes api_key — no oauth_2', () => {
		expect(twochatAuthConfig).toHaveProperty('api_key');
		expect(twochatAuthConfig).not.toHaveProperty('oauth_2');
	});

	it('webhooks object is empty (no incoming webhooks per spec)', () => {
		const instance = twochat();
		expect(instance.webhooks).toEqual({});
	});

	// ─── Endpoint registration ─────────────────────────────────────────────────

	it('registers contacts.createContact endpoint', () => {
		const instance = twochat();
		expect(instance.endpoints!.contacts.createContact).toBeDefined();
	});

	it('registers contacts.listContacts endpoint', () => {
		const instance = twochat();
		expect(instance.endpoints!.contacts.listContacts).toBeDefined();
	});

	it('registers account.getApiUsageInfo endpoint', () => {
		const instance = twochat();
		expect(instance.endpoints!.account.getApiUsageInfo).toBeDefined();
	});

	it('registers account.testApiKey endpoint', () => {
		const instance = twochat();
		expect(instance.endpoints!.account.testApiKey).toBeDefined();
	});

	it('registers webhookSubscriptions.listWebhooks endpoint', () => {
		const instance = twochat();
		expect(instance.endpoints!.webhookSubscriptions.listWebhooks).toBeDefined();
	});

	// ─── Endpoint meta ─────────────────────────────────────────────────────────

	it('createContact is write risk', () => {
		const meta = (twochat() as any).endpointMeta;
		expect(meta['contacts.createContact'].riskLevel).toBe('write');
	});

	it('all read endpoints have read risk', () => {
		const meta = (twochat() as any).endpointMeta;
		expect(meta['contacts.listContacts'].riskLevel).toBe('read');
		expect(meta['account.getApiUsageInfo'].riskLevel).toBe('read');
		expect(meta['account.testApiKey'].riskLevel).toBe('read');
		expect(meta['webhookSubscriptions.listWebhooks'].riskLevel).toBe('read');
	});

	// ─── Schema validation — valid data ────────────────────────────────────────

	it('parses a valid createContact response', () => {
		const result = TwoChatEndpointOutputSchemas.createContact.parse({
			success: true,
			contact: {
				uuid: 'CON123',
				first_name: 'John',
				contact_details: [{ type: 'E', value: 'john@example.com' }],
			},
		});
		expect(result.contact.first_name).toBe('John');
	});

	it('parses a valid getApiUsageInfo response', () => {
		const result = TwoChatEndpointOutputSchemas.getApiUsageInfo.parse({
			success: true,
			account: { uuid: 'ACC123', on_trial: false, blocked: false },
			limits: { requests_per_minute: 80 },
			usage: {
				api_request_count: 100,
				max_api_request_count: 500000,
				number_check_count: 50,
				max_number_check_count: 500000,
			},
		});
		expect(result.usage?.api_request_count).toBe(100);
	});

	it('parses a valid listContacts response', () => {
		const result = TwoChatEndpointOutputSchemas.listContacts.parse({
			results: [{ uuid: 'CON123', first_name: 'Jane' }],
			page_number: 0,
			results_per_page: 30,
		});
		expect(result.results.length).toBe(1);
	});

	it('parses a valid listWebhooks response', () => {
		const result = TwoChatEndpointOutputSchemas.listWebhooks.parse({
			webhooks: [
				{
					uuid: 'WHKabc123',
					event_name: 'whatsapp.message.received',
					hook_url: 'https://example.com/webhook',
				},
			],
		});
		expect(result.webhooks[0]?.uuid).toBe('WHKabc123');
	});

	// ─── Schema validation — rejection on invalid data ─────────────────────────

	it('rejects createContact input missing first_name', () => {
		expect(() =>
			TwoChatEndpointInputSchemas.createContact.parse({
				contact_details: [{ type: 'E', value: 'x@x.com' }],
			}),
		).toThrow();
	});

	it('rejects createContact input with empty contact_details', () => {
		expect(() =>
			TwoChatEndpointInputSchemas.createContact.parse({
				first_name: 'John',
				contact_details: [],
			}),
		).toThrow();
	});

	it('accepts listContacts input with no params (uses defaults)', () => {
		expect(() =>
			TwoChatEndpointInputSchemas.listContacts.parse({}),
		).not.toThrow();
	});

	it('rejects listContacts results_per_page > 100', () => {
		expect(() =>
			TwoChatEndpointInputSchemas.listContacts.parse({ results_per_page: 200 }),
		).toThrow();
	});

	// ─── Webhook plugin matcher ─────────────────────────────────────────────────

	it('pluginWebhookMatcher always returns false (no incoming webhooks)', () => {
		const instance = twochat();
		const matcher = instance.pluginWebhookMatcher!;
		expect(matcher({ headers: { 'x-2chat-signature': 'sig' }, body: {} })).toBe(
			false,
		);
		expect(matcher({ headers: {}, body: {} })).toBe(false);
	});

	// ─── Error handlers ────────────────────────────────────────────────────────

	const mockCtx = {
		pluginId: 'twochat',
		operation: 'test',
		input: {},
		originalError: new Error(''),
	};

	it('RATE_LIMIT_ERROR matches rate_limited message', () => {
		const err = new Error('rate_limited: too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err, mockCtx)).toBe(true);
	});

	it('AUTH_ERROR matches unauthorized message', () => {
		const err = new Error('unauthorized: invalid_auth');
		expect(errorHandlers.AUTH_ERROR.match(err, mockCtx)).toBe(true);
	});

	it('PERMISSION_ERROR matches forbidden message', () => {
		const err = new Error('forbidden: permission_denied');
		expect(errorHandlers.PERMISSION_ERROR.match(err, mockCtx)).toBe(true);
	});

	it('NETWORK_ERROR matches fetch failed', () => {
		const err = new Error('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(err, mockCtx)).toBe(true);
	});

	it('DEFAULT matches any error', () => {
		const err = new Error('some unknown error');
		expect(errorHandlers.DEFAULT.match(err, mockCtx)).toBe(true);
	});
});
