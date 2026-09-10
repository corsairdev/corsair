import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	EXIST_API_BASE,
	EXIST_MAX_BATCH_SIZE,
	EXIST_OAUTH_AUTHORIZE_URL,
	EXIST_OAUTH_TOKEN_URL,
	ExistAPIError,
	makeAuthenticatedExistRequest,
	makeExistRequest,
	toCommaList,
	toFlag,
} from './client';
import {
	ExistEndpointInputSchemas,
	ExistEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ExistContext, ExistKeyBuilderContext } from './index';
import { EXIST_DEFAULT_SCOPES, exist, existEndpointSchemas } from './index';
import { resolveExistOAuthTenantLink } from './oauth-tenant-link';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const ACCESS_TOKEN = 'exist_access_token_value';

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures — shapes taken from https://developer.exist.io/reference/
// ─────────────────────────────────────────────────────────────────────────────

const profileFixture = {
	username: 'josh',
	first_name: 'Josh',
	last_name: 'Sharp',
	avatar: 'https://exist.io/media/avatars/josh.png',
	timezone: 'Australia/Sydney',
	local_time: '2022-05-16T16:01:37.587301+10:00',
	imperial_distance: false,
	imperial_weight: false,
	imperial_energy: false,
	imperial_liquid: false,
	imperial_temperature: false,
	trial: false,
	delinquent: false,
};

const activityGroup = { name: 'activity', label: 'Activity', priority: 1 };

const stepsAttribute = {
	template: 'steps',
	name: 'steps',
	label: 'Steps',
	group: activityGroup,
	service: { name: 'googlefit', label: 'Google Fit' },
	active: true,
	priority: 1,
	manual: false,
	value_type: 0,
	value_type_description: 'Integer',
	available_services: [
		{ name: 'googlefit', label: 'Google Fit' },
		{ name: 'oura', label: 'Oura' },
	],
};

/** A custom attribute: no template, no owning service, no available services. */
const customAttribute = {
	template: null,
	name: 'coffees',
	label: 'Coffees',
	group: { name: 'custom', label: 'Custom', priority: 10 },
	service: null,
	active: true,
	priority: 12,
	manual: true,
	value_type: 0,
	value_type_description: 'Integer',
};

function paged<T>(results: T[], count = results.length) {
	return { count, next: null, previous: null, results };
}

function mockCtx() {
	return {
		key: ACCESS_TOKEN,
		authType: 'oauth_2' as const,
		options: {},
		db: {},
		tenantId: 'default',
		$getAccountId: async () => 'acct',
	} as unknown as ExistContext;
}

function endpoints() {
	const tree = exist({ key: ACCESS_TOKEN }).endpoints;
	if (!tree) throw new Error('missing endpoints');
	return tree;
}

function httpError(status: number, body: unknown, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: 'attributes/' },
		{
			url: `${EXIST_API_BASE}/attributes/`,
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		'Request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

const lastCall = () => mockRequest.mock.calls[0];

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockReset();
});

// ─────────────────────────────────────────────────────────────────────────────
// Plugin shape and registration
// ─────────────────────────────────────────────────────────────────────────────

describe('exist plugin shape', () => {
	it('registers the thirteen Exist operations and no triggers', () => {
		const plugin = exist();
		expect(plugin.id).toBe('exist');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toBeUndefined();
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(Object.keys(existEndpointSchemas).sort()).toEqual([
			'attributes.acquire',
			'attributes.increment',
			'attributes.list',
			'attributes.listOwned',
			'attributes.listTemplates',
			'attributes.listWithValues',
			'attributes.release',
			'attributes.update',
			'averages.list',
			'correlations.list',
			'insights.list',
			'oauth.authorize',
			'users.getProfile',
		]);
	});

	it('exposes OAuth2 and managed auth, scoped by tenant external id', () => {
		const plugin = exist();
		expect(plugin.authConfig).toEqual({
			oauth_2: { account: ['tenant_external_id'] },
			managed: { account: ['tenant_external_id'] },
		});
	});

	it('uses the documented OAuth2 authorize and token endpoints', () => {
		const plugin = exist();
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://exist.io/oauth2/authorize',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://exist.io/oauth2/access_token',
		);
		expect(plugin.oauthConfig?.tokenAuthMethod).toBe('body');
		// Exist only accepts pre-registered HTTPS redirect URIs.
		expect(plugin.oauthConfig?.requiresRegisteredRedirect).toBe(true);
		expect(plugin.oauthConfig?.scopes).toEqual(EXIST_DEFAULT_SCOPES);
		expect(plugin.oauthConfig?.scopes).toHaveLength(34);
	});

	it('honours a narrowed scope list', () => {
		const plugin = exist({ scopes: ['mood_read', 'mood_write'] });
		expect(plugin.oauthConfig?.scopes).toEqual(['mood_read', 'mood_write']);
	});

	it('marks the four ownership/write operations as write risk', () => {
		const meta = exist().endpointMeta;
		expect(meta?.['attributes.acquire']?.riskLevel).toBe('write');
		expect(meta?.['attributes.release']?.riskLevel).toBe('write');
		expect(meta?.['attributes.increment']?.riskLevel).toBe('write');
		expect(meta?.['attributes.update']?.riskLevel).toBe('write');
		expect(meta?.['attributes.list']?.riskLevel).toBe('read');
		expect(meta?.['users.getProfile']?.riskLevel).toBe('read');
	});

	it('declares a schema entity for every persisted object type', () => {
		expect(Object.keys(exist().schema?.entities ?? {}).sort()).toEqual([
			'attributeValues',
			'attributes',
			'averages',
			'correlations',
			'insights',
			'profile',
		]);
	});
});

