import { ForceManagerEndpoints, forceManagerRoutes } from './endpoints';
import {
	operationDefinitions,
	operationTestInputs,
	operationTestOutputs,
} from './endpoints/definitions';
import {
	assertForceManagerLoggingConfiguration,
	executeForceManagerOperation,
	safeOperationLogPayload,
} from './endpoints/runtime';
import { forceManagerEndpointMeta, forceManagerEndpointSchemas } from './index';

const forceManagerEndpointsNested = ForceManagerEndpoints;

// `unknown` is needed to safely inspect the heterogeneous operation fixtures.
function recordOf(value: unknown): Record<string, unknown> {
	if (value === null || typeof value !== 'object' || Array.isArray(value))
		return {};
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) result[key] = entry;
	return result;
}

function expectedPath(name: keyof typeof operationDefinitions): string {
	const definition = operationDefinitions[name];
	const input = recordOf(operationTestInputs[name]);
	const pathInput = recordOf(input.path);
	let pathIndex = 0;
	return definition.path.replace(/\{ID\}|VALUE/g, (pathToken) => {
		const pathKey = definition.pathKeys[pathIndex];
		pathIndex += 1;
		if (!pathKey) throw new Error(`Missing ForceManager path key for ${name}`);
		const value = pathInput[pathKey];
		if (typeof value !== 'number' && typeof value !== 'string') {
			throw new Error(`Missing ForceManager path value: ${pathKey}`);
		}
		return encodeURIComponent(String(value));
	});
}

