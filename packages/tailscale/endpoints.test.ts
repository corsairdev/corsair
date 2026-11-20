import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as client from './client';
import { tailscaleEndpointsNested } from './endpoints/catalog';
import type { TailscaleOperationDefinition } from './endpoints/manifest';
import {
	tailscaleDefinitions,
	tailscaleOperations,
} from './endpoints/manifest';
import { tailscaleInputFields } from './endpoints/openapi-schema';
import {
	policyFileResult,
	quoteEtag,
	timeoutFor,
} from './endpoints/operations';
import type { TailscaleContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeTailscaleRequest: jest.fn(),
		makeTailscaleRawRequest: jest.fn(),
		tailscaleBearer: jest.fn(async (key: string) => `bearer-for-${key}`),
		forgetTailscaleToken: jest.fn(async () => undefined),
	};
});

const mockedRequest = jest.mocked(client.makeTailscaleRequest);
const mockedRawRequest = jest.mocked(client.makeTailscaleRawRequest);
const mockedForget = jest.mocked(client.forgetTailscaleToken);
const mockedLogEvent = jest.mocked(logEventFromContext);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

function buildCtx(options: Record<string, unknown> = {}): TailscaleContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'tskey-api-test',
		options,
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('tskey-api-test'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read, not the whole plugin context.
	} as unknown as TailscaleContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: TailscaleContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = tailscaleEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	return node as AnyEndpoint;
}

// `unknown` because a resolved schema is any JSON Schema document.
function resolveSchema(schema: unknown): Record<string, unknown> {
	let current = schema as Record<string, unknown> | undefined;
	for (
		let depth = 0;
		depth < 10 && current && typeof current.$ref === 'string';
		depth++
	) {
		current = tailscaleDefinitions[current.$ref];
	}
	return current ?? {};
}

/** The smallest body that passes an operation's output schema. */
// `unknown` because each operation answers its own shape.
function sampleResponse(operation: TailscaleOperationDefinition): unknown {
	if (operation.response === 'empty') return undefined;
	const output = resolveSchema(operation.output);
	return output.type === 'array' ? [] : {};
}

beforeEach(() => {
	jest.clearAllMocks();
	// Drop queued answers too, so a call that throws early can't hand its
	// answer to the next test.
	mockedRequest.mockReset();
	mockedRawRequest.mockReset();
});

describe.each(
	tailscaleOperations.map((operation) => [operation.id, operation]),
)('%s', (id, operation) => {
	it('sends its apiExample to the documented route', async () => {
		const args = docs.apiExamples[id]?.args ?? {};
		const raw = operation.response === 'policy' || operation.emptyMeansNone;
		if (raw) {
			mockedRawRequest.mockResolvedValueOnce({
				text: '{}',
				headers: new Headers({ etag: '"abc"' }),
			});
		} else {
			mockedRequest.mockResolvedValueOnce(sampleResponse(operation));
		}

		const result = await endpointFor(id)(buildCtx(), args);

		const sent = raw
			? mockedRawRequest.mock.calls[0]?.[0]
			: mockedRequest.mock.calls[0]?.[0];
		expect(sent?.method).toBe(operation.method);
		expect(sent?.path).toBe(operation.path);
		expect(sent?.token).toBe('bearer-for-tskey-api-test');

		// Every {placeholder} is filled: from the input, or "-" for the tailnet and organization.
		for (const name of operation.path.match(/\{([^}]+)\}/g) ?? []) {
			const key = name.slice(1, -1);
			const expected =
				key === 'tailnet' || key === 'organization'
					? (args[key] ?? '-')
					: String(args[key]);
			expect([key, sent?.pathParameters?.[key]]).toEqual([key, expected]);
		}
		// Path, query and header inputs never leak into the body.
		const fields = tailscaleInputFields(id);
		if (
			sent?.body &&
			typeof sent.body === 'object' &&
			!Array.isArray(sent.body)
		) {
			for (const field of fields) {
				if (field.in !== 'body') {
					expect(Object.keys(sent.body as object)).not.toContain(field.name);
				}
			}
		}
		if (operation.request === 'none') expect(sent?.body).toBeUndefined();
		if (operation.response === 'empty') {
			expect(result).toEqual({ success: true });
		}
		expect(mockedLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'tailscale.operation',
			{ operationId: id },
			'completed',
		);
	});
});

