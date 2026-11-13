import { makeElorusRequest } from './client';
import { ElorusEndpoints } from './endpoints';
import { elorusEndpointMeta } from './endpoints/meta';
import { elorusOperationSpecs } from './endpoints/specs';
import { elorusOperationSchemas } from './endpoints/types';

const operationKeys = Object.keys(elorusOperationSpecs).sort();
const endpointKeys = [
	...Object.keys(ElorusEndpoints.v11).map((key) => `v11.${key}`),
	...Object.keys(ElorusEndpoints.v12).map((key) => `v12.${key}`),
].sort();

describe('Elorus REST operation coverage', () => {
	it('registers every official v1.1 and v1.2 operation exactly once', () => {
		expect(Object.keys(ElorusEndpoints.v11)).toHaveLength(124);
		expect(Object.keys(ElorusEndpoints.v12)).toHaveLength(333);
		expect(operationKeys).toEqual(endpointKeys);
		expect(Object.keys(elorusOperationSchemas).sort()).toEqual(operationKeys);
		expect(Object.keys(elorusEndpointMeta).sort()).toEqual(operationKeys);
	});

	it('pins every operation to its documented version, method, and route', () => {
		for (const [key, spec] of Object.entries(elorusOperationSpecs)) {
			expect(
				spec.route.startsWith(`/${spec.version === 'v11' ? 'v1.1' : 'v1.2'}/`),
			).toBe(true);
			expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).toContain(spec.method);
			expect(key).toBe(`${spec.version}.${spec.operationId}`);
			expect(Object.hasOwn(elorusOperationSchemas, key)).toBe(true);
		}
	});

	it('classifies reads, writes, destructive calls, and response modes', () => {
		for (const spec of Object.values(elorusOperationSpecs)) {
			if (spec.method === 'GET') expect(spec.riskLevel).toBe('read');
			if (spec.method === 'DELETE') expect(spec.riskLevel).toBe('destructive');
			if (spec.mode === 'binary') {
				expect(
					spec.route.includes('/pdf/') || spec.route.includes('/file/'),
				).toBe(true);
			}
		}
		expect(
			Object.values(elorusOperationSpecs).filter((x) => x.mode === 'multipart'),
		).toHaveLength(11);
		expect(
			Object.values(elorusOperationSpecs).filter((x) => x.mode === 'binary'),
		).toHaveLength(27);
		expect(
			Object.values(elorusOperationSpecs).filter((x) => x.mode === 'empty'),
		).toHaveLength(75);
		expect(elorusOperationSpecs['v12.timeentries_mark_billed'].riskLevel).toBe(
			'write',
		);
		expect(
			elorusOperationSpecs['v12.timeentries_mark_unbilled'].riskLevel,
		).toBe('write');
		expect(elorusOperationSpecs['v12.invoices_email_create'].riskLevel).toBe(
			'write',
		);
		expect(elorusOperationSpecs['v12.invoices_mark_void'].riskLevel).toBe(
			'destructive',
		);
	});

	it('rejects undocumented top-level inputs for every operation before transport', () => {
		for (const schema of Object.values(elorusOperationSchemas)) {
			expect(schema.input.safeParse({ undocumented: true }).success).toBe(
				false,
			);
		}
	});

	it('sends each operation to its documented method and route with required headers', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(JSON.stringify({ ok: true }), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
		);
		try {
			for (const spec of Object.values(elorusOperationSpecs)) {
				const path = Object.fromEntries(
					Array.from(spec.route.matchAll(/\{([^}]+)\}/g), ([, key]) => [
						key,
						'fixture-id',
					]),
				);
				await makeElorusRequest(spec.route, 'fixture-token', {
					method: spec.method,
					...(Object.keys(path).length ? { path } : {}),
					...(spec.mode === 'multipart'
						? { form: { file: new Blob(['fixture']) } }
						: spec.method === 'GET' || spec.method === 'DELETE'
							? {}
							: { body: {} }),
					organizationId: 'fixture-organization',
					demo: true,
					mode: spec.mode,
				});
				const call = fetchSpy.mock.calls.at(-1);
				expect(call).toBeDefined();
				if (!call) throw new Error('Expected Elorus transport to call fetch.');
				const [url, init] = call;
				expect(new URL(String(url)).pathname).toContain(
					spec.route.replace(/\{[^}]+\}/g, 'fixture-id'),
				);
				expect(init?.method).toBe(spec.method);
				const headers = new Headers(init?.headers);
				expect(headers.get('Authorization')).toBe('Token fixture-token');
				expect(headers.get('X-Elorus-Organization')).toBe(
					'fixture-organization',
				);
				expect(headers.get('X-Elorus-Demo')).toBe('1');
			}
			expect(fetchSpy).toHaveBeenCalledTimes(457);
		} finally {
			fetchSpy.mockRestore();
		}
	});
});