describe('ForceManager operation registry and wire behavior', () => {
	afterEach(() => jest.restoreAllMocks());

	it('exposes exactly the 294 scoped operations with schemas and risk metadata', () => {
		const routeKeys = forceManagerRoutes.map(
			(route) => `${route.group}.${route.name}`,
		);
		const registeredKeys = Object.entries(forceManagerEndpointsNested).flatMap(
			([group, operations]) =>
				Object.keys(operations).map((name) => `${group}.${name}`),
		);
		const schemaKeys = Object.keys(forceManagerEndpointSchemas).sort();
		const metadataKeys = Object.keys(forceManagerEndpointMeta).sort();

		expect(forceManagerRoutes).toHaveLength(294);
		expect(new Set(routeKeys).size).toBe(routeKeys.length);
		expect(registeredKeys.sort()).toEqual([...routeKeys].sort());
		expect(schemaKeys).toEqual([...routeKeys].sort());
		expect(metadataKeys).toEqual([...routeKeys].sort());
	});

	it('keeps the five documented but unsupported operations out of the endpoint registry', () => {
		const excludedOperations = [
			'documentsEntity.addDocument',
			'documentsEntity.addDocumentToAResource',
			'productsCarousel.addPicture',
			'productsFamilies.deleteProductFamily',
			'usersTypes.deleteUserType',
		];
		const registeredKeys = Object.entries(forceManagerEndpointsNested).flatMap(
			([group, operations]) =>
				Object.keys(operations).map((name) => `${group}.${name}`),
		);

		expect(Object.keys(operationDefinitions)).toHaveLength(299);
		expect(forceManagerRoutes).toHaveLength(294);
		for (const operation of excludedOperations) {
			expect(registeredKeys).not.toContain(operation);
		}
	});

	it.each(forceManagerRoutes)(
		'$name has matching registration and risk metadata',
		(route) => {
			const key = `${route.group}.${route.name}`;
			const definition = operationDefinitions[route.name];
			const registered = Object.entries(forceManagerEndpointsNested)
				.flatMap(([group, operations]) =>
					Object.entries(operations).map(
						([name, endpoint]) => [`${group}.${name}`, endpoint] as const,
					),
				)
				.find(([registeredKey]) => registeredKey === key);
			const schemas = Object.entries(forceManagerEndpointSchemas).find(
				([schemaKey]) => schemaKey === key,
			);
			const metadata = Object.entries(forceManagerEndpointMeta).find(
				([metadataKey]) => metadataKey === key,
			)?.[1];

			expect(typeof registered?.[1]).toBe('function');
			expect(schemas?.[1].input).toBe(definition.input);
			expect(schemas?.[1].output).toBe(definition.output);
			expect(metadata?.description).toContain(definition.path);
			expect(metadata?.riskLevel).toBe(
				definition.method === 'GET'
					? 'read'
					: definition.method === 'DELETE'
						? 'destructive'
						: 'write',
			);
		},
	);

	it.each(forceManagerRoutes)(
		'$name validates and sends the documented request',
		async (route) => {
			const definition = operationDefinitions[route.name];
			const input = recordOf(operationTestInputs[route.name]);
			const query = recordOf(input.query);
			const headers = recordOf(input.headers);
			const output = operationTestOutputs[route.name];
			const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
				new Response(JSON.stringify(output), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);

			const result = await executeForceManagerOperation(
				route.name,
				input,
				'session-key',
			);
			const [requestUrl, requestInit] = fetchMock.mock.calls[0] ?? [];
			const url = new URL(String(requestUrl));

			expect(result).toEqual(definition.output.parse(output));
			expect(`${url.origin}${url.pathname}`).toBe(
				`https://api.forcemanager.com/api/v4${expectedPath(route.name)}`,
			);
			expect(requestInit?.method).toBe(definition.method);
			expect(new Headers(requestInit?.headers).get('X-Session-Key')).toBe(
				'session-key',
			);
			for (const [key, value] of Object.entries(query)) {
				expect(url.searchParams.get(key)).toBe(String(value));
			}
			if (typeof headers.count === 'number' && route.countHeader) {
				expect(new Headers(requestInit?.headers).get(route.countHeader)).toBe(
					String(headers.count),
				);
			}
			if (headers.extraFieldDescription !== undefined) {
				expect(
					new Headers(requestInit?.headers).get('ExtraFieldDescription'),
				).toBe(String(headers.extraFieldDescription));
			}
			if (Object.hasOwn(input, 'body')) {
				expect(JSON.parse(String(requestInit?.body))).toEqual(input.body);
			} else {
				expect(requestInit?.body).toBeUndefined();
			}
		},
	);

	it.each(forceManagerRoutes)(
		'$name rejects undocumented top-level input before network I/O',
		async (route) => {
			const fetchMock = jest.spyOn(globalThis, 'fetch');
			const input = operationTestInputs[route.name];

			await expect(
				executeForceManagerOperation(
					route.name,
					{ ...input, undocumented: true },
					'session-key',
				),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('logs only a safe operation identifier and never caller payloads', () => {
		expect(safeOperationLogPayload('list-accounts')).toEqual({
			operation: 'list-accounts',
		});
		expect(
			JSON.stringify(safeOperationLogPayload('list-accounts')),
		).not.toContain('session-key');
	});

	it('routes a runtime operation to the documented sandbox host when selected', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(operationTestOutputs.listTimezones), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await executeForceManagerOperation(
			'listTimezones',
			operationTestInputs.listTimezones,
			'session-key',
			'sandbox',
		);

		const [requestUrl] = fetchMock.mock.calls[0] ?? [];
		expect(new URL(String(requestUrl)).origin).toBe(
			'https://sandbox-api.forcemanager.com',
		);
	});

	it.each(['.', '..'])(
		'rejects dot-segment path value %s before network I/O',
		async (value) => {
			const fetchMock = jest.spyOn(globalThis, 'fetch');
			const input = recordOf(operationTestInputs.deleteWarningOfAResource);
			const path = recordOf(input.path);

			await expect(
				executeForceManagerOperation(
					'deleteWarningOfAResource',
					{ ...input, path: { ...path, value3: value } },
					'session-key',
				),
			).rejects.toThrow('Invalid ForceManager path parameter: value3');
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('fails before a provider operation when encrypted event logging lacks a KEK', () => {
		expect(() =>
			assertForceManagerLoggingConfiguration({
				$getAccountId: async () => 'account',
				encryptDataAtRest: true,
				kek: undefined,
			}),
		).toThrow('encryptDataAtRest requires kek');
	});
});
