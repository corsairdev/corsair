import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	HONEYHIVE_API_BASE,
	HONEYHIVE_CONTROL_PLANE_BASE,
	normalizeHoneyHiveBaseUrl,
	redactApiErrorInPlace,
	resolveControlPlaneKey,
	resolveControlPlaneUrl,
	resolveDataPlaneKey,
	resolveDataPlaneUrl,
} from './client';
import type { HoneyHiveContext } from './index';

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
});
