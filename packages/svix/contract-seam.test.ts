import {
	AuthMissingError,
	createCorsair,
	PermissionRequiredError,
	ReadonlyForbiddenError,
	runReadonly,
	runWithMode,
} from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { svixBaseUrl } from './client';
import fixtures from './contract-fixtures.json';
import type { SvixContext } from './index';
import { svix, svixEndpointMeta, svixEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;
const ctx = { key: 'fixture-token', options: { region: 'us' } } as SvixContext;
const plugin = svix();
// Fixtures select heterogeneous endpoints dynamically, so no single input or
// output type fits; each handler validates the fixture at the public seam.
const groups = plugin.endpoints as unknown as Record<
	string,
	Record<string, (context: SvixContext, input: unknown) => Promise<unknown>>
>;
// Inputs vary across the 61 fixture-selected operations and are validated by each handler.
function call(
	group: string,
	name: string,
	context: SvixContext,
	input: unknown,
) {
	const handler = groups[group]?.[name];
	if (!handler) throw new Error(`Missing Svix endpoint ${group}.${name}`);
	return handler(context, input);
}

beforeEach(() => mockRequest.mockReset());

describe('Svix OpenAPI request seam', () => {
	it('blocks consumer polling in readonly and requires approval in strict mode', async () => {
		const client = createCorsair({
			plugins: [svix({ key: 'fixture-token', region: 'us' })],
		});
		const input = { app_id: 'app_1', sink_id: 'sink_1', consumer_id: 'worker' };
		await expect(
			runReadonly(() => client.svix.api.messages.pollerConsumerPoll(input)),
		).rejects.toBeInstanceOf(ReadonlyForbiddenError);
		await expect(
			runWithMode('strict', () =>
				client.svix.api.messages.pollerConsumerPoll(input),
			),
		).rejects.toBeInstanceOf(PermissionRequiredError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('registers exactly the 61 documented operation fixtures', () => {
		const registered = Object.entries(groups)
			.flatMap(([group, endpoints]) =>
				Object.keys(endpoints).map((name) => `${group}.${name}`),
			)
			.sort();
		expect(fixtures).toHaveLength(61);
		expect(registered).toEqual(
			fixtures.map((f) => `${f.group}.${f.name}`).sort(),
		);
		expect(Object.keys(svixEndpointSchemas).sort()).toEqual(registered);
		expect(svixEndpointMeta['endpoints.mcpEventsUnsubscribe'].riskLevel).toBe(
			'destructive',
		);
	});

	it.each(fixtures)(
		'$group.$name sends the documented request',
		async (fixture) => {
			const response = fixture.noContent ? undefined : fixture.response;
			mockRequest.mockResolvedValue(response);
			const result = await call(
				fixture.group,
				fixture.name,
				ctx,
				fixture.input,
			);
			expect(result).toEqual(response);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, options, transport] = mockRequest.mock.calls[0];
			expect(config).toEqual(
				expect.objectContaining({
					BASE: 'https://api.us.svix.com',
					TOKEN: 'fixture-token',
				}),
			);
			expect(options).toEqual(
				expect.objectContaining({
					method: fixture.method,
					url: fixture.path,
					query: fixture.query ?? undefined,
					body: fixture.body ?? undefined,
					mediaType: fixture.body === null ? undefined : 'application/json',
					headers: fixture.idempotencyKey
						? { 'Idempotency-Key': fixture.idempotencyKey }
						: undefined,
				}),
			);
			expect(transport.rateLimitConfig.maxRetries).toBe(0);
		},
	);

	it('provides a nonempty item for every list and poll response fixture', () => {
		const lists = fixtures.flatMap((fixture) => {
			const response = fixture.response;
			return response && 'data' in response && Array.isArray(response.data)
				? [response.data]
				: [];
		});
		expect(lists).toHaveLength(11);
		for (const items of lists) {
			expect(items).toHaveLength(1);
		}
	});

	it.each([
		['attempts', 'listAttemptedMessages', 'eventType'],
		['attempts', 'listAttemptedDestinations', 'url'],
	])(
		'rejects a malformed %s.%s item missing %s',
		async (group, name, field) => {
			const fixture = fixtures.find(
				(entry) => entry.group === group && entry.name === name,
			);
			const response = fixture?.response;
			if (
				!fixture ||
				!response ||
				!('data' in response) ||
				!Array.isArray(response.data) ||
				!response.data[0]
			) {
				throw new Error(`Missing populated list fixture ${group}.${name}`);
			}
			const item = Object.fromEntries(
				Object.entries(response.data[0]).filter(([key]) => key !== field),
			);
			mockRequest.mockResolvedValue({ ...response, data: [item] });
			await expect(call(group, name, ctx, fixture.input)).rejects.toThrow();
		},
	);

	it('forwards a later page and preserves nullable values', async () => {
		mockRequest.mockResolvedValue({
			data: [],
			done: false,
			iterator: null,
			prevIterator: null,
		});
		const response = await call('applications', 'list', ctx, {
			limit: 5,
			iterator: 'app_1srOrx2ZWZBpBUvZwXKQmoEYga2',
			order: 'descending',
		});
		expect(response).toEqual({
			data: [],
			done: false,
			iterator: null,
			prevIterator: null,
		});
		expect(mockRequest.mock.calls[0][1].query).toEqual({
			limit: 5,
			iterator: 'app_1srOrx2ZWZBpBUvZwXKQmoEYga2',
			order: 'descending',
		});
	});

	it.each(['', '.', '..', 'abc/def', 'abc\\def', 'a"b', "a'b", 'a?b', 'a#b'])(
		'rejects unsafe path segment %s',
		async (id) => {
			await expect(
				call('applications', 'get', ctx, { app_id: id }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);

	it('rejects missing keys, invalid regions, and reserved idempotency keys', async () => {
		await expect(
			call('applications', 'list', { ...ctx, key: '' }, {}),
		).rejects.toThrow();
		await expect(
			call(
				'applications',
				'list',
				{ ...ctx, options: { region: 'invalid' as 'eu' } },
				{},
			),
		).rejects.toThrow('Invalid Svix region');
		await expect(
			call('applications', 'create', ctx, {
				body: { name: 'App' },
				idempotencyKey: 'auto_reserved',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects malformed provider responses', async () => {
		mockRequest.mockResolvedValue({ id: 'wrong' });
		await expect(
			call('applications', 'get', ctx, { app_id: 'valid' }),
		).rejects.toThrow();
	});

	it('classifies rate limits without replay', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/api/v1/app' },
			{
				url: 'https://api.us.svix.com/api/v1/app',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'rate limit',
			{ retryAfter: 5000 },
		);
		const handler = plugin.errorHandlers?.RATE_LIMIT_ERROR;
		const context = {
			pluginId: 'svix',
			operation: 'applications.create',
			input: {},
			originalError: error,
		};
		expect(error.retryAfter).toBe(5000);
		expect(handler?.match(error, context)).toBe(true);
		expect(await handler?.handler(error, context)).toEqual({ maxRetries: 0 });
	});

	it('preserves provider errors and retry-after without replaying a write', async () => {
		const body = { detail: 'Rate limited', code: 'rate_limit' };
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/api/v1/app' },
				{
					url: 'https://api.us.svix.com/api/v1/app',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body,
				},
				'Rate limited',
				{ retryAfter: 5000 },
			),
		);
		await expect(
			call('applications', 'create', ctx, { body: { name: 'App' } }),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 429,
			retryAfter: 5000,
			body,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('passes multiple event type filters and a later cursor to the request', async () => {
		mockRequest.mockResolvedValue({ data: [], done: true, iterator: null });
		await call('messages', 'list', ctx, {
			app_id: 'app',
			event_types: ['user.signup', 'user.deleted'],
			limit: 2,
			iterator: 'msg_1srOrx2ZWZBpBUvZwXKQmoEYga2',
		});
		expect(mockRequest.mock.calls[0][1].query).toEqual({
			event_types: ['user.signup', 'user.deleted'],
			limit: 2,
			iterator: 'msg_1srOrx2ZWZBpBUvZwXKQmoEYga2',
		});
	});

	it.each([
		['applications', 'list', 'app'],
		['endpoints', 'list', 'ep'],
		['messages', 'list', 'msg'],
		['attempts', 'listByEndpoint', 'atmpt'],
		['attempts', 'listByMsg', 'atmpt'],
		['attempts', 'listAttemptedMessages', 'msg'],
		['attempts', 'listAttemptedDestinations', 'ep'],
		['operationalWebhooks', 'list', 'ep'],
	])('round-trips a previous cursor for %s.%s', async (group, name, prefix) => {
		const fixture = fixtures.find((f) => f.group === group && f.name === name);
		if (!fixture) throw new Error(`Missing fixture ${group}.${name}`);
		const previous = `-${prefix}_1srOrx2ZWZBpBUvZwXKQmoEYga2`;
		const response = { ...fixture.response, prevIterator: previous };
		mockRequest.mockResolvedValue(response);
		const first = (await call(group, name, ctx, fixture.input)) as {
			prevIterator: string;
		};
		await call(group, name, ctx, {
			...fixture.input,
			iterator: first.prevIterator,
		});
		expect(mockRequest.mock.calls[1][1].query).toEqual(
			expect.objectContaining({ iterator: previous }),
		);
		await expect(
			call(group, name, ctx, {
				...fixture.input,
				iterator: `--${previous.slice(1)}`,
			}),
		).rejects.toThrow();
	});

	it('accepts a maximum-length reverse event-type cursor', async () => {
		const fixture = fixtures.find(
			(f) => f.group === 'eventTypes' && f.name === 'list',
		);
		if (!fixture) throw new Error('Missing event type list fixture');
		const previous = `-${'a'.repeat(256)}`;
		mockRequest.mockResolvedValue({
			...fixture.response,
			prevIterator: previous,
		});
		const first = (await call('eventTypes', 'list', ctx, fixture.input)) as {
			prevIterator: string;
		};
		await call('eventTypes', 'list', ctx, {
			...fixture.input,
			iterator: first.prevIterator,
		});
		expect(mockRequest.mock.calls[1][1].query).toEqual(
			expect.objectContaining({ iterator: previous }),
		);
		await expect(
			call('eventTypes', 'list', ctx, {
				...fixture.input,
				iterator: 'a'.repeat(257),
			}),
		).rejects.toThrow();
	});

	it('encodes an unrestricted poller consumer ID as one path segment', async () => {
		const fixture = fixtures.find(
			(f) => f.group === 'messages' && f.name === 'pollerConsumerPoll',
		);
		if (!fixture) throw new Error('Missing poller consumer fixture');
		mockRequest.mockResolvedValue(fixture.response);
		await call('messages', 'pollerConsumerPoll', ctx, {
			...fixture.input,
			consumer_id: 'customer 1:blue',
		});
		expect(mockRequest.mock.calls[0][1].url).toContain(
			'/consumer/customer%201%3Ablue',
		);
	});

	it.each(['pollerConsumerPoll', 'pollerConsumerSeek'] as const)(
		'%s sends a consumer ID with reserved characters, encoded',
		async (name) => {
			const fixture = fixtures.find(
				(f) => f.group === 'messages' && f.name === name,
			);
			if (!fixture) throw new Error(`Missing ${name} fixture`);
			mockRequest.mockResolvedValue(fixture.response);
			await call('messages', name, ctx, {
				...fixture.input,
				consumer_id: `worker#1?"x'`,
			});
			expect(mockRequest.mock.calls[0][1].url).toContain(
				"/consumer/worker%231%3F%22x'",
			);
		},
	);

	it.each(['.', '..', 'a/b', 'a\\b', ''])(
		'refuses consumer ID %p before calling Svix',
		async (consumerId) => {
			const fixture = fixtures.find(
				(f) => f.group === 'messages' && f.name === 'pollerConsumerPoll',
			);
			if (!fixture) throw new Error('Missing poller consumer fixture');
			await expect(
				call('messages', 'pollerConsumerPoll', ctx, {
					...fixture.input,
					consumer_id: consumerId,
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);

	it.each([
		['sk_test.us', undefined, 'https://api.us.svix.com'],
		['sk_test.eu', undefined, 'https://api.eu.svix.com'],
		['sk_test.in', undefined, 'https://api.in.svix.com'],
		['sk_test.ca', undefined, 'https://api.ca.svix.com'],
		['sk_test.au', undefined, 'https://api.au.svix.com'],
		['testsk_without_region', undefined, 'https://api.svix.com'],
		['sk_test.us', 'eu', 'https://api.eu.svix.com'],
	] as const)(
		'picks the host for key %s with region %s',
		(key, region, base) => {
			expect(svixBaseUrl(key, region)).toBe(base);
		},
	);

	it('calls the region in the stored key when no region option is set', async () => {
		mockRequest.mockResolvedValue({ data: [], done: true, iterator: null });
		await call(
			'applications',
			'list',
			{ key: 'sk_test.us', options: {} } as SvixContext,
			{},
		);
		expect(mockRequest.mock.calls[0][0].BASE).toBe('https://api.us.svix.com');
	});

	it('raises AuthMissingError from the keyBuilder when no key is stored', async () => {
		const keyBuilder = svix().keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		} as unknown as Parameters<NonNullable<typeof keyBuilder>>[0];
		await expect(keyBuilder?.(keyCtx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it.each([
		'messages.create',
		'messages.createBatch',
		'attempts.resend',
		'endpoints.sendExample',
		'endpoints.replayMissing',
		'endpoints.bulkReplay',
		'endpoints.recover',
		'endpoints.rotateSecret',
		'endpoints.setHeaders',
		'endpoints.mcpEventsSubscribe',
		'operationalWebhooks.rotateSecret',
		'operationalWebhooks.setHeaders',
	] as const)(
		'marks %s destructive (it delivers webhooks or replaces state)',
		(op) => {
			expect(svixEndpointMeta[op].riskLevel).toBe('destructive');
		},
	);

	it('marks the message precheck as a read', () => {
		expect(svixEndpointMeta['messages.precheck'].riskLevel).toBe('read');
	});

	it('accepts status and task values Svix adds later in responses', async () => {
		const fixture = fixtures.find(
			(f) => f.group === 'attempts' && f.name === 'get',
		);
		if (!fixture?.response) throw new Error('Missing attempt fixture');
		mockRequest.mockResolvedValue({
			...fixture.response,
			status: 9,
			statusText: 'paused',
			triggerType: 7,
		});
		await expect(
			call('attempts', 'get', ctx, fixture.input),
		).resolves.toMatchObject({ statusText: 'paused' });
		mockRequest.mockResolvedValue({
			id: 'qtask_33qen93MNuelBAq1T9G7eHLJRsF',
			status: 'queued',
			task: 'endpoint.new-task',
			updatedAt: '2026-11-15T00:00:00Z',
		});
		await expect(
			call('endpoints', 'recover', ctx, {
				app_id: 'app_1',
				endpoint_id: 'ep_1',
				body: { since: '2026-11-14T00:00:00Z' },
			}),
		).resolves.toMatchObject({ task: 'endpoint.new-task' });
	});
});
