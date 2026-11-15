import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { LiveSessionAPIError, makeLiveSessionRequest } from './client';
import type { LiveSessionContext } from './index';
import { liveSessionEndpointSchemas, livesession } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

const mockCtx = {
	key: 'test-token',
	$getAccountId: async () => 'test-account-id',
	database: undefined,
	endpoints: {},
} as LiveSessionContext;

const session = {
	id: 'session-1',
	website_id: 'website-1',
	session_url: 'https://app.livesession.io/app/session/visitor-1/session-1',
	creation_timestamp: 1_700_000_000,
	duration: 120,
	end_timestamp: 1_700_000_120,
	active_time: 60,
	end_url: 'https://example.com/pricing',
	expiration_timestamp: 1_700_100_000,
	last_event_timestamp: 1_700_000_120,
	product: 'web',
	device: 'desktop',
	tags: ['vip'],
	last_seen_page_view_id: 'page-view-1',
	seen: true,
	referrer: 'https://www.google.com/',
	start_url: 'https://example.com/',
	visitor_first_session: false,
	engagment_score: 88,
	visitor: {
		id: 'visitor-1',
		ip: '203.0.113.10',
		geolocation: {
			country_code: 'PL',
			city: 'Wroclaw',
			region: 'Dolnoslaskie',
		},
		name: 'John Doe',
		email: 'john.doe@example.com',
		email_hash: 'hash',
		params: [{ name: 'plan', value: 'pro' }],
		last_session_timestamp: 1_700_000_120,
		first_session_timestamp: 1_600_000_000,
	},
	resolution: { height: 1080, width: 1920, resolution: '1920x1080' },
	os: { name: 'macOS', version: '14' },
	browser: { description: 'Chrome 120', name: 'Chrome', version: '120' },
	utm: {
		source: 'google',
		medium: 'cpc',
		campaign: 'launch',
		term: 'analytics',
		content: 'ad',
	},
	page_views_statistics: { count: 3 },
	events_statistics: {
		clicks: 10,
		error_clicks: 1,
		rage_clicks: 2,
		error_logs: 0,
		net_errors: 1,
	},
};

const sessionsResponse = {
	total: 51,
	page: { num: 2, size: 50 },
	sessions: [session],
};

const alert = {
	alert_id: 'alert-1',
	name: 'Rage clicks',
	events: [{ kind: 21, value: '5' }],
	provider: 'webhooks',
	webhook_id: 'webhook-1',
	enabled: true,
	creation_date: '2026-01-01T00:00:00Z',
};

const webhook = {
	webhook_id: 'webhook-1',
	url: 'https://example.com/hooks/livesession',
	website: 'Example',
	website_id: 'website-1',
	version: 'v1.0',
	enabled: true,
	created_date: 1_700_000_000,
	created_by: 'john@example.com',
};

const website = { website_id: 'website-1', host: 'example.com' };

