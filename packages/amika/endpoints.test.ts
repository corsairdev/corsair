import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as client from './client';
import { amikaEndpointsNested } from './endpoints/catalog';
import type { AmikaOperationDefinition } from './endpoints/manifest';
import { amikaDefinitions, amikaOperations } from './endpoints/manifest';
import { amikaInputFields } from './endpoints/openapi-schema';
import { timeoutFor } from './endpoints/operations';
import type { AmikaContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAmikaRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makeAmikaRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

function buildCtx(options: Record<string, unknown> = {}): AmikaContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'sk_test',
		options,
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('sk_test'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read, not the whole plugin context.
	} as unknown as AmikaContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: AmikaContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = amikaEndpointsNested;
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
		current = amikaDefinitions[current.$ref];
	}
	return current ?? {};
}

/** The smallest body that passes an operation's output schema. */
// `unknown` because each operation answers its own shape.
function sampleResponse(operation: AmikaOperationDefinition): unknown {
	if (operation.response === 'empty') return undefined;
	const output = resolveSchema(operation.output);
	return output.type === 'array' ? [] : {};
}

beforeEach(() => {
	jest.clearAllMocks();
	// Drop queued answers too, so a call that throws early can't hand its
	// answer to the next test.
	mockedRequest.mockReset();
});

describe.each(amikaOperations.map((operation) => [operation.id, operation]))(
	'%s',
	(id, operation) => {
		it('sends its apiExample to the documented route', async () => {
			const args = docs.apiExamples[id]?.args ?? {};
			mockedRequest.mockResolvedValueOnce(sampleResponse(operation));

			const result = await endpointFor(id)(buildCtx(), args);

			const sent = mockedRequest.mock.calls[0]?.[0];
			expect(sent?.method).toBe(operation.method);
			expect(sent?.path).toBe(operation.path);
			expect(sent?.key).toBe('sk_test');

			// Every {placeholder} is filled from the input.
			for (const name of operation.path.match(/\{([^}]+)\}/g) ?? []) {
				const key = name.slice(1, -1);
				expect([key, sent?.pathParameters?.[key]]).toEqual([
					key,
					String(args[key]),
				]);
			}
			// Path, query and header inputs never leak into the body.
			const fields = amikaInputFields(id);
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
				'amika.operation',
				{ operationId: id },
				'completed',
			);
		});
	},
);

describe('routing', () => {
	it('sends path, query and body fields where the spec puts them', async () => {
		mockedRequest.mockResolvedValueOnce({ id: 'r1', name: 'dev' });
		await endpointFor('rigs.get')(buildCtx(), { id: 'dev', by: 'name' });
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			method: 'GET',
			path: '/rigs/{id}',
			pathParameters: { id: 'dev' },
			query: { by: 'name' },
		});
		mockedRequest.mockResolvedValueOnce({ id: 's1', name: 'web' });
		await endpointFor('rigs.services.create')(buildCtx(), {
			id: 'dev',
			name: 'web',
			port: 3000,
			url_scheme: 'https',
		});
		expect(mockedRequest.mock.calls[1]?.[0]).toMatchObject({
			method: 'POST',
			path: '/rigs/{id}/services',
			pathParameters: { id: 'dev' },
			body: { name: 'web', port: 3000, url_scheme: 'https' },
		});
	});

	it('sends a new Idempotency-Key per call unless one is given', async () => {
		mockedRequest.mockResolvedValue({ id: 'cr1', status: 'queued' });
		const input = { rig_ref: 'dev', command: 'echo hi', timeout_ms: 60000 };
		await endpointFor('commandRuns.create')(buildCtx(), input);
		await endpointFor('commandRuns.create')(buildCtx(), input);
		await endpointFor('commandRuns.create')(buildCtx(), {
			...input,
			idempotencyKey: 'nightly-2026-11-22',
		});
		const keys = mockedRequest.mock.calls.map(
			(call) => call[0].headers?.['Idempotency-Key'],
		);
		expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/);
		expect(keys[1]).toMatch(/^[0-9a-f-]{36}$/);
		expect(keys[0]).not.toBe(keys[1]);
		expect(keys[2]).toBe('nightly-2026-11-22');
		// The key is a header, never part of the body.
		expect(mockedRequest.mock.calls[2]?.[0].body).toEqual(input);
	});

	it('keeps body fields the spec does not list yet (Amika may add them first)', async () => {
		mockedRequest.mockResolvedValueOnce({ id: 'r1', name: 'dev' });
		await endpointFor('rigs.create')(buildCtx(), {
			name: 'dev',
			newField: 'kept',
		});
		expect(mockedRequest.mock.calls[0]?.[0].body).toEqual({
			name: 'dev',
			newField: 'kept',
		});
	});

	it('refuses invalid input before sending anything, naming fields not values', async () => {
		await expect(
			endpointFor('commandRuns.create')(buildCtx(), {
				rig_ref: 'dev',
				command: 'cat /secret/file',
				timeout_ms: 'soon',
			}),
		).rejects.toThrow(
			/Invalid input for amika commandRuns\.create: timeout_ms:/,
		);
		await expect(
			endpointFor('commandRuns.create')(buildCtx(), {
				rig_ref: 'dev',
				command: 'cat /secret/file',
				timeout_ms: 'soon',
			}),
		).rejects.not.toThrow(/secret/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('masks map keys and unknown keys in validation errors', async () => {
		const error = (await endpointFor('rigs.create')(buildCtx(), {
			name: 'dev',
			env_vars: { STRIPE_SECRET_KEY: 42 },
		}).catch((e: unknown) => e)) as Error;
		expect(error.message).toMatch(
			/^Invalid input for amika rigs\.create: env_vars\.<key>: /,
		);
		expect(error.message).not.toContain('STRIPE_SECRET_KEY');
		const unknown = (await endpointFor('rigs.get')(buildCtx(), {
			id: 'dev',
			alice_laptop: 'x',
		}).catch((e: unknown) => e)) as Error;
		expect(unknown.message).toBe(
			'Invalid input for amika rigs.get: input: 1 unknown field (<key>); this operation takes id, by',
		);
	});

	it('fails a response that breaks its documented shape instead of inventing one', async () => {
		mockedRequest.mockResolvedValueOnce({ items: 'not-a-list' });
		await expect(endpointFor('jobs.list')(buildCtx(), {})).rejects.toThrow(
			/jobs\.list response did not match its documented schema/,
		);
		mockedRequest.mockResolvedValueOnce(undefined);
		await expect(
			endpointFor('rigs.get')(buildCtx(), { id: 'dev' }),
		).rejects.toThrow(/did not match/);
	});

	it('passes an ApiError through unchanged, so core and the handlers see its status', async () => {
		const unauthorized = new ApiError(
			{ method: 'GET', url: '/rigs' },
			{
				url: 'x',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Invalid API key' },
			},
			'Amika 401: Invalid API key',
		);
		mockedRequest.mockRejectedValueOnce(unauthorized);
		await expect(endpointFor('rigs.list')(buildCtx(), {})).rejects.toBe(
			unauthorized,
		);
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('helpers', () => {
	it('gives an agent turn and a long-polled output read longer to answer', () => {
		expect(timeoutFor('agentSessions.send')).toBe(600_000);
		expect(timeoutFor('commandRuns.listEvents')).toBe(120_000);
		expect(timeoutFor('rigs.list')).toBe(30_000);
	});
});