describe('routing', () => {
	it('uses "-" for the tailnet, the tailnet option when set, and the input over both', async () => {
		mockedRequest.mockResolvedValue({ devices: [] });
		await endpointFor('devices.list')(buildCtx(), {});
		await endpointFor('devices.list')(buildCtx({ tailnet: 'T1234CNTRL' }), {});
		await endpointFor('devices.list')(buildCtx({ tailnet: 'T1234CNTRL' }), {
			tailnet: 'T9999CNTRL',
		});
		expect(
			mockedRequest.mock.calls.map(([sent]) => sent.pathParameters?.tailnet),
		).toEqual(['-', 'T1234CNTRL', 'T9999CNTRL']);
	});

	it('sends device filters as their own query parameters, lists as repeated keys', async () => {
		mockedRequest.mockResolvedValueOnce({ devices: [] });
		await endpointFor('devices.list')(buildCtx(), {
			fields: 'all',
			filters: { tags: ['tag:prod', 'tag:mcp'], isEphemeral: true },
		});
		expect(mockedRequest.mock.calls[0]?.[0].query).toEqual({
			fields: 'all',
			tags: ['tag:prod', 'tag:mcp'],
			isEphemeral: true,
		});
	});

	it('sends a list or map body whole: invites and split DNS', async () => {
		mockedRequest.mockResolvedValueOnce([]);
		await endpointFor('userInvites.create')(buildCtx(), {
			invites: [{ role: 'member' }],
		});
		expect(mockedRequest.mock.calls[0]?.[0].body).toEqual([{ role: 'member' }]);
		mockedRequest.mockResolvedValueOnce({});
		await endpointFor('dns.splitDns.update')(buildCtx(), {
			domains: { 'old.example.com': null },
		});
		expect(mockedRequest.mock.calls[1]?.[0].body).toEqual({
			'old.example.com': null,
		});
	});

	it('sends HuJSON text as text and a policy object as JSON', async () => {
		mockedRawRequest.mockResolvedValue({
			text: '{}',
			headers: new Headers({ etag: '"v2"' }),
		});
		await endpointFor('policyFile.set')(buildCtx(), {
			policy: '{ // keep me\n}',
			ifMatch: 'v1',
		});
		const first = mockedRawRequest.mock.calls[0]?.[0];
		expect(first?.body).toBe('{ // keep me\n}');
		expect(first?.headers?.['If-Match']).toBe('"v1"');
		expect(first?.headers?.Accept).toBe('application/hujson');
		await endpointFor('policyFile.set')(buildCtx(), {
			policy: { acls: [] },
			format: 'json',
		});
		const second = mockedRawRequest.mock.calls[1]?.[0];
		expect(second?.body).toEqual({ acls: [] });
		expect(second?.headers?.Accept).toBe('application/json');
		expect(second?.headers?.['If-Match']).toBeUndefined();
	});

	it('returns the policy with its etag, as text, JSON, or the detailed form', async () => {
		mockedRawRequest.mockResolvedValueOnce({
			text: '// rules\n{}',
			headers: new Headers({ etag: '"e1"' }),
		});
		await expect(
			endpointFor('policyFile.get')(buildCtx(), {}),
		).resolves.toEqual({
			policy: '// rules\n{}',
			etag: '"e1"',
		});
		mockedRawRequest.mockResolvedValueOnce({
			text: '{"acls":[]}',
			headers: new Headers({ etag: '"e1"' }),
		});
		await expect(
			endpointFor('policyFile.get')(buildCtx(), { format: 'json' }),
		).resolves.toEqual({ policy: { acls: [] }, etag: '"e1"' });
		mockedRawRequest.mockResolvedValueOnce({
			text: JSON.stringify({
				acl: btoa('// rules\n{}'),
				warnings: ['unused group'],
				errors: null,
			}),
			headers: new Headers({ etag: '"e1"' }),
		});
		await expect(
			endpointFor('policyFile.get')(buildCtx(), { details: true }),
		).resolves.toEqual({
			policy: '// rules\n{}',
			etag: '"e1"',
			warnings: ['unused group'],
			errors: null,
		});
		// With details Tailscale wants no Accept header.
		expect(mockedRawRequest.mock.calls[2]?.[0].headers?.Accept).toBeUndefined();
		expect(mockedRawRequest.mock.calls[2]?.[0].query).toEqual({
			details: true,
		});
	});

	it('validates ACL tests or a draft, never both, never neither', async () => {
		const reply = (text: string) =>
			mockedRawRequest.mockResolvedValueOnce({ text, headers: new Headers() });
		// No body at all: every test passed.
		reply('');
		await expect(
			endpointFor('policyFile.validate')(buildCtx(), {
				tests: [{ src: 'tag:agent', accept: ['tag:mcp:443'] }],
			}),
		).resolves.toBeNull();
		const sent = mockedRawRequest.mock.calls[0]?.[0];
		expect(sent?.body).toEqual([{ src: 'tag:agent', accept: ['tag:mcp:443'] }]);
		expect(sent?.headers?.Accept).toBe('application/json');
		reply(
			JSON.stringify({
				message: 'test(s) failed',
				data: [{ user: 'tag:agent', errors: ['want: Accept, got: Drop'] }],
			}),
		);
		await expect(
			endpointFor('policyFile.validate')(buildCtx(), { policy: '{}' }),
		).resolves.toEqual({
			message: 'test(s) failed',
			data: [{ user: 'tag:agent', errors: ['want: Accept, got: Drop'] }],
		});
		// A body cut short is an error, never a pass, and the error doesn't
		// quote the body (V8's own SyntaxError would).
		reply('{"message": "alice@example.com failed');
		const cut = (await endpointFor('policyFile.validate')(buildCtx(), {
			policy: '{}',
		}).catch((e: unknown) => e)) as Error;
		expect(cut).toBeInstanceOf(SyntaxError);
		expect(cut.message).toBe(
			'Tailscale policyFile.validate returned a body that is not valid JSON',
		);
		expect(cut.message).not.toContain('alice');
		expect(cut.cause).toBeUndefined();
		mockedRawRequest.mockRejectedValueOnce(new TypeError('terminated'));
		await expect(
			endpointFor('policyFile.validate')(buildCtx(), { policy: '{}' }),
		).rejects.toThrow('terminated');
		await expect(
			endpointFor('policyFile.validate')(buildCtx(), {
				policy: '{}',
				tests: [{ src: 'a' }],
			}),
		).rejects.toThrow('either policy or tests, not both');
		await expect(
			endpointFor('policyFile.validate')(buildCtx(), {}),
		).rejects.toThrow('give policy');
		expect(mockedRawRequest).toHaveBeenCalledTimes(4);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('never sends fields Tailscale sets itself, even from an object it returned', async () => {
		mockedRequest.mockResolvedValueOnce(null);
		await endpointFor('tailnetSettings.update')(buildCtx(), {
			routeSelection: 'regional-routing',
			regionalRoutingOn: true,
		});
		expect(mockedRequest.mock.calls[0]?.[0].body).toEqual({
			routeSelection: 'regional-routing',
		});
		mockedRequest.mockResolvedValueOnce({ id: 'p1' });
		await endpointFor('postureIntegrations.update')(buildCtx(), {
			id: 'p1',
			cloudId: 'us-2',
			configUpdated: '2026-11-20T00:00:00Z',
			status: { lastSync: '2026-11-20T00:00:00Z' },
			newField: 'kept',
		});
		const sent = mockedRequest.mock.calls[1]?.[0];
		expect(sent?.pathParameters).toEqual({ id: 'p1' });
		// A field Tailscale adds later still goes through.
		expect(sent?.body).toEqual({ cloudId: 'us-2', newField: 'kept' });
	});

	it('names a Service in the body after its path value unless given', async () => {
		mockedRequest.mockResolvedValue({ name: 'svc:mcp' });
		await endpointFor('services.update')(buildCtx(), {
			serviceName: 'svc:mcp',
			ports: ['tcp:443'],
		});
		expect(mockedRequest.mock.calls[0]?.[0].body).toEqual({
			name: 'svc:mcp',
			ports: ['tcp:443'],
		});
	});

	it('reports success for the settings update Tailscale answers with null', async () => {
		mockedRequest.mockResolvedValueOnce(null);
		await expect(
			endpointFor('tailnetSettings.update')(buildCtx(), {
				devicesApprovalOn: true,
			}),
		).resolves.toEqual({ success: true });
	});

	it('refuses invalid input before sending anything, naming fields not values', async () => {
		await expect(
			endpointFor('devices.setTags')(buildCtx(), {
				deviceId: 'n1',
				tags: 'tag:secret-name',
			}),
		).rejects.toThrow(/Invalid input for tailscale devices\.setTags: tags:/);
		await expect(
			endpointFor('devices.setTags')(buildCtx(), {
				deviceId: 'n1',
				tags: 'tag:secret-name',
			}),
		).rejects.not.toThrow(/secret-name/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('masks map keys and odd unknown keys in validation errors', async () => {
		const error = (await endpointFor('dns.splitDns.update')(buildCtx(), {
			domains: { 'alice-laptop.internal': [123] },
		}).catch((e: unknown) => e)) as Error;
		expect(error.message).toMatch(
			/^Invalid input for tailscale dns\.splitDns\.update: domains\.<key>\.0: /,
		);
		expect(error.message).not.toContain('alice-laptop');
		const unknown = (await endpointFor('devices.get')(buildCtx(), {
			deviceId: 'n1',
			device: 'n1',
			'bob@example.com': 1,
		}).catch((e: unknown) => e)) as Error;
		expect(unknown.message).toContain('unknown field device, <key>');
		expect(unknown.message).not.toContain('bob@example.com');
		mockedRequest.mockResolvedValueOnce({ 'alice-laptop.internal': 'x' });
		const output = (await endpointFor('dns.splitDns.get')(buildCtx(), {}).catch(
			(e: unknown) => e,
		)) as Error;
		expect(output.message).toMatch(/response did not match .*: <key>: /);
		expect(output.message).not.toContain('alice-laptop');
	});

	it('fails a response that breaks its documented shape instead of inventing one', async () => {
		mockedRequest.mockResolvedValueOnce({ devices: 'not-a-list' });
		await expect(endpointFor('devices.list')(buildCtx(), {})).rejects.toThrow(
			/devices\.list response did not match its documented schema/,
		);
		mockedRequest.mockResolvedValueOnce(undefined);
		await expect(
			endpointFor('devices.get')(buildCtx(), { deviceId: 'n1' }),
		).rejects.toThrow(/did not match/);
	});

	it('forgets an OAuth token after a 401, and passes the error through unchanged', async () => {
		const unauthorized = new ApiError(
			{ method: 'GET', url: '/device/{deviceId}' },
			{
				url: 'x',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {},
			},
			'Tailscale 401: unauthorized',
		);
		mockedRequest.mockRejectedValueOnce(unauthorized);
		await expect(
			endpointFor('devices.get')(buildCtx(), { deviceId: 'n1' }),
		).rejects.toBe(unauthorized);
		// Only the token this call used, so a newer one survives.
		expect(mockedForget).toHaveBeenCalledWith(
			'tskey-api-test',
			'bearer-for-tskey-api-test',
		);
		const notFound = new ApiError(
			{ method: 'GET', url: '/device/{deviceId}' },
			{ url: 'x', ok: false, status: 404, statusText: 'Not Found', body: {} },
			'Tailscale 404: not found',
		);
		mockedRequest.mockRejectedValueOnce(notFound);
		await expect(
			endpointFor('devices.get')(buildCtx(), { deviceId: 'n1' }),
		).rejects.toBe(notFound);
		expect(mockedForget).toHaveBeenCalledTimes(1);
	});
});

describe('helpers', () => {
	it('quotes an etag the way Tailscale sent it', () => {
		expect(quoteEtag('e0b2816b418')).toBe('"e0b2816b418"');
		expect(quoteEtag('"e0b2816b418"')).toBe('"e0b2816b418"');
		expect(quoteEtag(' ts-default ')).toBe('"ts-default"');
		expect(quoteEtag('W/"weak"')).toBe('W/"weak"');
	});

	it('never quotes a malformed policy body in the error', () => {
		for (const [format, details] of [
			['json', false],
			['hujson', true],
		] as const) {
			let error: unknown;
			try {
				policyFileResult('{"acls": ["bob@example.com"', null, format, details);
			} catch (caught) {
				error = caught;
			}
			expect(error).toBeInstanceOf(SyntaxError);
			expect((error as Error).message).toBe(
				'Tailscale policyFile.get returned a body that is not valid JSON',
			);
		}
	});

	it('keeps detailed policy text that is not base64 as it is', () => {
		expect(
			policyFileResult(
				JSON.stringify({ acl: '{ "acls": [] }' }),
				null,
				'hujson',
				true,
			),
		).toEqual({
			policy: '{ "acls": [] }',
			etag: null,
			warnings: undefined,
			errors: undefined,
		});
	});

	it('gives log reads longer to answer', () => {
		expect(timeoutFor('logging.networkLogs.list')).toBe(90_000);
		expect(timeoutFor('devices.list')).toBe(30_000);
	});
});