describe('LiveSession plugin shape', () => {
	it('exposes the eleven documented REST operations and no inbound webhook handlers', () => {
		const plugin = livesession();
		const paths = Object.entries(plugin.endpointMeta ?? {}).map(
			([path]) => path,
		);

		expect(paths).toHaveLength(11);
		expect(paths).toEqual(
			expect.arrayContaining([
				'sessions.list',
				'alerts.list',
				'alerts.create',
				'alerts.update',
				'alerts.delete',
				'webhooks.list',
				'webhooks.create',
				'webhooks.update',
				'webhooks.delete',
				'websites.list',
				'websites.create',
			]),
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('LiveSession HTTP client and endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
		mockRequest.mockResolvedValue(sessionsResponse);
	});

	it('sends the PAT as TOKEN and forwards pagination and filters to GET /sessions', async () => {
		const input = {
			page: 2,
			size: 50,
			email: 'john.doe@example.com',
			visitor_id: 'visitor-1',
			tz: 'Europe/Warsaw',
			date_from: 'TODAY-30DAYS' as const,
			date_to: '2026-01-31T23:59:59Z',
		};

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.sessions.list(mockCtx, input);

		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://api.livesession.io/v1',
			TOKEN: 'test-token',
			HEADERS: { Accept: 'application/json' },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/sessions',
				query: input,
			}),
		);
		expect(mockRequest.mock.calls[0]?.[2]).toEqual(
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 3 }),
			}),
		);
		expect(result.page.num).toBe(2);
		expect(result.sessions?.[0]?.visitor?.geolocation?.city).toBe('Wroclaw');
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'livesession.sessions.list',
			{},
			'completed',
		);
	});

	it('lists alerts and preserves extra fields on returned events', async () => {
		const extendedAlert = {
			...alert,
			events: [{ kind: 21, value: '5', provider_extra: 'preserved' }],
		};
		mockRequest.mockResolvedValue([extendedAlert]);

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.alerts.list(mockCtx, {});

		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			TOKEN: 'test-token',
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/alerts' }),
		);
		expect(result).toEqual([extendedAlert]);
	});

	it('accepts alert providers and event kinds LiveSession adds later', async () => {
		const futureAlert = {
			...alert,
			provider: 'teams',
			events: [{ kind: 99 }, { kind: 21, value: '5' }],
		};
		mockRequest.mockResolvedValue([futureAlert]);

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.alerts.list(mockCtx, {});

		expect(result).toEqual([futureAlert]);
	});

	it('does not save webhook URLs or alert customer data in completion events', async () => {
		mockRequest.mockResolvedValueOnce(webhook);
		await livesession({ key: 'test-token' }).endpoints!.webhooks.create(
			mockCtx,
			{
				url: 'https://example.com/hook?token=secret',
				website_id: 'customer-website',
				version: 'v1.0',
			},
		);
		mockRequest.mockResolvedValueOnce(alert);
		await livesession({ key: 'test-token' }).endpoints!.alerts.create(mockCtx, {
			name: 'person@example.com',
			events: [{ kind: 21, value: 'customer data' }],
			provider: 'webhooks',
			webhook_id: 'webhook-1',
		});

		expect(mockLogEvent).toHaveBeenNthCalledWith(
			1,
			mockCtx,
			'livesession.webhooks.create',
			{},
			'completed',
		);
		expect(mockLogEvent).toHaveBeenNthCalledWith(
			2,
			mockCtx,
			'livesession.alerts.create',
			{},
			'completed',
		);
	});

	it('creates an alert with a JSON body and no transport retries for writes', async () => {
		mockRequest.mockResolvedValue(alert);
		const input = {
			name: 'Rage clicks',
			events: [{ kind: 21 as const, value: '5' }],
			provider: 'webhooks' as const,
			webhook_id: 'webhook-1',
		};

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.alerts.create(mockCtx, input);

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/alerts',
				body: input,
			}),
		);
		expect(mockRequest.mock.calls[0]?.[2]).toEqual(
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
		expect(result.alert_id).toBe('alert-1');
	});

	it('updates an alert at its encoded path and keeps only body fields in the payload', async () => {
		mockRequest.mockResolvedValue(alert);

		await livesession({ key: 'test-token' }).endpoints!.alerts.update(mockCtx, {
			id: 'alert 1',
			name: 'Updated alert',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/alerts/alert%201',
				body: { name: 'Updated alert' },
			}),
		);
	});

	it('deletes alerts and returns the documented acknowledgement', async () => {
		mockRequest.mockResolvedValue({ alert_id: 'alert-1', deleted: true });

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.alerts.delete(mockCtx, { id: 'alert-1' });

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'DELETE', url: '/alerts/alert-1' }),
		);
		expect(result).toEqual({ alert_id: 'alert-1', deleted: true });
	});

	it('lists and creates webhooks with the documented routes', async () => {
		mockRequest.mockResolvedValueOnce([webhook]);
		const list = await livesession({
			key: 'test-token',
		}).endpoints!.webhooks.list(mockCtx, {});

		mockRequest.mockResolvedValueOnce(webhook);
		const created = await livesession({
			key: 'test-token',
		}).endpoints!.webhooks.create(mockCtx, {
			url: 'https://example.com/hooks/livesession',
			website_id: 'website-1',
			version: 'v1.0',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/webhooks' }),
		);
		expect(mockRequest.mock.calls[1]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/webhooks',
				body: {
					url: 'https://example.com/hooks/livesession',
					website_id: 'website-1',
					version: 'v1.0',
				},
			}),
		);
		expect(list[0]?.webhook_id).toBe('webhook-1');
		expect(created.webhook_id).toBe('webhook-1');
	});

	it('updates a webhook with the required version query parameter', async () => {
		mockRequest.mockResolvedValue(webhook);

		await livesession({ key: 'test-token' }).endpoints!.webhooks.update(
			mockCtx,
			{
				id: 'webhook-1',
				url: 'https://example.com/hooks/livesession',
				website_id: 'website-1',
				version: 'v1.0',
			},
		);

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/webhooks/webhook-1',
				query: { version: 'v1.0' },
				body: {
					url: 'https://example.com/hooks/livesession',
					website_id: 'website-1',
					version: 'v1.0',
				},
			}),
		);
	});

	it('deletes a webhook and returns the documented acknowledgement', async () => {
		mockRequest.mockResolvedValue({ webhook_id: 'webhook-1', deleted: true });

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.webhooks.delete(mockCtx, { id: 'webhook-1' });

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				url: '/webhooks/webhook-1',
			}),
		);
		expect(result.deleted).toBe(true);
	});

	it('lists and creates websites', async () => {
		mockRequest.mockResolvedValueOnce([website]);
		await livesession({ key: 'test-token' }).endpoints!.websites.list(
			mockCtx,
			{},
		);

		mockRequest.mockResolvedValueOnce(website);
		await livesession({ key: 'test-token' }).endpoints!.websites.create(
			mockCtx,
			{ host: 'example.com', description: 'Marketing site' },
		);

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/websites' }),
		);
		expect(mockRequest.mock.calls[1]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/websites',
				body: { host: 'example.com', description: 'Marketing site' },
			}),
		);
	});
});