describe('exist keyBuilder', () => {
	const build = (plugin: ReturnType<typeof exist>) =>
		plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>;

	it('returns a directly supplied token for endpoint calls', async () => {
		await expect(
			build(exist({ key: ACCESS_TOKEN }))({ authType: 'oauth_2' }, 'endpoint'),
		).resolves.toBe(ACCESS_TOKEN);
	});

	it('throws AuthMissingError when no OAuth2 credentials are available', async () => {
		const ctx = {
			authType: 'api_key',
		} as unknown as ExistKeyBuilderContext;
		await expect(build(exist())(ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Client / auth headers
// ─────────────────────────────────────────────────────────────────────────────

describe('makeExistRequest', () => {
	it('targets the Exist v2 base URL with a bearer token', async () => {
		mockRequest.mockResolvedValue(profileFixture);
		await makeExistRequest('accounts/profile/', ACCESS_TOKEN);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://exist.io/api/2',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'accounts/profile/',
				body: undefined,
				query: undefined,
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 3 }),
			}),
		);
	});

	it('sends a top-level JSON array as the body of write calls', async () => {
		mockRequest.mockResolvedValue({ success: [], failed: [] });
		await makeExistRequest('attributes/release/', ACCESS_TOKEN, {
			method: 'POST',
			body: [{ name: 'mood' }],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'POST',
			url: 'attributes/release/',
			body: [{ name: 'mood' }],
			mediaType: 'application/json',
		});
	});

	it('preserves status, body and retry-after when wrapping API errors', async () => {
		mockRequest.mockRejectedValue(
			httpError(429, { error: 'Rate limit exceeded' }, 4200),
		);
		await expect(
			makeExistRequest('attributes/', ACCESS_TOKEN),
		).rejects.toMatchObject({
			name: 'ExistAPIError',
			status: 429,
			retryAfter: 4200,
			message: 'Rate limit exceeded',
		});
	});

	it('wraps non-HTTP failures', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));
		await expect(
			makeExistRequest('attributes/', ACCESS_TOKEN),
		).rejects.toBeInstanceOf(ExistAPIError);
	});
});

