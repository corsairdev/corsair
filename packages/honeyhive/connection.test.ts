import { AuthMissingError, createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	classicKey,
	HONEYHIVE_API_BASE,
	HONEYHIVE_CONTROL_PLANE_BASE,
	normalizeHoneyHiveBaseUrl,
	redactApiErrorInPlace,
	resolveControlPlaneKey,
	resolveControlPlaneUrl,
	resolveDataPlaneKey,
	resolveDataPlaneUrl,
} from './client';
import type {
	HoneyHiveContext,
	HoneyHiveKeyBuilderContext,
	HoneyHivePluginOptions,
} from './index';
import { honeyhive } from './index';

type Fields = {
	key?: string;
	base_url?: string | null;
	data_plane_api_key?: string | null;
	control_plane_api_key?: string | null;
	options?: HoneyHiveContext['options'];
};

function ctxWith(fields: Fields): HoneyHiveContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: fields.key ?? 'hh_classic_test',
		options: fields.options ?? {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(fields.key ?? 'hh_classic_test'),
			set_api_key: () => Promise.resolve(),
			get_base_url: () => Promise.resolve(fields.base_url ?? null),
			set_base_url: () => Promise.resolve(),
			get_data_plane_api_key: () =>
				Promise.resolve(fields.data_plane_api_key ?? null),
			set_data_plane_api_key: () => Promise.resolve(),
			get_control_plane_api_key: () =>
				Promise.resolve(fields.control_plane_api_key ?? null),
			set_control_plane_api_key: () => Promise.resolve(),
		},
		db: {},
		// `unknown` cast: the test context omits runtime-only members the endpoints never read.
	} as unknown as HoneyHiveContext;
}

describe('HoneyHive hosts', () => {
	it('defaults to the live data plane and control plane hosts', async () => {
		// api.honeyhive.ai has no DNS record; these are the hosts in HoneyHive's OpenAPI specs.
		expect(HONEYHIVE_API_BASE).toBe('https://api.dp1.us.honeyhive.ai');
		expect(HONEYHIVE_CONTROL_PLANE_BASE).toBe('https://api.cp.us.honeyhive.ai');
		const ctx = ctxWith({});
		await expect(resolveDataPlaneUrl(ctx)).resolves.toBe(HONEYHIVE_API_BASE);
		expect(resolveControlPlaneUrl(ctx)).toBe(HONEYHIVE_CONTROL_PLANE_BASE);
	});

	it("uses the account's base_url for a dedicated data plane", async () => {
		const ctx = ctxWith({ base_url: 'https://api.dp2.eu.example.com/' });
		await expect(resolveDataPlaneUrl(ctx)).resolves.toBe(
			'https://api.dp2.eu.example.com',
		);
	});

	it('rejects a base_url the key must not be sent to', () => {
		expect(() => normalizeHoneyHiveBaseUrl('http://api.example.com')).toThrow(
			'https',
		);
		expect(() => normalizeHoneyHiveBaseUrl('not a url')).toThrow('https');
		expect(() =>
			normalizeHoneyHiveBaseUrl('https://user:pw@api.example.com'),
		).toThrow('credentials');
	});
});

