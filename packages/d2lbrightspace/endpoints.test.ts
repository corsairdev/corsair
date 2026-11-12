import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { makeD2lBrightspaceRequest } from './client';
import { d2lBrightspaceEndpointSchemas } from './endpoints/registry';
import type { D2lRouteInput } from './endpoints/types';
import { createD2lRouteInputSchema } from './endpoints/types';
import { D2L_ROUTES } from './route-definitions';

const RouteInventoryEntrySchema = z
	.object({
		routeId: z.string(),
		method: z.enum([
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'PATCH',
			'HEAD',
			'OPTIONS',
		]),
		path: z.string(),
		operationPath: z.string(),
		doc: z.string().url(),
		coverageStatus: z.enum([
			'excluded',
			'wrapper_only',
			'schema_audited',
			'transport_modeled',
			'transport_pending',
		]),
		coverageReason: z.string(),
	})
	.passthrough();

function valueForQuery(route: (typeof D2L_ROUTES)[number], name: string) {
	const typeName =
		route.queryDetails
			.find((detail) => detail.name === name)
			?.type.toLowerCase() ?? 'string';
	if (typeName.includes('boolean')) return true;
	if (
		typeName.includes('number') ||
		typeName.includes('integer') ||
		typeName.includes('d2lid')
	) {
		return '1';
	}
	return 'fixture';
}

function inputForRoute(route: (typeof D2L_ROUTES)[number]): D2lRouteInput {
	return {
		pathParams: Object.fromEntries(
			route.pathParams.map((name) => [name, 'fixture']),
		),
		...(route.queryParams.length > 0
			? {
					query: Object.fromEntries(
						route.queryParams.map((name) => [name, valueForQuery(route, name)]),
					),
				}
			: {}),
		...(route.jsonParams.length > 0
			? {
					body:
						route.routeId === 'd2l0004'
							? [{ ProductCode: 'lp', Version: '1.49' }]
							: { fixture: true },
				}
			: {}),
		...(route.formFields.length > 0
			? {
					form: Object.fromEntries(
						route.formDetails.map((field) => [
							field.name,
							field.repeatable ? ['1'] : 'fixture',
						]),
					),
				}
			: {}),
		...(route.filePartNames.length > 0
			? {
					files: [
						{
							filename: 'fixture.txt',
							contentType: 'text/plain',
							base64: 'Zml4dHVyZQ==',
						},
					],
				}
			: {}),
		...(route.requestMode === 'resumable'
			? {
					upload: {
						filename: 'fixture.zip',
						contentType: 'application/zip',
						base64: 'Zml4dHVyZQ==',
					},
				}
			: {}),
	};
}

function expectedPath(
	route: (typeof D2L_ROUTES)[number],
	input: D2lRouteInput,
): string {
	return route.path.replace(/[({]([^){}]+)[)}]/g, (_match, name: string) =>
		encodeURIComponent(input.pathParams[name] ?? ''),
	);
}