describe('makeAuthenticatedExistRequest', () => {
	it('re-mints the token once and retries after a 401', async () => {
		mockRequest
			.mockRejectedValueOnce(httpError(401, { error: 'Invalid token' }))
			.mockResolvedValueOnce(profileFixture);
		const refreshAuth = jest.fn().mockResolvedValue('fresh_token');

		const result = await makeAuthenticatedExistRequest(
			'accounts/profile/',
			{ key: 'stale_token', _refreshAuth: refreshAuth },
			{ method: 'GET' },
		);

		expect(refreshAuth).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest.mock.calls[1][0].HEADERS.Authorization).toBe(
			'Bearer fresh_token',
		);
		expect(result).toEqual(profileFixture);
	});

	it('does not retry a 403, which no refresh can fix', async () => {
		mockRequest.mockRejectedValue(httpError(403, { error: 'Forbidden' }));
		const refreshAuth = jest.fn();

		await expect(
			makeAuthenticatedExistRequest(
				'attributes/increment/',
				{ key: ACCESS_TOKEN, _refreshAuth: refreshAuth },
				{ method: 'POST', body: [{ name: 'steps', value: 1 }] },
			),
		).rejects.toMatchObject({ status: 403 });
		expect(refreshAuth).not.toHaveBeenCalled();
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('surfaces a 401 when there is no refresh path', async () => {
		mockRequest.mockRejectedValue(httpError(401, { error: 'Invalid token' }));
		await expect(
			makeAuthenticatedExistRequest('attributes/', { key: ACCESS_TOKEN }),
		).rejects.toMatchObject({ status: 401 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('query serialization helpers', () => {
	it('joins list filters with commas as Exist expects', () => {
		expect(toCommaList(['activity', 'workouts'])).toBe('activity,workouts');
		expect(toCommaList([])).toBeUndefined();
		expect(toCommaList(undefined)).toBeUndefined();
	});

	it('maps documented on/off flags to 1, omitting them when false', () => {
		expect(toFlag(true)).toBe(1);
		expect(toFlag(false)).toBeUndefined();
		expect(toFlag(undefined)).toBeUndefined();
	});

	it('drops undefined query entries', () => {
		expect(compactQuery({ page: 1, limit: undefined, manual: false })).toEqual({
			page: 1,
			manual: false,
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Operations
// ─────────────────────────────────────────────────────────────────────────────

describe('users.getProfile', () => {
	it('GETs the profile endpoint and persists the user', async () => {
		mockRequest.mockResolvedValue(profileFixture);
		const upsertByEntityId = jest.fn();
		const ctx = {
			...mockCtx(),
			db: { profile: { upsertByEntityId } },
		} as unknown as ExistContext;

		const result = await endpoints().users.getProfile(ctx, {});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'accounts/profile/',
		});
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'josh',
			expect.objectContaining({ id: 'josh', username: 'josh' }),
		);
		expect(
			ExistEndpointOutputSchemas.usersGetProfile.parse(result).timezone,
		).toBe('Australia/Sydney');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'exist.users.getProfile',
			{},
			'completed',
		);
	});

	it('accepts a profile with a null avatar', () => {
		const parsed = ExistEndpointOutputSchemas.usersGetProfile.parse({
			...profileFixture,
			avatar: null,
		});
		expect(parsed.avatar).toBeNull();
	});
});

describe('attributes.list', () => {
	it('serializes every documented filter', async () => {
		mockRequest.mockResolvedValue(paged([stepsAttribute]));

		await endpoints().attributes.list(mockCtx(), {
			page: 2,
			limit: 50,
			groups: ['activity', 'workouts'],
			attributes: ['steps'],
			exclude_custom: true,
			manual: false,
			include_inactive: true,
			include_low_priority: true,
			owned: true,
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'attributes/',
			query: {
				page: 2,
				limit: 50,
				groups: 'activity,workouts',
				attributes: 'steps',
				exclude_custom: true,
				// `manual: false` is meaningful (it excludes manual attributes),
				// so it must survive compaction.
				manual: false,
				include_inactive: true,
				include_low_priority: true,
				owned: true,
			},
		});
	});

	it('omits the query entirely when no filters are given', async () => {
		mockRequest.mockResolvedValue(paged([stepsAttribute]));
		await endpoints().attributes.list(mockCtx(), {});
		expect(lastCall()[1].query).toBeUndefined();
	});

	it('persists returned attributes, flattening group and service', async () => {
		mockRequest.mockResolvedValue(paged([stepsAttribute, customAttribute]));
		const upsertByEntityId = jest.fn();
		const ctx = {
			...mockCtx(),
			db: { attributes: { upsertByEntityId } },
		} as unknown as ExistContext;

		await endpoints().attributes.list(ctx, {});

		expect(upsertByEntityId).toHaveBeenCalledWith(
			'steps',
			expect.objectContaining({
				id: 'steps',
				group_name: 'activity',
				service_name: 'googlefit',
				template: 'steps',
			}),
		);
		// A custom attribute has no template and no owning service.
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'coffees',
			expect.objectContaining({ template: null, service_name: null }),
		);
	});

	it('parses attributes whose template and service are null', () => {
		const parsed = ExistEndpointOutputSchemas.attributesList.parse(
			paged([customAttribute]),
		);
		expect(parsed.results[0]?.template).toBeNull();
		expect(parsed.results[0]?.service).toBeNull();
		expect(parsed.results[0]?.available_services).toBeUndefined();
	});
});

describe('attributes.listTemplates', () => {
	it('GETs the templates endpoint with its filters', async () => {
		const template = {
			name: 'steps',
			label: 'Steps',
			group: activityGroup,
			priority: 1,
			value_type: 0,
			value_type_description: 'Integer',
		};
		mockRequest.mockResolvedValue({
			count: 81,
			next: 'https://exist.io/api/2/attributes/templates/?page=2',
			previous: null,
			results: [template],
		});

		const result = await endpoints().attributes.listTemplates(mockCtx(), {
			page: 1,
			include_low_priority: true,
			groups: ['activity'],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'attributes/templates/',
			query: { page: 1, include_low_priority: true, groups: 'activity' },
		});
		const parsed =
			ExistEndpointOutputSchemas.attributesListTemplates.parse(result);
		expect(parsed.count).toBe(81);
		expect(parsed.next).toContain('page=2');
	});
});

describe('attributes.listWithValues', () => {
	it('passes days and date_max through and stores each day value', async () => {
		mockRequest.mockResolvedValue(
			paged([
				{
					...stepsAttribute,
					values: [
						{ date: '2022-05-16', value: 1533 },
						{ date: '2022-05-15', value: null },
					],
				},
			]),
		);
		const attributes = { upsertByEntityId: jest.fn() };
		const attributeValues = { upsertByEntityId: jest.fn() };
		const ctx = {
			...mockCtx(),
			db: { attributes, attributeValues },
		} as unknown as ExistContext;

		const result = await endpoints().attributes.listWithValues(ctx, {
			days: 31,
			date_max: '2022-05-16',
			templates: ['steps'],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'attributes/with-values/',
			query: { days: 31, date_max: '2022-05-16', templates: 'steps' },
		});
		expect(attributeValues.upsertByEntityId).toHaveBeenCalledWith(
			'steps:2022-05-16',
			expect.objectContaining({ attribute: 'steps', value: 1533 }),
		);
		// Days with no data come back as an explicit null and are still stored.
		expect(attributeValues.upsertByEntityId).toHaveBeenCalledWith(
			'steps:2022-05-15',
			expect.objectContaining({ value: null }),
		);
		expect(
			ExistEndpointOutputSchemas.attributesListWithValues.parse(result)
				.results[0]?.values,
		).toHaveLength(2);
	});
});

describe('attributes.listOwned', () => {
	it('GETs the owned-attributes endpoint', async () => {
		mockRequest.mockResolvedValue(paged([stepsAttribute], 34));
		const result = await endpoints().attributes.listOwned(mockCtx(), {
			limit: 100,
			exclude_custom: true,
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'attributes/owned/',
			query: { limit: 100, exclude_custom: true },
		});
		expect(
			ExistEndpointOutputSchemas.attributesListOwned.parse(result).count,
		).toBe(34);
	});
});

describe('attributes.acquire', () => {
	it('POSTs the attribute array and reports partial failures', async () => {
		mockRequest.mockResolvedValue({
			success: [{ name: 'mood_note', active: 'true' }],
			failed: [
				{
					title: 'mood',
					error_code: 'missing_field',
					error: "Object at index 0 missing field(s) 'name'",
				},
			],
		});

		const result = await endpoints().attributes.acquire(mockCtx(), {
			attributes: [{ template: 'mood' }, { name: 'mood_note', manual: false }],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'POST',
			url: 'attributes/acquire/',
			body: [{ template: 'mood' }, { name: 'mood_note', manual: false }],
			query: undefined,
		});
		const parsed = ExistEndpointOutputSchemas.attributesAcquire.parse(result);
		expect(parsed.success[0]?.name).toBe('mood_note');
		expect(parsed.failed[0]?.error_code).toBe('missing_field');
	});

	it('sends success_objects=1 only when requested', async () => {
		mockRequest.mockResolvedValue({ success: [], failed: [] });
		await endpoints().attributes.acquire(mockCtx(), {
			attributes: [{ template: 'mood' }],
			success_objects: true,
		});
		expect(lastCall()[1].query).toEqual({ success_objects: 1 });
	});

	it('requires each object to identify an attribute', () => {
		const schema = ExistEndpointInputSchemas.attributesAcquire;
		expect(schema.safeParse({ attributes: [{ manual: true }] }).success).toBe(
			false,
		);
		expect(schema.safeParse({ attributes: [{ name: 'mood' }] }).success).toBe(
			true,
		);
	});

	it('rejects batches larger than the documented maximum', () => {
		const attributes = Array.from(
			{ length: EXIST_MAX_BATCH_SIZE + 1 },
			(_, i) => ({ name: `attr_${i}` }),
		);
		expect(
			ExistEndpointInputSchemas.attributesAcquire.safeParse({ attributes })
				.success,
		).toBe(false);
	});
});

describe('attributes.release', () => {
	it('POSTs the names to release', async () => {
		mockRequest.mockResolvedValue({
			success: [{ name: 'mood_note' }],
			failed: [
				{
					name: 'mood',
					error_code: 'unauthorised',
					error: "Attribute 'mood' does not belong to this service",
				},
			],
		});

		const result = await endpoints().attributes.release(mockCtx(), {
			attributes: [{ name: 'mood' }, { name: 'mood_note' }],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'POST',
			url: 'attributes/release/',
			body: [{ name: 'mood' }, { name: 'mood_note' }],
		});
		expect(
			ExistEndpointOutputSchemas.attributesRelease.parse(result).failed[0]
				?.error_code,
		).toBe('unauthorised');
	});
});

describe('attributes.increment', () => {
	it('POSTs deltas and surfaces the new daily total', async () => {
		mockRequest.mockResolvedValue({
			success: [{ name: 'steps', value: 700, current: 1700 }],
			failed: [
				{
					name: 'steps_active_min',
					value: 9.0,
					error_code: 'validation',
					error: 'Cannot apply a float to an integer type',
				},
			],
		});

		const result = await endpoints().attributes.increment(mockCtx(), {
			attributes: [
				{ name: 'steps', date: '2022-05-20', value: 700 },
				// `date` is optional and defaults to the user's current day.
				{ name: 'steps_active_min', value: 5 },
			],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'POST',
			url: 'attributes/increment/',
			body: [
				{ name: 'steps', date: '2022-05-20', value: 700 },
				{ name: 'steps_active_min', value: 5 },
			],
		});
		const parsed = ExistEndpointOutputSchemas.attributesIncrement.parse(result);
		expect(parsed.success[0]?.current).toBe(1700);
		expect(parsed.failed[0]?.error_code).toBe('validation');
	});

	it('rejects malformed dates', () => {
		expect(
			ExistEndpointInputSchemas.attributesIncrement.safeParse({
				attributes: [{ name: 'steps', date: '20/05/2022', value: 1 }],
			}).success,
		).toBe(false);
	});
});

describe('attributes.update', () => {
	it('POSTs total values and reports per-object success and failure', async () => {
		mockRequest.mockResolvedValue({
			success: [
				{
					name: 'mood_note',
					date: '2022-05-20',
					value: 'Great day playing with the Exist API',
				},
			],
			failed: [
				{
					name: 'mood',
					date: '2022-05-20',
					error_code: 'missing_field',
					error: "Object at index 0 missing field(s) 'value'",
				},
			],
		});

		const result = await endpoints().attributes.update(mockCtx(), {
			attributes: [
				{ name: 'mood', date: '2022-05-20', value: 7 },
				{
					name: 'mood_note',
					date: '2022-05-20',
					value: 'Great day playing with the Exist API',
				},
			],
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'POST',
			url: 'attributes/update/',
			body: [
				{ name: 'mood', date: '2022-05-20', value: 7 },
				{
					name: 'mood_note',
					date: '2022-05-20',
					value: 'Great day playing with the Exist API',
				},
			],
		});
		// Documented as a top-level JSON array, never an object wrapper.
		expect(Array.isArray(lastCall()[1].body)).toBe(true);

		const parsed = ExistEndpointOutputSchemas.attributesUpdate.parse(result);
		expect(parsed.success[0]?.value).toBe(
			'Great day playing with the Exist API',
		);
		expect(parsed.failed[0]?.error_code).toBe('missing_field');
	});

	it('accepts the string, number and boolean value types Exist stores', () => {
		for (const value of ['a note', 7, 7.5, true, null]) {
			expect(
				ExistEndpointInputSchemas.attributesUpdate.safeParse({
					attributes: [{ name: 'mood', date: '2022-05-20', value }],
				}).success,
			).toBe(true);
		}
	});

	it('requires a date, unlike increment', () => {
		expect(
			ExistEndpointInputSchemas.attributesUpdate.safeParse({
				attributes: [{ name: 'mood', value: 7 }],
			}).success,
		).toBe(false);
		expect(
			ExistEndpointInputSchemas.attributesUpdate.safeParse({
				attributes: [{ name: 'mood', date: '20/05/2022', value: 7 }],
			}).success,
		).toBe(false);
	});

	it('rejects batches larger than the documented maximum of 35', () => {
		const oversized = Array.from({ length: EXIST_MAX_BATCH_SIZE + 1 }, () => ({
			name: 'steps',
			date: '2022-05-20',
			value: 1,
		}));
		expect(
			ExistEndpointInputSchemas.attributesUpdate.safeParse({
				attributes: oversized,
			}).success,
		).toBe(false);
		expect(
			ExistEndpointInputSchemas.attributesUpdate.safeParse({
				attributes: oversized.slice(0, EXIST_MAX_BATCH_SIZE),
			}).success,
		).toBe(true);
	});

	it('rejects an empty batch', () => {
		expect(
			ExistEndpointInputSchemas.attributesUpdate.safeParse({ attributes: [] })
				.success,
		).toBe(false);
	});
});

describe('oauth.authorize', () => {
	function oauthCtx(
		credentials: Record<string, string | null>,
		options: Record<string, unknown> = {},
	) {
		return {
			key: ACCESS_TOKEN,
			authType: 'oauth_2' as const,
			options,
			db: {},
			tenantId: 'default',
			$getAccountId: async () => 'acct',
			keys: { get_integration_credentials: async () => credentials },
		} as unknown as ExistContext;
	}

	const validCreds = {
		client_id: 'exist-client-id',
		client_secret: 'exist-client-secret',
		redirect_url: 'https://app.example.com/callback',
	};

	it('builds the documented authorisation URL without calling the API', async () => {
		const result = await endpoints().oauth.authorize(
			oauthCtx(validCreds, { scopes: ['mood_read', 'mood_write'] }),
			{},
		);

		// This operation must never issue an HTTP request.
		expect(mockRequest).not.toHaveBeenCalled();

		const url = new URL(result.url);
		expect(`${url.origin}${url.pathname}`).toBe(
			'https://exist.io/oauth2/authorize',
		);
		expect(url.searchParams.get('response_type')).toBe('code');
		expect(url.searchParams.get('client_id')).toBe('exist-client-id');
		expect(url.searchParams.get('redirect_uri')).toBe(
			'https://app.example.com/callback',
		);
		// Exist documents a space-separated scope list.
		expect(url.searchParams.get('scope')).toBe('mood_read mood_write');
		expect(result.scopes).toEqual(['mood_read', 'mood_write']);
	});

	it('never puts the client secret in the URL', async () => {
		const result = await endpoints().oauth.authorize(oauthCtx(validCreds), {
			scopes: ['mood_read'],
		});
		expect(result.url).not.toContain('exist-client-secret');
		expect(result.url).not.toContain('client_secret');
	});

	it('emits an unguessable, per-call state for CSRF protection', async () => {
		const ctx = oauthCtx(validCreds);
		const first = await endpoints().oauth.authorize(ctx, {
			scopes: ['mood_read'],
		});
		const second = await endpoints().oauth.authorize(ctx, {
			scopes: ['mood_read'],
		});

		expect(first.state).not.toBe(second.state);
		expect(first.state.length).toBeGreaterThanOrEqual(16);
		// The state in the URL is the one handed back to the caller to compare.
		expect(new URL(first.url).searchParams.get('state')).toBe(first.state);
	});

	it('falls back to the scopes the plugin was configured with', async () => {
		const result = await endpoints().oauth.authorize(
			oauthCtx(validCreds, { scopes: ['sleep_read'] }),
			{},
		);
		expect(new URL(result.url).searchParams.get('scope')).toBe('sleep_read');
	});

	it('rejects a non-HTTPS redirect, which Exist will not accept', async () => {
		await expect(
			endpoints().oauth.authorize(
				oauthCtx({ ...validCreds, redirect_url: 'http://localhost:3000/cb' }),
				{ scopes: ['mood_read'] },
			),
		).rejects.toThrow(/HTTPS/i);
	});

	it('reports missing client credentials clearly', async () => {
		await expect(
			endpoints().oauth.authorize(
				oauthCtx({ ...validCreds, client_id: null }),
				{ scopes: ['mood_read'] },
			),
		).rejects.toThrow(/client_id/);

		await expect(
			endpoints().oauth.authorize(
				oauthCtx({ ...validCreds, redirect_url: null }),
				{ scopes: ['mood_read'] },
			),
		).rejects.toThrow(/redirect_url/);
	});

	it('requires at least one scope', async () => {
		await expect(
			endpoints().oauth.authorize(oauthCtx(validCreds, {}), {}),
		).rejects.toThrow(/scope/i);
		// An explicitly empty scope array is a schema violation.
		expect(
			ExistEndpointInputSchemas.oauthAuthorize.safeParse({ scopes: [] })
				.success,
		).toBe(false);
	});

	it('logs only the scope count, not the client id or redirect target', async () => {
		await endpoints().oauth.authorize(oauthCtx(validCreds), {
			scopes: ['mood_read', 'sleep_read'],
		});

		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).toEqual({ scopeCount: 2 });
		const serialized = JSON.stringify(payload);
		expect(serialized).not.toContain('exist-client-id');
		expect(serialized).not.toContain('app.example.com');
	});
});

describe('reviewer regressions', () => {
	it('rejects calendar-impossible dates, not just malformed ones', () => {
		const bad = (date: string) =>
			ExistEndpointInputSchemas.attributesUpdate.safeParse({
				attributes: [{ name: 'mood', date, value: 7 }],
			}).success;

		// Regex-only validation accepted these; z.iso.date() checks the calendar.
		expect(bad('2026-02-31')).toBe(false);
		expect(bad('2026-13-01')).toBe(false);
		expect(bad('2026-00-10')).toBe(false);
		expect(bad('2026-04-31')).toBe(false);
		// Real days, including a leap day, still pass.
		expect(bad('2026-02-28')).toBe(true);
		expect(bad('2024-02-29')).toBe(true);
	});

	it('rejects filtering with-values by both attributes and templates', () => {
		const parse = (input: Record<string, unknown>) =>
			ExistEndpointInputSchemas.attributesListWithValues.safeParse(input);

		// "you would use one or the other of attributes and templates to filter"
		expect(parse({ attributes: ['mood'], templates: ['mood'] }).success).toBe(
			false,
		);
		expect(parse({ attributes: ['mood'] }).success).toBe(true);
		expect(parse({ templates: ['mood'] }).success).toBe(true);
		// Empty arrays are not a filter, so they do not conflict.
		expect(parse({ attributes: ['mood'], templates: [] }).success).toBe(true);
		expect(parse({}).success).toBe(true);
	});

	it('bounds the OAuth tenant-link profile lookup instead of hanging', async () => {
		const originalFetch = globalThis.fetch;
		let receivedSignal: AbortSignal | undefined;
		globalThis.fetch = ((_url: string, init?: RequestInit) => {
			receivedSignal = init?.signal ?? undefined;
			// A profile endpoint that never answers: only the abort signal can
			// end this request.
			return new Promise((_resolve, reject) => {
				init?.signal?.addEventListener('abort', () =>
					reject(new Error('aborted')),
				);
			});
		}) as typeof fetch;

		try {
			const pending = resolveExistOAuthTenantLink({
				access_token: 'token-without-username',
			} as never);

			// The resolver must hand fetch a signal that is already scheduled to
			// abort, rather than waiting on Exist indefinitely.
			await Promise.resolve();
			expect(receivedSignal).toBeInstanceOf(AbortSignal);
			expect(receivedSignal?.aborted).toBe(false);

			// Aborting resolves the caller to null rather than rejecting.
			(
				receivedSignal as AbortSignal & { dispatchEvent: (e: Event) => boolean }
			).dispatchEvent?.(new Event('abort'));
			await expect(pending).resolves.toBeNull();
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('keeps personal attribute values out of the operation log', async () => {
		mockRequest.mockResolvedValue({ success: [], failed: [] });

		await endpoints().attributes.update(mockCtx(), {
			attributes: [
				{ name: 'mood', date: '2022-05-20', value: 7 },
				{
					name: 'mood_note',
					date: '2022-05-20',
					value: 'A private note about my day',
				},
				{ name: 'mood', date: '2022-05-21', value: 3 },
			],
		});

		const [, eventType, payload] = mockLog.mock.calls[0] as [
			unknown,
			string,
			Record<string, unknown>,
		];
		expect(eventType).toBe('exist.attributes.update');
		// Operational metadata is retained...
		expect(payload).toEqual({
			count: 3,
			attributes: ['mood', 'mood_note'],
			dates: ['2022-05-20', '2022-05-21'],
		});
		// ...but the values themselves never reach the persistent log.
		expect(JSON.stringify(payload)).not.toContain('A private note');
		expect(JSON.stringify(payload)).not.toContain('value');
	});

	it('summarises increment batches without their deltas', async () => {
		mockRequest.mockResolvedValue({ success: [], failed: [] });

		await endpoints().attributes.increment(mockCtx(), {
			attributes: [
				{ name: 'steps', date: '2022-05-20', value: 700 },
				// No date: defaults to today, so no date is recorded either.
				{ name: 'steps_active_min', value: 5 },
			],
		});

		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).toEqual({
			count: 2,
			attributes: ['steps', 'steps_active_min'],
			dates: ['2022-05-20'],
		});
		expect(JSON.stringify(payload)).not.toContain('700');
	});
});

describe('averages.list', () => {
	it('sends include_historical as the documented 1 flag and stores results', async () => {
		const average = {
			attribute: 'steps',
			date: '2020-04-29',
			overall: 4174.0,
			monday: 4057.0,
			tuesday: 6614.0,
			wednesday: 4001.0,
			thursday: 3923.0,
			friday: 4528.0,
			saturday: 3649.0,
			sunday: 3904.0,
		};
		mockRequest.mockResolvedValue(paged([average]));
		const upsertByEntityId = jest.fn();
		const ctx = {
			...mockCtx(),
			db: { averages: { upsertByEntityId } },
		} as unknown as ExistContext;

		const result = await endpoints().averages.list(ctx, {
			attributes: ['steps'],
			include_historical: true,
			date_min: '2020-01-01',
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'averages/',
			query: {
				attributes: 'steps',
				include_historical: 1,
				date_min: '2020-01-01',
			},
		});
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'steps:2020-04-29',
			expect.objectContaining({ id: 'steps:2020-04-29', overall: 4174.0 }),
		);
		expect(
			ExistEndpointOutputSchemas.averagesList.parse(result).results[0]?.sunday,
		).toBe(3904.0);
	});

	it('drops include_historical when it is false', async () => {
		mockRequest.mockResolvedValue(paged([]));
		await endpoints().averages.list(mockCtx(), { include_historical: false });
		expect(lastCall()[1].query).toBeUndefined();
	});
});

describe('correlations.list', () => {
	const correlation = {
		date: '2022-05-16',
		period: 309,
		offset: 0,
		attribute: 'sleep',
		attribute2: 'sleep_start',
		value: -0.5577851552276848,
		p: 1.1564227190131434e-26,
		percentage: 55.77851552276848,
		stars: 5,
		second_person: 'you spend more time asleep when you go to bed earlier.',
		second_person_elements: ['you spend more time asleep', 'when'],
		attribute_category: null,
		strength_description: 'Quite often go together',
		stars_description: 'Certain to be related',
		description: null,
		occurrence: null,
		rating: null,
	};

	it('sends strong/confident flags and stores each correlation', async () => {
		mockRequest.mockResolvedValue(paged([correlation], 479));
		const upsertByEntityId = jest.fn();
		const ctx = {
			...mockCtx(),
			db: { correlations: { upsertByEntityId } },
		} as unknown as ExistContext;

		const result = await endpoints().correlations.list(ctx, {
			limit: 10,
			confident: true,
			strong: false,
			attribute: 'sleep',
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'correlations/',
			query: { limit: 10, confident: 1, attribute: 'sleep' },
		});
		expect(lastCall()[1].query.strong).toBeUndefined();
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'sleep:sleep_start:2022-05-16',
			expect.objectContaining({ attribute2: 'sleep_start', stars: 5 }),
		);
		expect(
			ExistEndpointOutputSchemas.correlationsList.parse(result).results[0]
				?.rating,
		).toBeNull();
	});

	it('parses a correlation carrying a user rating', () => {
		const parsed = ExistEndpointOutputSchemas.correlationsList.parse(
			paged([
				{
					...correlation,
					rating: { positive: true, rating_type: 50, rating: 'Useful' },
				},
			]),
		);
		expect(parsed.results[0]?.rating?.rating).toBe('Useful');
	});

	it('rejects a limit above the documented maximum of 100', () => {
		expect(
			ExistEndpointInputSchemas.correlationsList.safeParse({ limit: 101 })
				.success,
		).toBe(false);
	});
});

describe('insights.list', () => {
	it('GETs insights with date and priority filters and stores them', async () => {
		const insight = {
			created: '2022-05-16T13:17:03+08:00',
			target_date: '2022-05-16',
			type: {
				name: 'dow_sleep',
				period: 1,
				priority: 1,
				attribute: {
					name: 'sleep',
					label: 'Time asleep',
					group: { name: 'sleep', label: 'Sleep', priority: 3 },
					priority: 1,
					value_type: 3,
					value_type_description: 'Period (min)',
				},
			},
			html: '<div>You slept more than usual</div>',
			text: 'You slept more than usual',
		};
		mockRequest.mockResolvedValue(paged([insight]));
		const upsertByEntityId = jest.fn();
		const ctx = {
			...mockCtx(),
			db: { insights: { upsertByEntityId } },
		} as unknown as ExistContext;

		const result = await endpoints().insights.list(ctx, {
			date_min: '2022-05-01',
			date_max: '2022-05-16',
			priority: 1,
			limit: 100,
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			url: 'insights/',
			query: {
				date_min: '2022-05-01',
				date_max: '2022-05-16',
				priority: 1,
				limit: 100,
			},
		});
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'dow_sleep:2022-05-16',
			expect.objectContaining({ type_name: 'dow_sleep', attribute: 'sleep' }),
		);
		expect(
			ExistEndpointOutputSchemas.insightsList.parse(result).results[0]?.type
				.name,
		).toBe('dow_sleep');
	});

	it('keys an insight with no target date by its creation time', async () => {
		mockRequest.mockResolvedValue(
			paged([
				{
					created: '2022-05-16T13:17:03+08:00',
					target_date: null,
					type: { name: 'week_summary', period: 7, priority: 3 },
					html: '<div>Weekly summary</div>',
					text: 'Weekly summary',
				},
			]),
		);
		const upsertByEntityId = jest.fn();
		const ctx = {
			...mockCtx(),
			db: { insights: { upsertByEntityId } },
		} as unknown as ExistContext;

		const result = await endpoints().insights.list(ctx, {});

		expect(upsertByEntityId).toHaveBeenCalledWith(
			'week_summary:2022-05-16T13:17:03+08:00',
			expect.objectContaining({ target_date: null, attribute: null }),
		);
		expect(
			ExistEndpointOutputSchemas.insightsList.parse(result).results[0]
				?.target_date,
		).toBeNull();
	});
});

describe('event logging', () => {
	it('never records the access token alongside an operation', async () => {
		mockRequest.mockResolvedValue(paged([stepsAttribute]));
		await endpoints().attributes.list(mockCtx(), { groups: ['activity'] });

		const [, event, fields] = mockLog.mock.calls[0] ?? [];
		expect(event).toBe('exist.attributes.list');
		expect(JSON.stringify(fields)).not.toContain(ACCESS_TOKEN);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────────────────────────────────────

describe('error handlers', () => {
	beforeEach(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('classifies by HTTP status', () => {
		expect(classify(new ExistAPIError('nope', 401))).toBe('AUTH_ERROR');
		expect(classify(new ExistAPIError('nope', 403))).toBe('PERMISSION_ERROR');
		expect(classify(new ExistAPIError('nope', 404))).toBe('NOT_FOUND_ERROR');
		expect(classify(new ExistAPIError('nope', 429))).toBe('RATE_LIMIT_ERROR');
		expect(classify(new ExistAPIError('boom', 500))).toBe('DEFAULT');
		expect(classify(new Error('something odd'))).toBe('DEFAULT');
	});

	it('classifies raw ApiErrors too', () => {
		expect(classify(httpError(429, undefined))).toBe('RATE_LIMIT_ERROR');
		expect(classify(httpError(401, undefined))).toBe('AUTH_ERROR');
	});

	it('does not replay writes on rate limits and forwards the retry-after hint', async () => {
		const error = new ExistAPIError(
			'Too Many Requests',
			429,
			undefined,
			60_000,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 60_000 });
	});

	it('handles a bodiless 429, which is what Exist actually returns', async () => {
		const error = new ExistAPIError('Too Many Requests', 429);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: undefined });
	});

	it('never retries auth or permission failures', async () => {
		const context = { operation: 'test' } as never;
		await expect(
			errorHandlers.AUTH_ERROR.handler(new ExistAPIError('nope', 401), context),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.PERMISSION_ERROR.handler(
				new ExistAPIError('nope', 403),
				context,
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not leak the access token in the messages it logs', async () => {
		const warn = jest.spyOn(console, 'warn');
		await errorHandlers.PERMISSION_ERROR.handler(
			new ExistAPIError('Forbidden', 403),
			{ operation: 'attributes.increment' } as never,
		);
		expect(warn.mock.calls.flat().join(' ')).not.toContain(ACCESS_TOKEN);
	});
});

describe('exported OAuth constants', () => {
	it('match the official Exist endpoints', () => {
		expect(EXIST_API_BASE).toBe('https://exist.io/api/2');
		expect(EXIST_OAUTH_AUTHORIZE_URL).toBe('https://exist.io/oauth2/authorize');
		expect(EXIST_OAUTH_TOKEN_URL).toBe('https://exist.io/oauth2/access_token');
		expect(EXIST_MAX_BATCH_SIZE).toBe(35);
	});
});
