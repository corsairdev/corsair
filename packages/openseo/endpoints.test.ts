import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { openseoEndpointsNested } from './endpoints/catalog';
import { openseoOperations } from './endpoints/manifest';
import type { OpenseoContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, callOpenseoTool: jest.fn() };
});

const mockedCall = jest.mocked(client.callOpenseoTool);
const mockedLogEvent = jest.mocked(logEventFromContext);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

const ctx: OpenseoContext = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'oseo_test',
	options: {},
	keys: {
		get_dek: () => Promise.resolve('test-dek'),
		issue_new_dek: () => Promise.resolve('test-dek'),
		get_api_key: () => Promise.resolve('oseo_test'),
		set_api_key: () => Promise.resolve(),
		get_webhook_signature: () => Promise.resolve(null),
		set_webhook_signature: () => Promise.resolve(),
	},
	db: {},
};

// `unknown` is necessary because the table drives all 85 operations, each with its own input and output type, through one signature.
type AnyEndpoint = (
	context: OpenseoContext,
	input: unknown,
) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	const [group, action] = id.split('.') as [string, string];
	const endpoint =
		// `unknown` is necessary because the nested endpoint tree is indexed by strings from the manifest, which its literal type cannot express.
		(
			openseoEndpointsNested as unknown as Record<
				string,
				Record<string, AnyEndpoint>
			>
		)[group]?.[action];
	if (!endpoint) throw new Error(`no endpoint ${id}`);
	return endpoint;
}

// A result needs its required `const` fields (`deleted: true`); every other
// response field is optional. Built from the operation's output schema.
// `unknown` is necessary because const values are JSON scalars of any type.
function requiredConsts(id: string): Record<string, unknown> {
	const output = openseoOperations.find((operation) => operation.id === id)
		?.output as {
		required?: string[];
		properties?: Record<string, { const?: unknown }>;
	};
	const result: Record<string, unknown> = {};
	for (const name of output.required ?? []) {
		const property = output.properties?.[name];
		if (property && 'const' in property) result[name] = property.const;
	}
	return result;
}

beforeEach(() => {
	mockedCall.mockReset();
	mockedLogEvent.mockReset();
});

describe('every operation', () => {
	it.each(openseoOperations.map((operation) => [operation.id, operation.tool]))(
		'%s calls the %s tool with its validated example and parses the result',
		async (id, tool) => {
			const args = docs.apiExamples[id]?.args;
			mockedCall.mockResolvedValue({
				...requiredConsts(id),
				meta: { creditsCharged: 0 },
				zzUnknownField: 'kept',
			});

			const result = await endpointFor(id)(ctx, args);

			expect(mockedCall).toHaveBeenCalledTimes(1);
			expect(mockedCall).toHaveBeenCalledWith(tool, args, 'oseo_test');
			expect(result).toMatchObject({
				meta: { creditsCharged: 0 },
				zzUnknownField: 'kept',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'openseo.operation',
				{ operationId: id },
				'completed',
			);
		},
	);
});

describe('validation', () => {
	it('rejects invalid input before calling OpenSEO', async () => {
		await expect(
			endpointFor('keywords.research')(ctx, { projectId: 'p', seeds: [] }),
		).rejects.toThrow();
		expect(mockedCall).not.toHaveBeenCalled();
	});

	it('defaults a missing input to an empty object', async () => {
		mockedCall.mockResolvedValue({ projects: [] });
		await endpointFor('projects.list')(ctx, undefined);
		expect(mockedCall).toHaveBeenCalledWith('list_projects', {}, 'oseo_test');
	});

	it('sends the validated arguments, not the caller object', async () => {
		mockedCall.mockResolvedValue({ projects: [] });
		const input = { name: 'Acme', domain: 'acme.com' };
		await endpointFor('projects.create')(ctx, input);
		expect(mockedCall.mock.calls[0]?.[1]).toEqual(input);
		expect(mockedCall.mock.calls[0]?.[1]).not.toBe(input);
	});

	it('fails a delete result without its required deleted: true', async () => {
		mockedCall.mockResolvedValue({});
		await expect(
			endpointFor('reports.delete')(ctx, { projectId: 'p', reportId: 'r' }),
		).rejects.toThrow();
	});

	it('fails a result that breaks its output schema', async () => {
		mockedCall.mockResolvedValue({ projects: 'not-a-list' });
		await expect(endpointFor('projects.list')(ctx, {})).rejects.toThrow();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('logs only the operation id, never the arguments', async () => {
		mockedCall.mockResolvedValue({});
		await endpointFor('keywords.metrics')(ctx, {
			projectId: 'p',
			keywords: ['secret launch keyword'],
		});
		expect(JSON.stringify(mockedLogEvent.mock.calls)).not.toContain(
			'secret launch keyword',
		);
	});
});
