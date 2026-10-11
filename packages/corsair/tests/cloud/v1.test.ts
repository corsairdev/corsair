import { CloudApiError, mapV1Error } from '../../core/cloud/v1/errors';
import type { V1Transport } from '../../core/cloud/v1/http';
import { buildInstancePlane } from '../../core/cloud/v1/instance';
import { buildProjectPlane } from '../../core/cloud/v1/project';

function harness(
	responses: Array<{ status?: number; body: unknown }> = [{ body: {} }],
) {
	const calls: Array<{ url: string; init: RequestInit }> = [];
	let next = 0;
	const fetchMock = (async (url: string, init: RequestInit) => {
		calls.push({ url, init });
		const r = responses[Math.min(next++, responses.length - 1)]!;
		return new Response(JSON.stringify(r.body), { status: r.status ?? 200 });
	}) as unknown as typeof fetch;
	const transport: V1Transport = {
		baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
		apiKey: 'ck_cloud_acme.secret',
		fetch: fetchMock,
	};
	return { calls, transport };
}

const headersOf = (init: RequestInit) => init.headers as Record<string, string>;

describe('project plane', () => {
	it('sends the project key as a bearer on every call', async () => {
		const { calls, transport } = harness();
		await buildProjectPlane(transport).project.get();
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/project',
		);
		expect(headersOf(calls[0]!.init).authorization).toBe(
			'Bearer ck_cloud_acme.secret',
		);
	});

	it('pages a collection with limit and starting_after', async () => {
		const { calls, transport } = harness();
		await buildProjectPlane(transport).instances.list({
			limit: 10,
			starting_after: 'app',
		});
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/instances?limit=10&starting_after=app',
		);
	});

	it('omits the query string when no filters are given', async () => {
		const { calls, transport } = harness();
		await buildProjectPlane(transport).mcp.links.list();
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/mcp/links',
		);
	});

	it('sends Idempotency-Key on a mint when one is supplied', async () => {
		const { calls, transport } = harness();
		await buildProjectPlane(transport).mcp.tokens.mint(
			{ instance: 'app', tenant: 'acme' },
			{ idempotencyKey: 'once' },
		);
		expect(headersOf(calls[0]!.init)['idempotency-key']).toBe('once');
	});

	it('pins the contract version when one is configured', async () => {
		const { calls, transport } = harness();
		await buildProjectPlane({
			...transport,
			apiVersion: '2026-10-04',
		}).keys.get();
		expect(headersOf(calls[0]!.init)['corsair-version']).toBe('2026-10-04');
	});

	it('encodes a link id into the path', async () => {
		const { calls, transport } = harness();
		await buildProjectPlane(transport).mcp.links.get('a/b');
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/mcp/links/a%2Fb',
		);
	});
});

describe('instance plane', () => {
	it('rejects an instance key that is not a slug', () => {
		const { transport } = harness();
		expect(() => buildInstancePlane(transport, 'App_1')).toThrow(
			/lowercase slug/,
		);
	});

	it('assembles instance:tenant for a tenant ref', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').tenants.get('acme');
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/tenants/app%3Aacme',
		);
	});

	it('keeps a colon inside a tenant id, since only the head is a slug', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').access.get('usr_1:work');
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/access/app%3Ausr_1%3Awork',
		);
	});

	it('assembles instance:integration:tenant for a connection ref', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').connections.delete(
			'slack',
			'acme',
		);
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/connections/app%3Aslack%3Aacme',
		);
		expect(calls[0]!.init.method).toBe('DELETE');
	});

	it('scopes a collection to the instance', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').connections.list({
			tenant: 'acme',
		});
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/connections?tenant=acme&instance=app',
		);
	});

	it('puts the instance in the body on a create', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').tenants.create({
			tenant_id: 'acme',
		});
		expect(JSON.parse(calls[0]!.init.body as string)).toEqual({
			tenant_id: 'acme',
			instance: 'app',
		});
	});

	it('addresses the signing secret under the instance, not a ref', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').signingSecret.get();
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/instances/app/signing-secret',
		);
	});

	it('nests a delivery under its webhook ref', async () => {
		const { calls, transport } = harness();
		await buildInstancePlane(transport, 'app').webhooks.deliveries.retry(
			'slack',
			'evt_1',
		);
		expect(calls[0]!.url).toBe(
			'https://api.corsair.cloud/v1/projects/acme/webhooks/app%3Aslack/deliveries/evt_1/retry',
		);
	});
});

describe('error mapping', () => {
	it('maps the management envelope onto CloudApiError', async () => {
		const { transport } = harness([
			{
				status: 400,
				body: {
					error: {
						type: 'invalid_request_error',
						code: 'invalid_request',
						message: 'tenant_id is required',
						retryable: false,
						param: 'tenant_id',
						doc_url: 'https://docs.corsair.dev/v1/errors#invalid_request',
						request_id: 'req_1',
					},
				},
			},
		]);
		const err = await buildProjectPlane(transport)
			.project.get()
			.catch((e: unknown) => e);
		expect(err).toBeInstanceOf(CloudApiError);
		expect(err).toMatchObject({
			status: 400,
			code: 'invalid_request',
			type: 'invalid_request_error',
			retryable: false,
			param: 'tenant_id',
			requestId: 'req_1',
		});
	});

	it('marks a 409 idempotency_in_flight retryable, as the server says', () => {
		expect(
			mapV1Error(409, {
				error: { code: 'idempotency_in_flight', retryable: true },
			}).retryable,
		).toBe(true);
	});

	it('maps the runtime envelope, where error is a bare code', () => {
		const err = mapV1Error(404, { error: 'not_found', message: 'nope' });
		expect(err).toMatchObject({ code: 'not_found', message: 'nope' });
	});

	it('keeps the status when the body is in neither shape', () => {
		expect(mapV1Error(502, '<html>bad gateway</html>')).toMatchObject({
			status: 502,
			code: 'internal_error',
			retryable: true,
		});
	});

	it('treats a transport failure as retryable', async () => {
		const transport: V1Transport = {
			baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
			apiKey: 'ck',
			fetch: (async () => {
				throw new Error('socket hang up');
			}) as unknown as typeof fetch,
		};
		const err = await buildProjectPlane(transport)
			.keys.get()
			.catch((e: unknown) => e);
		expect(err).toMatchObject({
			status: 0,
			code: 'request_failed',
			retryable: true,
		});
	});
});
