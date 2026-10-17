import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Account, Leads, Messages, Sequences, Webhooks } from './endpoints';
import { toBracketQuery } from './endpoints/query';
import type { HunterioContext } from './index';
import { hunterio, hunterioAuthConfig, hunterioEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeHunterioRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHunterioRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Account.get>[0];

function buildCtx(): Ctx {
	const ctx: HunterioContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures mirror the v2 response envelopes documented at
// https://hunter.io/api-documentation/v2 (account §2, leads §5, sequences §7,
// webhooks §10).

describe('account.get', () => {
	it('fetches the account and returns the parsed envelope', async () => {
		const mockResponse = {
			data: {
				email: 'owner@example.com',
				plan_name: 'Starter',
				requests: { credits: { used: 1, available: 49 } },
			},
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Account.get(ctx, {});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/account', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.account.get',
			{},
			'completed',
		);
	});
});

describe('leads.list', () => {
	it('flattens nested filters into PHP bracket query keys', async () => {
		const mockResponse = {
			data: { leads: [{ id: 1, email: 'jane@example.com' }] },
			meta: { total: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Leads.list(ctx, {
			location: { country: { include: ['US'] } },
			sending_status: ['sent'],
			limit: 10,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/leads', 'test-api-key', {
			method: 'GET',
			query: {
				'location[country][include][]': ['US'],
				'sending_status[]': ['sent'],
				limit: 10,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.leads.list',
			{ count: 1 },
			'completed',
		);
	});

	it('never logs lead email addresses', async () => {
		mockedRequest.mockResolvedValue({
			data: { leads: [{ id: 1, email: 'jane@example.com' }] },
		});

		await Leads.list(ctx, {});

		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(payload).toEqual({ count: 1 });
		expect(JSON.stringify(payload)).not.toContain('jane@example.com');
	});
});

describe('messages.send', () => {
	it('posts the message body and logs no recipient data', async () => {
		const mockResponse = {
			data: { id: 42, status: 'sent', message_id: 'msg-1' },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Messages.send(ctx, {
			email_account_id: 1,
			to: 'jane@example.com',
			subject: 'Intro',
			body: 'Hello there',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/messages', 'test-api-key', {
			method: 'POST',
			body: {
				email_account_id: 1,
				to: 'jane@example.com',
				subject: 'Intro',
				body: 'Hello there',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.messages.send',
			{},
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('jane@example.com');
	});

	it('rejects a message without to or lead_id before calling the API', async () => {
		await expect(
			Messages.send(ctx, {
				email_account_id: 1,
				subject: 'Intro',
				body: 'Hello there',
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('sequences.start', () => {
	it('posts the start action and logs the sequence id', async () => {
		const mockResponse = {
			status: 'success',
			data: { message: 'Sequence started', recipients_count: 3 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sequences.start(ctx, { id: 7 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sequences/7/start',
			'test-api-key',
			{ method: 'POST' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.sequences.start',
			{ id: 7 },
			'completed',
		);
	});
});

describe('webhooks.create', () => {
	it('creates a webhook with a valid target url', async () => {
		const mockResponse = {
			data: {
				id: 9,
				target_url: 'https://example.com/hooks/hunter',
				event: 'lead.created',
			},
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Webhooks.create(ctx, {
			target_url: 'https://example.com/hooks/hunter',
			event: 'lead.created',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/webhooks', 'test-api-key', {
			method: 'POST',
			body: {
				target_url: 'https://example.com/hooks/hunter',
				event: 'lead.created',
			},
		});
	});

	it('rejects a malformed target url before calling the API', async () => {
		await expect(
			Webhooks.create(ctx, { target_url: 'short', event: 'lead.created' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('toBracketQuery', () => {
	it('flattens nested objects and array values into bracket keys', () => {
		expect(
			toBracketQuery({
				location: { country: { include: ['US', 'CA'] } },
				sending_status: ['sent'],
				limit: 10,
				missing: undefined,
			}),
		).toEqual({
			'location[country][include][]': ['US', 'CA'],
			'sending_status[]': ['sent'],
			limit: 10,
		});
	});
});

describe('hunterio plugin shape', () => {
	it('exposes the nested endpoint tree, auth config, and empty webhooks', () => {
		const plugin = hunterio({ key: 'test-key' });

		expect(plugin.endpoints?.account.get).toBeDefined();
		expect(plugin.endpoints?.webhooks.deleteLegacy).toBeDefined();
		expect(plugin.endpoints?.emailAccounts.capacities).toBeDefined();
		expect(plugin.authConfig).toEqual(hunterioAuthConfig);
		expect(plugin.webhooks).toEqual({});
		expect(hunterioEndpointSchemas['account.get']?.input).toBeDefined();
		expect(hunterioEndpointSchemas['messages.send']?.output).toBeDefined();
		expect(hunterioEndpointSchemas['leads.importCsv']?.input).toBeDefined();
	});
});
