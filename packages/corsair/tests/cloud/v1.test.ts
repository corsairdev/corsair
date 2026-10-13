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
	it('rejects an instance key that is not a slug, at either entry point', () => {
		const { transport } = harness();
		for (const bad of ['App_1', '1app', 'a'.repeat(33), 'a:b']) {
			expect(() => buildInstancePlane(transport, bad)).toThrow(
				/not a valid instance key/,
			);
			expect(() =>
				buildProjectPlane(transport).instances.create({ instance_key: bad }),
			).toThrow(/not a valid instance key/);
		}
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

describe('request options', () => {
	// Every method takes `options` behind an optional `body`, and twelve of the
	// forty-seven once dropped it. These cover both planes and both arities.
	it('cancels an in-flight bodyless write when the caller aborts', async () => {
		const transport: V1Transport = {
			baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
			apiKey: 'ck',
			fetch: (async (_url: string, init: RequestInit) =>
				new Promise((_resolve, reject) => {
					(init.signal as AbortSignal).addEventListener('abort', () =>
						reject(new Error('aborted')),
					);
				})) as unknown as typeof fetch,
		};
		const controller = new AbortController();
		const pending = buildInstancePlane(transport, 'app')
			.reconcile({ signal: controller.signal })
			.catch((e: unknown) => e);
		controller.abort();
		await expect(pending).resolves.toBeInstanceOf(Error);
	});

	it('forwards options from every method that accepts them', async () => {
		const { calls, transport } = harness();
		const project = buildProjectPlane(transport);
		const instance = buildInstancePlane(transport, 'app');
		const opts = { requestId: 'req_mine' };
		const bodyless: Array<() => Promise<unknown>> = [
			() => project.project.get(opts),
			() => project.keys.get(opts),
			() => project.instances.list({}, opts),
			() => project.integrations.catalog({}, opts),
			() => project.mcp.links.list({}, opts),
			() => instance.tenants.list({}, opts),
			() => instance.access.list({}, opts),
			() => instance.connections.list({}, opts),
			() => instance.integrations.list({}, opts),
			() => instance.webhooks.list({}, opts),
			() => instance.webhooks.deliveries.list('slack', {}, opts),
			() => instance.signingSecret.get(opts),
			() => instance.reconcile(opts),
		];
		for (const call of bodyless) await call();
		const sent = calls.map(
			(c) => headersOf(c.init)['x-corsair-request-id'] ?? 'dropped',
		);
		expect(sent).toEqual(bodyless.map(() => 'req_mine'));
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

	it('reads the request id from the header when the body has no envelope', async () => {
		const transport: V1Transport = {
			baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
			apiKey: 'ck',
			fetch: (async () =>
				new Response('<html>bad gateway</html>', {
					status: 502,
					headers: { 'request-id': 'req_front_door' },
				})) as unknown as typeof fetch,
		};
		const err = await buildProjectPlane(transport)
			.keys.get()
			.catch((e: unknown) => e);
		expect(err).toMatchObject({
			status: 502,
			code: 'internal_error',
			requestId: 'req_front_door',
		});
	});

	const losesBody = (): V1Transport => ({
		baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
		apiKey: 'ck',
		fetch: (async () => ({
			ok: true,
			status: 200,
			headers: new Headers(),
			text: async () => {
				throw new Error('socket reset mid-body');
			},
		})) as unknown as typeof fetch,
	});

	it('keeps a read retryable when the body is lost after the response', async () => {
		const err = await buildProjectPlane(losesBody())
			.keys.get()
			.catch((e: unknown) => e);
		expect(err).toBeInstanceOf(CloudApiError);
		expect(err).toMatchObject({
			status: 200,
			code: 'request_failed',
			retryable: true,
		});
	});

	// The case the read must not weaken: a POST with no idempotency key may
	// have landed, and a lost body says nothing either way.
	it('does not call an unsafe write retryable past the response', async () => {
		const err = await buildProjectPlane(losesBody())
			.mcp.tokens.mint({ instance: 'app', tenant: 'acme' })
			.catch((e: unknown) => e);
		expect(err).toMatchObject({ status: 200, retryable: false });
	});

	it('does not send the request when the caller signal is already aborted', async () => {
		const fetchMock = jest.fn();
		const controller = new AbortController();
		controller.abort();
		const transport: V1Transport = {
			baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
			apiKey: 'ck',
			fetch: fetchMock as unknown as typeof fetch,
		};
		await buildProjectPlane(transport)
			.instances.delete('app', { signal: controller.signal })
			.catch(() => undefined);
		const [[, init]] = fetchMock.mock.calls as [[string, RequestInit]];
		expect((init.signal as AbortSignal).aborted).toBe(true);
	});

	it('aborts a body that stalls past the timeout', async () => {
		const transport: V1Transport = {
			baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
			apiKey: 'ck',
			timeoutMs: 20,
			fetch: (async (_url: string, init: RequestInit) => ({
				ok: true,
				status: 200,
				headers: new Headers(),
				text: () =>
					new Promise((_resolve, reject) => {
						(init.signal as AbortSignal).addEventListener('abort', () =>
							reject(new Error('aborted')),
						);
					}),
			})) as unknown as typeof fetch,
		};
		const err = await buildProjectPlane(transport)
			.keys.get()
			.catch((e: unknown) => e);
		expect(err).toMatchObject({ status: 200, retryable: true });
	});

	it('treats a 429 with no envelope as retryable', async () => {
		const { transport } = harness([{ status: 429, body: { nope: true } }]);
		const err = await buildProjectPlane(transport)
			.keys.get()
			.catch((e: unknown) => e);
		expect(err).toMatchObject({ status: 429, retryable: true });
	});

	it('treats a 429 carrying a bare runtime code as retryable', () => {
		expect(mapV1Error(429, { error: 'rate_limit_exceeded' })).toMatchObject({
			retryable: true,
		});
	});

	it('will not retry a POST that failed before the server answered', async () => {
		const transport: V1Transport = {
			baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
			apiKey: 'ck',
			fetch: (async () => {
				throw new Error('socket hang up');
			}) as unknown as typeof fetch,
		};
		const plane = buildProjectPlane(transport);
		// A mint cannot be revoked, so repeating one that may have landed is
		// worse than failing.
		await expect(
			plane.mcp.tokens.mint({ instance: 'app', tenant: 'acme' }),
		).rejects.toMatchObject({ status: 0, retryable: false });
		// Unless the server will dedupe it.
		await expect(
			plane.mcp.tokens.mint(
				{ instance: 'app', tenant: 'acme' },
				{ idempotencyKey: 'key_1' },
			),
		).rejects.toMatchObject({ status: 0, retryable: true });
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
