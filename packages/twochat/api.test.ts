import * as client from './client';
import { createContact } from './endpoints/create-contact';
import { getApiUsageInfo } from './endpoints/get-api-usage-info';
import { listContacts } from './endpoints/list-contacts';
import { listWebhooks } from './endpoints/list-webhooks';
import { testApiKey } from './endpoints/test-api-key';
import {
	TwoChatEndpointInputSchemas,
	TwoChatEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { twochat, twochatAuthConfig } from './index';

// Mock client.makeTwoChatRequest to verify endpoint behavioral dispatch
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeTwoChatRequest: jest.fn(),
	};
});

// Mock logEventFromContext
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

describe('TwoChat plugin', () => {
	const mockContext: any = {
		key: 'test-api-key-123',
		pluginId: 'twochat',
		operation: 'test',
		input: {},
		originalError: new Error(''),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	// ─── Initialisation & Structure ────────────────────────────────────────────

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

	// ─── Endpoint Registration & Risk Metadata ─────────────────────────────────

	it('registers all 5 endpoints on the plugin instance', () => {
		const instance = twochat();
		expect(instance.endpoints!.contacts.createContact).toBeDefined();
		expect(instance.endpoints!.contacts.listContacts).toBeDefined();
		expect(instance.endpoints!.account.getApiUsageInfo).toBeDefined();
		expect(instance.endpoints!.account.testApiKey).toBeDefined();
		expect(instance.endpoints!.webhookSubscriptions.listWebhooks).toBeDefined();
	});

	it('assigns correct risk levels to all endpoints', () => {
		const meta = (twochat() as any).endpointMeta;
		expect(meta['contacts.createContact'].riskLevel).toBe('write');
		expect(meta['contacts.listContacts'].riskLevel).toBe('read');
		expect(meta['account.getApiUsageInfo'].riskLevel).toBe('read');
		expect(meta['account.testApiKey'].riskLevel).toBe('read');
		expect(meta['webhookSubscriptions.listWebhooks'].riskLevel).toBe('read');
	});

	// ─── Endpoint Execution & Behavioral Tests ─────────────────────────────────

	it('createContact calls POST /open/contacts with correct payload', async () => {
		const mockResponse = {
			success: true,
			contact: {
				uuid: 'CON_123',
				first_name: 'Alice',
				details: [{ type: 'PH' as const, value: '+1234567890' }],
			},
		};
		(client.makeTwoChatRequest as jest.Mock).mockResolvedValueOnce(
			mockResponse,
		);

		const input = {
			first_name: 'Alice',
			last_name: 'Smith',
			contact_details: [{ type: 'PH' as const, value: '+1234567890' }],
		};

		const result = await createContact(mockContext, input);

		expect(client.makeTwoChatRequest).toHaveBeenCalledWith(
			'open/contacts',
			'test-api-key-123',
			{
				method: 'POST',
				body: {
					first_name: 'Alice',
					last_name: 'Smith',
					profile_pic_url: undefined,
					channel_uuid: undefined,
					contact_detail: [{ type: 'PH', value: '+1234567890' }],
				},
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('listContacts calls GET /open/contacts with pagination parameters', async () => {
		const mockResponse = {
			success: true,
			page: 1,
			count: 1,
			contacts: [{ uuid: 'CON_1', first_name: 'Bob' }],
		};
		(client.makeTwoChatRequest as jest.Mock).mockResolvedValueOnce(
			mockResponse,
		);

		const result = await listContacts(mockContext, {
			page_number: 1,
			results_per_page: 20,
		});

		expect(client.makeTwoChatRequest).toHaveBeenCalledWith(
			'open/contacts',
			'test-api-key-123',
			{
				method: 'GET',
				query: {
					page_number: 1,
					results_per_page: 20,
				},
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('getApiUsageInfo calls GET /open/info', async () => {
		const mockResponse = {
			success: true,
			account: { uuid: 'ACC_1', name: 'Pro Plan' },
			limits: { requests_per_minute: 100 },
			usage: {
				api_requests_available: 1950,
				api_requests_plan_default: 2000,
				number_check_requests_available: 100,
				number_check_requests_plan_default: 100,
			},
		};
		(client.makeTwoChatRequest as jest.Mock).mockResolvedValueOnce(
			mockResponse,
		);

		const result = await getApiUsageInfo(mockContext, {});

		expect(client.makeTwoChatRequest).toHaveBeenCalledWith(
			'open/info',
			'test-api-key-123',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	it('testApiKey calls GET /open/info to validate credentials', async () => {
		const mockResponse = {
			success: true,
			account: { uuid: 'ACC_1', on_trial: false, blocked: false },
		};
		(client.makeTwoChatRequest as jest.Mock).mockResolvedValueOnce(
			mockResponse,
		);

		const result = await testApiKey(mockContext, {});

		expect(client.makeTwoChatRequest).toHaveBeenCalledWith(
			'open/info',
			'test-api-key-123',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	it('listWebhooks calls GET /open/webhooks', async () => {
		const mockResponse = {
			success: true,
			webhooks: [
				{
					uuid: 'WHK_1',
					event_name: 'whatsapp.message.received',
					hook_url: 'https://example.com/webhook',
				},
			],
		};
		(client.makeTwoChatRequest as jest.Mock).mockResolvedValueOnce(
			mockResponse,
		);

		const result = await listWebhooks(mockContext, {});

		expect(client.makeTwoChatRequest).toHaveBeenCalledWith(
			'open/webhooks',
			'test-api-key-123',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	// ─── Zod Schema Validation ─────────────────────────────────────────────────

	it('parses valid output payloads', () => {
		const contactRes = TwoChatEndpointOutputSchemas.createContact.parse({
			success: true,
			contact: { uuid: 'CON_1', first_name: 'John' },
		});
		expect(contactRes.contact.first_name).toBe('John');

		const usageRes = TwoChatEndpointOutputSchemas.getApiUsageInfo.parse({
			success: true,
			usage: {
				api_requests_available: 1999,
				api_requests_plan_default: 2000,
			},
		});
		expect(usageRes.usage?.api_requests_available).toBe(1999);
	});

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

	it('accepts listContacts input with no params and uses defaults', () => {
		expect(() =>
			TwoChatEndpointInputSchemas.listContacts.parse({}),
		).not.toThrow();
	});

	it('rejects listContacts results_per_page exceeding max of 100', () => {
		expect(() =>
			TwoChatEndpointInputSchemas.listContacts.parse({ results_per_page: 200 }),
		).toThrow();
	});

	// ─── Error Handlers ────────────────────────────────────────────────────────

	it('RATE_LIMIT_ERROR matches 429 and rate_limited messages', async () => {
		const err = new Error('rate_limited: too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err, mockContext)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err, mockContext);
		expect(res.maxRetries).toBe(5);
	});

	it('AUTH_ERROR matches 401 and unauthorized messages', async () => {
		const err = new Error('unauthorized: invalid_key');
		expect(errorHandlers.AUTH_ERROR.match(err, mockContext)).toBe(true);
		const res = await errorHandlers.AUTH_ERROR.handler(err, mockContext);
		expect(res.maxRetries).toBe(0);
	});

	it('PERMISSION_ERROR matches 403 and forbidden messages', async () => {
		const err = new Error('forbidden: permission_denied');
		expect(errorHandlers.PERMISSION_ERROR.match(err, mockContext)).toBe(true);
		const res = await errorHandlers.PERMISSION_ERROR.handler(err, mockContext);
		expect(res.maxRetries).toBe(0);
	});

	it('NETWORK_ERROR matches connection errors', async () => {
		const err = new Error('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(err, mockContext)).toBe(true);
		const res = await errorHandlers.NETWORK_ERROR.handler(err, mockContext);
		expect(res.maxRetries).toBe(3);
	});

	it('DEFAULT catches any unhandled error', async () => {
		const err = new Error('unexpected error');
		expect(errorHandlers.DEFAULT.match(err, mockContext)).toBe(true);
		const res = await errorHandlers.DEFAULT.handler(err, mockContext);
		expect(res.maxRetries).toBe(0);
	});
});
