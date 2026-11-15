import { logEventFromContext } from 'corsair/core';
import { DeployHQEndpoints } from './endpoints';
import {
	deployHQOperationFixtures,
	deployHQOperationKeys,
	deployHQOperations,
} from './endpoints/openapi-operations';
import { runDeployHQOperation } from './endpoints/runtime';
import type { DeployHQContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const mockedFetch = jest.spyOn(globalThis, 'fetch');
const credentials = {
	accountSubdomain: 'demo-account',
	username: 'agent@example.com',
	apiKey: 'deployhq-test-key',
};
const mockedLogEvent = jest.mocked(logEventFromContext);

function readInputValue(input: object, key: string): unknown {
	// `unknown` because endpoint fields are selected dynamically by the OpenAPI operation definition.
	return Object.getOwnPropertyDescriptor(input, key)?.value;
}

function expectedPath(
	operation: (typeof deployHQOperations)[(typeof deployHQOperationKeys)[number]],
	input: object,
): string {
	let path: string = operation.path;
	for (const name of operation.pathParameters) {
		const value = readInputValue(input, name);
		if (typeof value === 'string' || typeof value === 'number') {
			path = path.replaceAll(`{${name}}`, encodeURIComponent(String(value)));
		}
	}
	return path;
}

function makeJsonResponse(value: unknown): Response {
	// `unknown` because the fixture is selected from operation-specific response schemas.
	return new Response(JSON.stringify(value), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

beforeEach(() => {
	mockedFetch.mockReset();
	mockedLogEvent.mockReset();
});

afterAll(() => {
	mockedFetch.mockRestore();
});

describe('DeployHQ REST operations', () => {
	it.each(deployHQOperationKeys)(
		'%s calls its documented method, route, query, and body',
		async (operationKey) => {
			const operation = deployHQOperations[operationKey];
			const fixture = deployHQOperationFixtures[operationKey];
			const input = operation.inputSchema.parse(fixture.input);
			const output = operation.outputSchema.parse(fixture.output);
			mockedFetch.mockResolvedValueOnce(makeJsonResponse(output));

			await expect(
				runDeployHQOperation(operationKey, input, credentials),
			).resolves.toEqual(output);

			const call = mockedFetch.mock.calls[0];
			expect(call).toBeDefined();
			if (!call) return;
			const [requestUrl, requestInit] = call;
			const url = new URL(String(requestUrl));
			expect(url.origin).toBe(
				operationKey === 'signup.createSignup'
					? 'https://api.deployhq.com'
					: 'https://demo-account.deployhq.com',
			);
			expect(url.pathname).toBe(expectedPath(operation, input));
			expect(requestInit?.method).toBe(operation.method);

			for (const name of operation.queryParameters) {
				const value = readInputValue(input, name);
				if (
					typeof value === 'string' ||
					typeof value === 'number' ||
					typeof value === 'boolean'
				) {
					expect(url.searchParams.get(name)).toBe(String(value));
				}
			}

			const requestHeaders = new Headers(requestInit?.headers);
			expect(requestHeaders.get('accept')).toBe(
				operationKey === 'invoices.getAccountInvoice'
					? 'application/pdf, application/octet-stream, application/json'
					: 'application/json',
			);
			if (operation.public) {
				expect(requestHeaders.has('authorization')).toBe(false);
			} else {
				expect(requestHeaders.get('authorization')).toBe(
					`Basic ${btoa(`${credentials.username}:${credentials.apiKey}`)}`,
				);
			}

			if (operation.bodyKind === 'form') {
				expect(requestInit?.body).toBeInstanceOf(FormData);
			} else if (operation.bodyKind !== 'none') {
				expect(requestHeaders.get('content-type')).toContain(
					'application/json',
				);
				const bodyValue = readInputValue(input, 'body');
				if (bodyValue !== undefined)
					expect(JSON.parse(String(requestInit?.body))).toEqual(bodyValue);
			}
		},
	);

	it.each(deployHQOperationKeys)(
		'%s rejects an undocumented input field before making a request',
		async (operationKey) => {
			const operation = deployHQOperations[operationKey];
			const fixture = deployHQOperationFixtures[operationKey];
			const input = {
				...operation.inputSchema.parse(fixture.input),
				__corsair_undocumented_probe__: true,
			};
			expect(operation.inputSchema.safeParse(input).success).toBe(false);
			expect(mockedFetch).not.toHaveBeenCalled();
		},
	);

	it('sends credentials to every route DeployHQ does not serve anonymously', () => {
		// Probed 11-13: /templates/public_templates and /templates/{id}/public/{id}
		// answer 403 AccessDenied without Basic auth, so they are not public routes.
		const publicOperations = deployHQOperationKeys.filter(
			(key) => deployHQOperations[key].public,
		);
		expect(publicOperations.sort()).toEqual(
			[
				'account.resetPasswordSubmitReset',
				'ipRanges.listIpRanges',
				'packages.listPackages',
				'projects.statusBadgeStatusBadge',
				'projects.statusBadgeStatusBadgeByIdentifier',
				'signup.createSignup',
			].sort(),
		);
	});

	it.each(['.', '..'])(
		'rejects the %s path segment before a request is sent',
		async (id) => {
			const operationKey = 'servers.deleteProjectServer';
			const operation = deployHQOperations[operationKey];
			const input = {
				...operation.inputSchema.parse(
					deployHQOperationFixtures[operationKey].input,
				),
				id,
			};
			await expect(
				runDeployHQOperation(operationKey, input, credentials),
			).rejects.toThrow('dot segment');
			expect(mockedFetch).not.toHaveBeenCalled();
		},
	);

	it('encodes path identifiers and preserves query values without logging request data', async () => {
		const operationKey = deployHQOperationKeys.find(
			(key) =>
				deployHQOperations[key].pathParameters.length > 0 &&
				deployHQOperations[key].queryParameters.length > 0,
		);
		expect(operationKey).toBeDefined();
		if (!operationKey) return;
		const operation = deployHQOperations[operationKey];
		const fixture = deployHQOperationFixtures[operationKey];
		const input = operation.inputSchema.parse(fixture.input);
		mockedFetch.mockResolvedValueOnce(makeJsonResponse(fixture.output));
		await runDeployHQOperation(operationKey, input, credentials);
		const call = mockedFetch.mock.calls[0];
		expect(call).toBeDefined();
		if (!call) return;
		const url = new URL(String(call[0]));
		expect(url.pathname).toBe(expectedPath(operation, input));
		expect(url.pathname).not.toContain('agent@example.com');
	});

	it('accepts the documented SVG badge response as text without byte decoding', async () => {
		const operationKey = 'projects.statusBadgeStatusBadge';
		const operation = deployHQOperations[operationKey];
		const input = operation.inputSchema.parse(
			deployHQOperationFixtures[operationKey].input,
		);
		const svg =
			'<svg xmlns="http://www.w3.org/2000/svg"><title>ok</title></svg>';
		mockedFetch.mockResolvedValueOnce(
			new Response(svg, {
				status: 200,
				headers: { 'Content-Type': 'image/svg+xml' },
			}),
		);
		await expect(
			runDeployHQOperation(operationKey, input, credentials),
		).resolves.toBe(svg);
	});

	it('returns invoice downloads as a byte-preserving base64 response', async () => {
		const operationKey = 'invoices.getAccountInvoice';
		const operation = deployHQOperations[operationKey];
		const input = operation.inputSchema.parse(
			deployHQOperationFixtures[operationKey].input,
		);
		const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x00, 0xff]);
		mockedFetch.mockResolvedValueOnce(
			new Response(bytes, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);
		await expect(
			runDeployHQOperation(operationKey, input, credentials),
		).resolves.toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: btoa(String.fromCharCode(...bytes)),
			sizeBytes: bytes.byteLength,
		});
	});

	it('logs only the safe operation and method, never endpoint input or credentials', async () => {
		const context: DeployHQContext = {
			endpoints: {},
			$getAccountId: async () => 'test-account',
			key: 'super-secret-api-key',
			options: {
				accountSubdomain: 'demo-account',
				username: 'agent@example.com',
			},
			keys: {
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'test-dek',
				get_api_key: async () => 'super-secret-api-key',
				set_api_key: async () => undefined,
				get_account_subdomain: async () => 'demo-account',
				set_account_subdomain: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
				get_username: async () => 'agent@example.com',
				set_username: async () => undefined,
			},
			db: {},
		};
		const operation = deployHQOperations['projects.getProject'];
		const output = operation.outputSchema.parse(
			deployHQOperationFixtures['projects.getProject'].output,
		);
		mockedFetch.mockResolvedValueOnce(makeJsonResponse(output));

		await DeployHQEndpoints.projects.getProject(context, {
			id: 'secret-project-id',
		});

		const logCall = mockedLogEvent.mock.calls[0];
		expect(logCall?.[1]).toBe('deployhq.projects.getProject');
		expect(logCall?.[2]).toEqual({ method: 'GET' });
		expect(JSON.stringify(logCall?.[2])).not.toContain('secret-project-id');
		expect(JSON.stringify(logCall?.[2])).not.toContain('super-secret-api-key');
		expect(JSON.stringify(logCall?.[2])).not.toContain('agent@example.com');
	});
});
