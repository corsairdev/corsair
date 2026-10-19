import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import * as client from './client';
import {
	Account,
	ApiKeys,
	Companies,
	Leads,
	Messages,
	Sequences,
	Webhooks,
} from './endpoints';
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
			Webhooks.create(ctx, {
				target_url: 'not-a-valid-url',
				event: 'lead.created',
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('destructive endpoint operations', () => {
	it('leads.delete deletes a lead permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Leads.delete(ctx, { id: 10 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/leads/10', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.leads.delete',
			{ id: 10 },
			'completed',
		);
	});

	it('leads.bulkDelete deletes leads in bulk permanently', async () => {
		const mockResponse = { data: { deleted: 2 } };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Leads.bulkDelete(ctx, { lead_ids: [1, 2] });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/leads/bulk/delete',
			'test-api-key',
			{
				method: 'POST',
				body: { lead_ids: [1, 2] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.leads.bulkDelete',
			{ leadCount: 2 },
			'completed',
		);
	});

	it('companies.bulkDelete deletes companies in bulk permanently', async () => {
		const mockResponse = { data: { deleted: 2 } };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Companies.bulkDelete(ctx, { company_ids: [1, 2] });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/companies/bulk/delete',
			'test-api-key',
			{
				method: 'POST',
				body: { company_ids: [1, 2] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.companies.bulkDelete',
			{ companyCount: 2 },
			'completed',
		);
	});

	it('webhooks.delete deletes a webhook permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Webhooks.delete(ctx, { id: 44 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/webhooks/44', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.webhooks.delete',
			{ id: 44 },
			'completed',
		);
	});

	it('webhooks.deleteLegacy deletes a webhook permanently via legacy query parameter', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Webhooks.deleteLegacy(ctx, { id: 44 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/webhooks', 'test-api-key', {
			method: 'DELETE',
			query: { id: 44 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.webhooks.deleteLegacy',
			{ id: 44 },
			'completed',
		);
	});

	it('sequences.delete deletes a sequence permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Sequences.delete(ctx, { id: 12 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sequences/12',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.sequences.delete',
			{ id: 12 },
			'completed',
		);
	});

	it('companies.delete deletes a company permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Companies.delete(ctx, { id: 5 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/companies/5', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.companies.delete',
			{ id: 5 },
			'completed',
		);
	});

	it('apiKeys.delete deletes an api key permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await ApiKeys.delete(ctx, { id: 2 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/api-keys/2', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.apiKeys.delete',
			{ id: 2 },
			'completed',
		);
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

	it('recurses through object arrays with explicit indexes so each location stays together', () => {
		expect(
			toBracketQuery({
				headquarters_location: {
					include: [{ country: 'US', city: 'Boston' }],
				},
			}),
		).toEqual({
			'headquarters_location[include][0][country]': 'US',
			'headquarters_location[include][0][city]': 'Boston',
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

// Returns wire-JSON mock responses matching each endpoint's output schema.
// Stricter typing for the return value is not feasible because the 160 endpoints
// return distinct schema shapes (data envelopes, collections, primitive statuses, or undefined).
function getMockResponse(key: string, outputSchema: z.ZodType): unknown {
	if (outputSchema.safeParse(undefined).success) {
		return undefined;
	}
	if (key === 'leads.list')
		return { data: { leads: [{ id: 1, email: 'test@example.com' }] } };
	if (key === 'leads.exist')
		return {
			data: {
				id: 1,
				email: 'test@example.com',
				leads_list_id: 1,
				leads_list_name: 'List',
			},
		};
	if (key === 'tags.list') return { data: { tags: [{ id: 1, name: 'VIP' }] } };
	if (key === 'leadTags.attach')
		return { data: { tags: [{ id: 1, name: 'VIP' }] } };
	if (key === 'customAttributes.list')
		return { data: { leads_custom_attributes: [{ id: 1, name: 'Attr' }] } };
	if (key === 'leadsLists.list')
		return { data: { leads_lists: [{ id: 1, name: 'List' }] } };
	if (key === 'leadsListFolders.list')
		return { data: { folders: [{ id: 1, name: 'Folder' }] } };
	if (key === 'companies.list')
		return { data: { companies: [{ id: 1, name: 'Acme' }] } };
	if (key === 'companyLists.list')
		return { data: { company_lists: [{ id: 1, name: 'List' }] } };
	if (key === 'companyListFolders.list')
		return { data: { folders: [{ id: 1, name: 'Folder' }] } };
	if (key === 'companyTags.list')
		return { data: { tags: [{ id: 1, name: 'Tag' }] } };
	if (key === 'sequences.list')
		return { data: { sequences: [{ id: 1, title: 'Seq' }] } };
	if (key === 'sequenceRecipients.list')
		return { data: { recipients: [{ id: 1, email: 'test@example.com' }] } };
	if (key === 'sequenceFollowUps.list')
		return { data: { follow_ups: [{ id: 1 }] } };
	if (key === 'sequenceFollowUps.create')
		return { data: { follow_up: { id: 1 } } };
	if (key === 'messages.list') return { data: { messages: [{ id: 1 }] } };
	if (key === 'messageTemplates.list')
		return { data: { message_templates: [{ id: 1, name: 'Template' }] } };
	if (key === 'emailCount.get')
		return { data: { total: 10, personal: 5, generic: 5 } };
	if (key === 'emailVerifier.verify')
		return { data: { status: 'valid', email: 'test@example.com' } };
	if (key === 'emailInsight.get') return { data: { status: 'found' } };
	if (key === 'domainCount.get') return { data: { total: 10 } };
	if (key === 'domainsSuggestion.get') return { data: { domains: [] } };
	if (key === 'domainSearch.search' || key === 'domainSearch.searchPost') {
		return { data: { domain: 'example.com', emails: [] } };
	}
	if (key === 'multiDomainSearch.search')
		return { data: [{ domain: 'example.com' }] };
	if (
		key === 'sequences.start' ||
		key === 'sequences.pause' ||
		key === 'sequences.resume' ||
		key === 'sequences.archive' ||
		key === 'sequences.test'
	) {
		return { status: 'success', data: { message: 'ok' } };
	}
	if (key === 'leads.importCsv') return { data: { id: 1, status: 'pending' } };
	if (outputSchema.safeParse({ data: [] }).success) {
		return { data: [] };
	}
	return { data: {} };
}

// Sample input parameters covering all endpoint input requirements.
// Stricter typing for property values is not feasible because input fields across 160 endpoints
// accept heterogeneous primitive, array, and nested object types.
function getSampleInput(key: string): Record<string, unknown> {
	// Stricter typing for common input values is not feasible because parameters span strings, numbers, arrays, and objects.
	const common: Record<string, unknown> = {
		id: 1,
		email: 'test@example.com',
		domain: 'example.com',
		domains: ['example.com'],
		name: 'Sample',
		label: 'Sample Label',
		color: '374151',
		subject: 'Hello',
		body: 'Sample message body',
		to: 'test@example.com',
		email_account_id: 1,
		target_url: 'https://example.com/webhook',
		event: 'lead.created',
		leads: [{ email: 'test@example.com' }],
		lead_ids: [1],
		company_ids: [1],
		company: 'Acme',
		company_id: 1,
		company_list_id: 1,
		leads_list_id: 1,
		target_leads_list_id: 2,
		target_company_list_id: 2,
		sequence_id: 1,
		tag_id: 1,
		tag_ids: [1],
		tag_name: 'VIP',
		tag_names: ['VIP'],
		first_name: 'Jane',
		last_name: 'Doe',
		query: 'sample',
		handles: ['h1'],
		csv_data: 'email,first_name\njane@example.com,Jane',
		file: 'dummy,csv\nrow,1',
		csv: 'dummy,csv\nrow,1',
		raw_csv: 'dummy,csv\nrow,1',
		from_leads_list_id: 1,
		to_leads_list_id: 2,
		from_company_list_id: 1,
		to_company_list_id: 2,
		score: 5,
		feedback: 'great',
		feedback_type: 'bug',
		summary: 'Summary text',
		details: 'Details text',
		limit: 10,
		offset: 0,
		emails: ['test@example.com'],
		recipients: [{ email: 'test@example.com' }],
	};

	if (
		key === 'domainSearch.search' ||
		key === 'domainSearch.searchPost' ||
		key === 'emailCount.get'
	) {
		const { ...rest } = common;
		return { ...rest, type: 'personal' };
	}

	return common;
}

// Generic endpoint handler signature for dynamically executing operations.
// Stricter typing for input and return types is not feasible because each endpoint
// handler accepts a different Zod input shape and returns a distinct output schema.
type GenericEndpointHandler = (
	ctx: Ctx,
	input: unknown,
) => Promise<unknown>;

interface EndpointSchemaEntry {
	input: z.ZodType;
	output: z.ZodType;
}

describe('comprehensive operations coverage', () => {
	const plugin = hunterio({ key: 'test-api-key' });
	// Type assertion for iterating nested resource groups dynamically across 160 operations.
	// Stricter static typing is not feasible because operations span 38 heterogeneous resource groups.
	const endpointTree = plugin.endpoints as unknown as Record<
		string,
		Record<string, GenericEndpointHandler>
	>;

	const allOps: Array<{ key: string; group: string; action: string }> = [];
	for (const [group, actions] of Object.entries(endpointTree)) {
		for (const action of Object.keys(actions)) {
			allOps.push({ key: `${group}.${action}`, group, action });
		}
	}

	it('covers all 160 operations across all resource groups', () => {
		expect(allOps).toHaveLength(160);
	});

	it.each(allOps.map((op) => [op.key, op] as const))(
		'%s executes request, parses response, and logs event',
		async (_key, op) => {
			mockedRequest.mockReset();
			mockedLogEvent.mockReset();

			const fn = endpointTree[op.group]?.[op.action];
			expect(typeof fn).toBe('function');
			if (!fn) throw new Error(`Missing endpoint ${op.key}`);

			// Type assertion for looking up schema entries by dynamic string key.
			// Stricter static typing is not feasible because operations are enumerated dynamically across 160 endpoints.
			const schemas = hunterioEndpointSchemas as unknown as Record<
				string,
				EndpointSchemaEntry
			>;
			const schema = schemas[op.key];
			expect(schema).toBeDefined();
			if (!schema) throw new Error(`Missing schema for ${op.key}`);

			const sampleInput = getSampleInput(op.key);
			const parsedInput = schema.input.parse(sampleInput);

			const mockResponse = getMockResponse(op.key, schema.output);
			schema.output.parse(mockResponse);

			mockedRequest.mockResolvedValue(mockResponse);

			const result = await fn(ctx, parsedInput);
			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				expect.stringMatching(/^hunterio\./),
				expect.anything(),
				'completed',
			);
		},
	);
});