describe('D2L route registry', () => {
	afterEach(() => jest.restoreAllMocks());

	it('registers every routing-table operation except the two documented interactive auth redirects', () => {
		const routeInventory = z
			.array(RouteInventoryEntrySchema)
			.parse(JSON.parse(readFileSync('route-inventory.json', 'utf8')));
		const expected = D2L_ROUTES.filter(
			(route) => route.coverageStatus !== 'excluded',
		)
			.map((route) => route.operationPath)
			.sort();
		const actual = Object.keys(d2lBrightspaceEndpointSchemas).sort();
		expect(D2L_ROUTES).toHaveLength(876);
		expect(routeInventory).toHaveLength(876);
		expect(routeInventory.map((route) => route.routeId)).toEqual(
			D2L_ROUTES.map((route) => route.routeId),
		);
		expect(
			new Set(routeInventory.map((route) => `${route.method} ${route.path}`))
				.size,
		).toBe(876);
		expect(
			routeInventory
				.filter((route) => route.coverageStatus === 'excluded')
				.every((route) => route.coverageReason.length > 0),
		).toBe(true);
		expect(actual).toHaveLength(874);
		expect(actual).toEqual(expected);
	});

	it('rejects undocumented fields before network I/O on every route', () => {
		for (const route of D2L_ROUTES.filter(
			(entry) => entry.coverageStatus !== 'excluded',
		)) {
			const schema = createD2lRouteInputSchema(route);
			const input = inputForRoute(route);
			expect(schema.safeParse({ ...input, undocumented: true }).success).toBe(
				false,
			);
			expect(
				schema.safeParse({
					...input,
					pathParams: { ...input.pathParams, undocumented: 'value' },
				}).success,
			).toBe(false);
			if (route.queryParams.length > 0) {
				expect(
					schema.safeParse({
						...input,
						query: { ...input.query, undocumented: 'value' },
					}).success,
				).toBe(false);
			}
			if (route.requiredQueryParams.length > 0) {
				const missingRequired = route.requiredQueryParams[0];
				const query = Object.fromEntries(
					route.queryParams
						.filter((name) => name !== missingRequired)
						.map((name) => [name, valueForQuery(route, name)]),
				);
				expect(schema.safeParse({ ...input, query }).success).toBe(false);
			}
		}
	});

	it('sends the documented method, host, path, query, body and OAuth header for every operation', async () => {
		let requestUrl = '';
		let requestInit: RequestInit | undefined;
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (input, init) => {
				requestUrl = String(input);
				requestInit = init;
				return new Response('{"fixture":true}', {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			});
		for (const route of D2L_ROUTES.filter(
			(entry) => entry.coverageStatus !== 'excluded',
		)) {
			const input = inputForRoute(route);
			if (route.requestMode === 'resumable') continue;
			if (route.requestMode === 'form' && route.formFields.length === 0) {
				await expect(
					makeD2lBrightspaceRequest(route, input, 'https://tenant.test', {
						kind: 'oauth_2',
						accessToken: 'test-access-token',
					}),
				).rejects.toThrow();
				continue;
			}
			await makeD2lBrightspaceRequest(route, input, 'https://tenant.test', {
				kind: 'oauth_2',
				accessToken: 'test-access-token',
			});
			const parsedUrl = new URL(requestUrl);
			expect(parsedUrl.origin).toBe('https://tenant.test');
			expect(parsedUrl.pathname).toBe(expectedPath(route, input));
			expect(requestInit?.method).toBe(route.method);
			if (route.queryParams.length > 0) {
				for (const name of route.queryParams) {
					expect(parsedUrl.searchParams.get(name)).toBe(
						String(input.query?.[name]),
					);
				}
			}
			if (route.requestMode === 'multipart') {
				const headers = new Headers(requestInit?.headers);
				if (route.multipartFormat === 'mixed') {
					expect(headers.get('content-type')).toContain('multipart/mixed');
					if (input.body !== undefined) {
						expect(String(requestInit?.body)).toContain(
							JSON.stringify(input.body),
						);
					}
				} else {
					expect(headers.get('content-type')).toContain('multipart/form-data');
				}
				expect(Buffer.isBuffer(requestInit?.body)).toBe(true);
				if (Buffer.isBuffer(requestInit?.body)) {
					expect(Number(headers.get('content-length'))).toBe(
						requestInit.body.byteLength,
					);
				}
			} else if (route.requestMode === 'form') {
				expect(requestInit?.body).toBeInstanceOf(URLSearchParams);
			} else if (route.jsonParams.length > 0) {
				expect(requestInit?.body).toBe(JSON.stringify(input.body));
			}
			if (
				route.group === 'API properties' &&
				route.path.includes('/versions')
			) {
				expect(new Headers(requestInit?.headers).has('authorization')).toBe(
					false,
				);
			} else {
				expect(new Headers(requestInit?.headers).get('authorization')).toBe(
					'Bearer test-access-token',
				);
			}
		}
		expect(fetchMock).toHaveBeenCalledTimes(866);
	});
});