describe('HoneyHive key routing', () => {
	it('sends the data plane key to project-scoped routes', async () => {
		const ctx = ctxWith({ data_plane_api_key: 'hh_fgdp_abc' });
		await expect(resolveDataPlaneKey(ctx)).resolves.toBe('hh_fgdp_abc');
	});

	it('uses the main key when it is already a data plane key', async () => {
		const ctx = ctxWith({ key: 'hh_fgdp_main' });
		await expect(resolveDataPlaneKey(ctx)).resolves.toBe('hh_fgdp_main');
	});

	it('never sends a classic project key to project-scoped routes', async () => {
		const ctx = ctxWith({ key: 'hh_classic' });
		await expect(resolveDataPlaneKey(ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('requires a control plane key for project management', async () => {
		await expect(
			resolveControlPlaneKey(ctxWith({ key: 'hh_classic' })),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			resolveControlPlaneKey(ctxWith({ control_plane_api_key: 'hh_fgcp_x' })),
		).resolves.toBe('hh_fgcp_x');
	});
});

describe('HoneyHive plane-only connections and hook keys', () => {
	// `unknown` cast: the keyBuilder reads only `keys`; the rest of the context is runtime-only.
	const keyCtx = (fields: Fields) =>
		({
			keys: ctxWith(fields).keys,
		}) as unknown as HoneyHiveKeyBuilderContext;
	type KeyBuilderFn = (
		ctx: HoneyHiveKeyBuilderContext,
		source: 'endpoint',
	) => Promise<string>;
	// `unknown` cast: the public plugin type does not expose keyBuilder's parameters.
	const keyBuilderOf = (options: HoneyHivePluginOptions = {}) =>
		honeyhive(options).keyBuilder as unknown as KeyBuilderFn;
	const noApiKey = (fields: Fields) => {
		const ctx = keyCtx(fields);
		// `unknown` cast: overrides one accessor on the typed test keys.
		(ctx.keys as unknown as { get_api_key: () => Promise<null> }).get_api_key =
			() => Promise.resolve(null);
		return ctx;
	};

	it('passes a data plane key on when the account has no api_key', async () => {
		const keyBuilder = keyBuilderOf();
		await expect(
			keyBuilder(noApiKey({ data_plane_api_key: 'hh_fgdp_only' }), 'endpoint'),
		).resolves.toBe('hh_fgdp_only');
		await expect(
			keyBuilder(
				noApiKey({ control_plane_api_key: 'hh_fgcp_only' }),
				'endpoint',
			),
		).resolves.toBe('hh_fgcp_only');
	});

	it('still raises AuthMissingError when the account has no key at all', async () => {
		await expect(
			keyBuilderOf()(noApiKey({}), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('takes a plane key from plugin options without stored credentials', async () => {
		const keyBuilder = keyBuilderOf({ dataPlaneKey: 'hh_fgdp_opt' });
		// `unknown` cast: an empty context stands in for a connection with no key store.
		await expect(
			keyBuilder({} as unknown as HoneyHiveKeyBuilderContext, 'endpoint'),
		).resolves.toBe('hh_fgdp_opt');
	});

	it('routes a plane-only key to its resolver and keeps it off classic routes', async () => {
		const ctx = ctxWith({ key: 'hh_fgdp_only' });
		await expect(resolveDataPlaneKey(ctx)).resolves.toBe('hh_fgdp_only');
		expect(() => classicKey(ctx)).toThrow(AuthMissingError);
		expect(() => classicKey(ctxWith({ key: 'hh_fgcp_only' }))).toThrow(
			AuthMissingError,
		);
		expect(classicKey(ctxWith({ key: 'hh_classic' }))).toBe('hh_classic');
	});

	it('prefers a plane key a before hook put in ctx.key over the stored one', async () => {
		await expect(
			resolveDataPlaneKey(
				ctxWith({ key: 'hh_fgdp_hook', data_plane_api_key: 'hh_fgdp_stored' }),
			),
		).resolves.toBe('hh_fgdp_hook');
		await expect(
			resolveControlPlaneKey(
				ctxWith({
					key: 'hh_fgcp_hook',
					control_plane_api_key: 'hh_fgcp_stored',
				}),
			),
		).resolves.toBe('hh_fgcp_hook');
	});
});

describe('HoneyHive plane-only connections through bound endpoints', () => {
	afterEach(() => jest.restoreAllMocks());

	// `unknown` because these mock responses stand in for endpoints with different JSON shapes.
	const respond = (body: Record<string, unknown>) =>
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
	const sentAuth = (fetchMock: jest.SpyInstance) => {
		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return new Headers(init.headers).get('authorization');
	};

	it('runs a project-scoped data plane call with only a data plane key', async () => {
		const fetchMock = respond({ datasets: [] });
		const corsair = createCorsair({
			plugins: [honeyhive({ dataPlaneKey: 'hh_fgdp_only' })],
		});
		await corsair.honeyhive.api.datasets.list({ project_id: 'p-1' });
		expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
			'/v1/projects/p-1/datasets',
		);
		expect(sentAuth(fetchMock)).toBe('Bearer hh_fgdp_only');
	});

	it('runs a control plane call with only a control plane key, after an empty data plane option', async () => {
		const fetchMock = respond({ success: true, project: { id: 'p-1' } });
		const corsair = createCorsair({
			plugins: [
				honeyhive({ dataPlaneKey: '', controlPlaneKey: 'hh_fgcp_only' }),
			],
		});
		await corsair.honeyhive.api.projects.get({ project_id: 'p-1' });
		expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
			'api.cp.us.honeyhive.ai/v1/projects/p-1',
		);
		expect(sentAuth(fetchMock)).toBe('Bearer hh_fgcp_only');
	});

	it('refuses a classic route with only a plane key, before any request', async () => {
		const fetchMock = respond({ success: true });
		const corsair = createCorsair({
			plugins: [honeyhive({ dataPlaneKey: 'hh_fgdp_only' })],
		});
		await expect(
			corsair.honeyhive.api.events.create({
				event_type: 'model',
				inputs: { prompt: 'hi' },
			}),
		).rejects.toThrow('classic API key');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('HoneyHive error payloads', () => {
	it('drops the request body (customer inputs) from a propagated ApiError', () => {
		const error = new ApiError(
			{
				method: 'POST',
				url: '/v1/events',
				body: { inputs: { email: 'alice@example.com', prompt: 'private' } },
			},
			{
				url: 'https://api.dp1.us.honeyhive.ai/v1/events',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { message: 'invalid' },
			},
			'Bad Request',
		);
		const out = redactApiErrorInPlace(error, 'hh_classic');
		expect(out).toBe(error);
		expect(out.status).toBe(400);
		expect(JSON.stringify(out.request)).not.toContain('alice@example.com');
		expect(JSON.stringify(out.request)).not.toContain('private');
	});

	it('drops customer query values from a propagated ApiError', () => {
		const filters = JSON.stringify([
			{ field: 'user_properties.email', value: 'alice@example.com' },
		]);
		const error = new ApiError(
			{
				method: 'GET',
				url: '/v1/runs/run-1/metrics',
				query: { filters },
			},
			{
				url: `https://api.dp1.us.honeyhive.ai/v1/runs/run-1/metrics?filters=${encodeURIComponent(filters)}`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'slow down' },
			},
			'Too Many Requests',
		);
		const out = redactApiErrorInPlace(error, 'hh_classic');
		expect(out).toBe(error);
		expect(out).toBeInstanceOf(ApiError);
		expect(out.status).toBe(429);
		expect(out.url).toBe(
			'https://api.dp1.us.honeyhive.ai/v1/runs/run-1/metrics',
		);
		expect(JSON.stringify(out.request)).not.toContain('alice');
		expect(out.url).not.toContain('alice');
	});
});