describe('LiveSession input boundaries', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
	});

	it('rejects path identifiers that could escape or reshape the route', async () => {
		const deleteAlert = liveSessionEndpointSchemas['alerts.delete']?.input;
		const badIds = ['.', '..', 'a/b', 'a\\b', "a'b", 'a"b', ' a', 'a '];

		for (const id of badIds) {
			expect(deleteAlert!.safeParse({ id }).success).toBe(false);
		}
		expect(deleteAlert!.safeParse({ id: 'alert-1' }).success).toBe(true);

		await expect(
			(async () =>
				livesession({ key: 'test-token' }).endpoints!.alerts.delete(mockCtx, {
					id: '../alerts/1',
				}))(),
		).rejects.toThrow(/input validation failed/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('enforces the documented page and size bounds and accepts relative dates', () => {
		const list = liveSessionEndpointSchemas['sessions.list']?.input;

		expect(list!.safeParse({ page: -1 }).success).toBe(false);
		expect(list!.safeParse({ page: 10001 }).success).toBe(false);
		expect(list!.safeParse({ size: 0 }).success).toBe(false);
		expect(list!.safeParse({ size: 101 }).success).toBe(false);
		expect(list!.safeParse({ size: 100, page: 10000 }).success).toBe(true);
		expect(list!.safeParse({ date_from: 'TODAY-7DAYS' }).success).toBe(true);
		expect(list!.safeParse({ date_from: '2026-01-01T10:00:00Z' }).success).toBe(
			true,
		);
		expect(list!.safeParse({ date_from: 'last week' }).success).toBe(false);
		// LiveSession ignores a date without a time (live run 11-15).
		expect(list!.safeParse({ date_from: '2026-01-01' }).success).toBe(false);
		// LiveSession also ignores impossible values instead of answering 400 (live run 11-15).
		for (const bad of [
			'2026-02-30T10:00:00Z',
			'2026-13-01T10:00:00Z',
			'2026-01-01T24:00:00Z',
			'2026-01-01T10:60:00Z',
			'2026-01-01T10:00:61Z',
			'2026-01-01T10:00:00+99:99',
		]) {
			expect(list!.safeParse({ date_from: bad }).success).toBe(false);
		}
		expect(
			list!.safeParse({ date_from: '2024-02-29T23:59:59.5+05:30' }).success,
		).toBe(true);
		expect(list!.safeParse({ date_to: '2026-11-15T08:00-0800' }).success).toBe(
			true,
		);
	});

	it('requires the provider-specific destination on alert creation', () => {
		const create = liveSessionEndpointSchemas['alerts.create']?.input;
		const base = {
			name: 'Alert',
			events: [{ kind: 25, value: 'error' }],
		};

		expect(create!.safeParse({ ...base, provider: 'slack' }).success).toBe(
			false,
		);
		expect(create!.safeParse({ ...base, provider: 'webhooks' }).success).toBe(
			false,
		);
		expect(
			create!.safeParse({
				...base,
				provider: 'slack',
				slack_channel_id: 'C123',
			}).success,
		).toBe(true);
		expect(
			create!.safeParse({
				...base,
				provider: 'webhooks',
				webhook_id: 'webhook-1',
			}).success,
		).toBe(true);
	});

	it('rejects undocumented webhook versions on update', () => {
		const update = liveSessionEndpointSchemas['webhooks.update']?.input;
		const base = {
			id: 'webhook-1',
			url: 'https://example.com/hook',
			website_id: 'website-1',
		};

		expect(update!.safeParse({ ...base, version: 'v2.0' }).success).toBe(false);
		expect(update!.safeParse({ ...base, version: 'v1.0' }).success).toBe(true);
	});
});

describe('LiveSession output validation and errors', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
	});

	it('rejects a sessions response that does not match the documented shape', async () => {
		mockRequest.mockResolvedValue({ sessions: 'not-an-array' });

		await expect(
			livesession({ key: 'test-token' }).endpoints!.sessions.list(mockCtx, {}),
		).rejects.toThrow(/output validation failed/);
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('parses a real new session with null tags and empty strings', async () => {
		// Shape from the live run (11-15); ids, URL and location replaced.
		const realSession = {
			id: 'session-live-1',
			website_id: 'website-1',
			session_url:
				'https://app.livesession.io/app/sessions/visitor-1/session-live-1',
			creation_timestamp: 1794702468003,
			duration: 0,
			end_timestamp: 0,
			active_time: 0,
			end_url: '',
			expiration_timestamp: 0,
			last_event_timestamp: 0,
			product: '',
			device: 'Desktop',
			tags: null,
			seen: false,
			referrer: '',
			start_url: 'http://127.0.0.1:8765/',
			visitor_first_session: true,
			engagment_score: 2,
			visitor: {
				id: 'visitor-1',
				ip: '',
				geolocation: {
					country_code: 'PL',
					city: 'Wroclaw',
					region: 'Dolnoslaskie',
				},
				last_session_timestamp: 1794702468003,
				first_session_timestamp: 1794702468003,
			},
			resolution: { height: 720, width: 1280, resolution: '' },
			os: { name: 'Linux', version: '' },
			browser: {
				description: 'Chrome 155.0.0.0 on Linux 64-bit',
				name: 'Chrome',
				version: '155.0.0.0',
			},
			utm: { source: '', medium: '', campaign: '', term: '', content: '' },
			page_views_statistics: { count: 0 },
			events_statistics: {
				clicks: 0,
				error_clicks: 0,
				rage_clicks: 0,
				error_logs: 0,
				net_errors: 0,
			},
		};
		mockRequest.mockResolvedValue({
			total: 1,
			page: { num: 0, size: 25 },
			sessions: [realSession],
		});

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.sessions.list(mockCtx, { date_from: 'TODAY' });

		expect(result.sessions?.[0]?.tags).toBeNull();
		expect(result.sessions?.[0]?.device).toBe('Desktop');
	});

	it('accepts the null sessions list LiveSession returns for an empty result', async () => {
		// Real response from the live run (11-15): an empty result came back as null.
		mockRequest.mockResolvedValue({
			total: 0,
			page: { num: 0, size: 25 },
			sessions: null,
		});

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.sessions.list(mockCtx, { email: 'nobody@example.com' });

		expect(result.total).toBe(0);
		expect(result.sessions).toBeNull();
	});

	it('preserves provider fields that are not in the documented schema', async () => {
		mockRequest.mockResolvedValue({
			...sessionsResponse,
			sessions: [{ ...session, future_field: 'kept' }],
		});

		const result = await livesession({
			key: 'test-token',
		}).endpoints!.sessions.list(mockCtx, {});

		expect(result.sessions?.[0]).toMatchObject({ future_field: 'kept' });
	});

	it('wraps transport failures with the provider error type', async () => {
		mockRequest.mockRejectedValue(new Error('network unavailable'));

		await expect(
			livesession({ key: 'test-token' }).endpoints!.websites.list(mockCtx, {}),
		).rejects.toBeInstanceOf(LiveSessionAPIError);
	});

	it('drops the sent query and body from core ApiError but keeps status and Retry-After', async () => {
		const email = 'john.doe@example.com';
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'GET',
					url: '/sessions',
					query: { email },
				},
				{
					url: `https://api.livesession.io/v1/sessions?email=${encodeURIComponent(email)}`,
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: { message: 'slow down' } },
				},
				'Too Many Requests',
				{ retryAfter: 2 },
			),
		);

		const error = await livesession({ key: 'test-token' })
			.endpoints!.sessions.list(mockCtx, { email })
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(429);
		expect(apiError.retryAfter).toBe(2);
		expect(apiError.body).toEqual({ error: { message: 'slow down' } });
		expect(apiError.url).toBe('https://api.livesession.io/v1/sessions');
		expect(apiError.request.query).toBeUndefined();
		expect(JSON.stringify(apiError)).not.toContain('john.doe');
		expect(String(apiError.stack)).not.toContain('john.doe');
	});

	it('drops a webhook URL sent in the body from core ApiError', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/webhooks',
					body: { url: 'https://example.com/hook?token=secret' },
				},
				{
					url: 'https://api.livesession.io/v1/webhooks',
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: { error: { type: 'validation_error' } },
				},
				'Bad Request',
			),
		);

		const error = await livesession({ key: 'test-token' })
			.endpoints!.webhooks.create(mockCtx, {
				url: 'https://example.com/hook?token=secret',
				website_id: 'website-1',
				version: 'v1.0',
			})
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect((error as ApiError).request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('token=secret');
	});

	it('keeps core ApiError as an ApiError for the rate-limit handler', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/sites' },
			{
				url: 'https://api.livesession.io/v1/websites',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: { message: 'slow down' } },
			},
			'Too Many Requests',
			{ retryAfter: 2 },
		);
		mockRequest.mockRejectedValue(apiError);

		const error = await livesession({ key: 'test-token' })
			.endpoints!.websites.list(mockCtx, {})
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).retryAfter).toBe(2);
		expect((error as ApiError).message).toBe('Too Many Requests');
	});

	it('rejects requests when no token reaches the transport', async () => {
		await expect(makeLiveSessionRequest('/sessions', '   ')).rejects.toThrow(
			/API token is required/,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
