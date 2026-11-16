import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import { teamworkInputSchemas } from './endpoints/openapi-schema';
import {
	resolveTeamworkSiteName,
	serializeTeamworkQuery,
	teamworkOperationsById,
} from './endpoints/operations';
import { teamworkDefinitions, teamworkOperations } from './endpoints/types';
import type { TeamworkContext, TeamworkKeyBuilderContext } from './index';
import { teamwork } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual<typeof import('./client')>('./client');
	return { ...actual, makeTeamworkRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeTeamworkRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// `unknown` is necessary because OpenAPI schemas describe runtime JSON values.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` is necessary because OpenAPI schemas describe runtime JSON rather than trusted test types.
function makeValue(
	value: unknown,
	definitions: Record<string, Record<string, unknown>>,
	depth = 0,
): unknown {
	if (!isRecord(value) || depth > 16) return null;
	if (typeof value.$ref === 'string') {
		return makeValue(
			definitions[value.$ref.replace(/^#\/definitions\//, '')],
			definitions,
			depth + 1,
		);
	}
	if (Array.isArray(value.enum) && value.enum.length > 0) return value.enum[0];
	if (Array.isArray(value.allOf)) {
		// `unknown` is necessary because each allOf member is an arbitrary provider schema fragment.
		return value.allOf.reduce<Record<string, unknown>>((merged, member) => {
			const sample = makeValue(member, definitions, depth + 1);
			return isRecord(sample) ? { ...merged, ...sample } : merged;
		}, {});
	}
	const union = Array.isArray(value.oneOf) ? value.oneOf : value.anyOf;
	if (Array.isArray(union) && union.length > 0) {
		return makeValue(union[0], definitions, depth + 1);
	}
	if (value.type === 'string') return 'sample';
	if (value.type === 'integer')
		return typeof value.minimum === 'number' ? value.minimum : 1;
	if (value.type === 'number')
		return typeof value.minimum === 'number' ? value.minimum : 0;
	if (value.type === 'boolean') return true;
	if (value.type === 'array') {
		return isRecord(value.items)
			? [makeValue(value.items, definitions, depth + 1)]
			: [];
	}
	if (value.type === 'object' || isRecord(value.properties)) {
		const properties = isRecord(value.properties) ? value.properties : {};
		const required = Array.isArray(value.required) ? value.required : [];
		return Object.fromEntries(
			required
				.filter((name): name is string => typeof name === 'string')
				.map((name) => [
					name,
					makeValue(properties[name], definitions, depth + 1),
				]),
		);
	}
	// `unknown` is necessary for provider fields whose schema is not documented.
	return null;
}

// `unknown` is necessary because operation inputs are assembled from dynamic OpenAPI parameter definitions.
function makeInput(
	operation: (typeof teamworkOperations)[number],
): Record<string, unknown> {
	const definitions = teamworkDefinitions[operation.version] ?? {};
	// `unknown` is necessary because path parameter types vary across provider operations.
	const path: Record<string, unknown> = {};
	// `unknown` is necessary because query parameter types vary across provider operations.
	const query: Record<string, unknown> = {};
	for (const parameter of operation.parameters) {
		if (parameter.in === 'path' || parameter.required) {
			const value = makeValue(
				{
					type: parameter.type,
					enum: parameter.enum,
					items: parameter.items,
					minimum: parameter.minimum,
					maximum: parameter.maximum,
				},
				definitions,
			);
			(parameter.in === 'path' ? path : query)[parameter.name] = value;
		}
	}
	// `unknown` is necessary because request bodies vary by provider operation.
	const input: Record<string, unknown> = { path, query };
	if (operation.bodyRequired && operation.body !== undefined) {
		const body = makeValue(operation.body, definitions);
		if (
			operation.version === 'v3' &&
			operation.method === 'POST' &&
			isRecord(body) &&
			isRecord(body.task)
		) {
			body.task.name = 'Teamwork route test task';
		}
		input.body = body;
	}
	return input;
}

function buildContext(siteName?: string): TeamworkContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('teamwork-test-account'),
		key: 'test-key',
		options: siteName ? { siteName } : {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key'),
			get_site_name: () => Promise.resolve('teamwork-test'),
			set_api_key: () => Promise.resolve(),
			set_site_name: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedRequest.mockResolvedValue(undefined);
	mockedLogEvent.mockReset();
});

describe('documented operation routes', () => {
	it.each(teamworkOperations)(
		'$id calls its documented HTTP route',
		async (operation) => {
			const endpoint = teamworkOperationsById[operation.id];
			if (!endpoint)
				throw new Error('Registered Teamwork operation is missing');
			const input = makeInput(operation);
			const inputResult = teamworkInputSchemas[operation.id]?.safeParse(input);
			if (!inputResult?.success) {
				const paths = inputResult?.error.issues
					.map((issue) => issue.path.join('.'))
					.join(', ');
				throw new Error(`Invalid fixture for ${operation.id}: ${paths}`);
			}
			const response =
				operation.response === null
					? undefined
					: makeValue(
							operation.response,
							teamworkDefinitions[operation.version] ?? {},
						);
			mockedRequest.mockResolvedValue(response);
			await expect(endpoint(ctx, input)).resolves.toEqual(response);
			expect(mockedRequest).toHaveBeenCalledWith({
				apiKey: 'test-key',
				siteName: 'teamwork-test',
				version: operation.version,
				method: operation.method,
				path: operation.path,
				pathParameters: input.path,
				query: serializeTeamworkQuery(
					operation,
					isRecord(input.query) ? input.query : {},
				),
				body: input.body,
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'teamwork.operation',
				{ operationId: operation.id },
				'completed',
			);
			const loggedPayload = mockedLogEvent.mock.calls[0]?.[2];
			expect(JSON.stringify(loggedPayload)).not.toContain('test-key');
		},
	);

	it('uses tenant-scoped site metadata unless the global siteName override is set', async () => {
		const operation = teamworkOperations.find(
			(item) => item.id === 'v3_get_projects_api_v3_projects_json',
		);
		if (!operation) throw new Error('Projects list operation is missing');
		const endpoint = teamworkOperationsById[operation.id];
		if (!endpoint) throw new Error('Projects list endpoint is missing');
		const input = makeInput(operation);
		mockedRequest.mockResolvedValue(
			makeValue(
				operation.response,
				teamworkDefinitions[operation.version] ?? {},
			),
		);

		await endpoint(buildContext(), input);
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({ siteName: 'teamwork-test' }),
		);

		await endpoint(buildContext('override-site'), input);
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({ siteName: 'override-site' }),
		);
	});

	it('sends the validated input even if the caller changes its object while the site loads', async () => {
		const endpoint = teamworkOperationsById['v1_delete_projects_id_json'];
		if (!endpoint) throw new Error('Project delete endpoint is missing');
		const input = { path: { id: '1' }, query: {} };
		const ctx = buildContext();
		ctx.keys.get_site_name = async () => {
			input.path.id = '2';
			return 'teamwork-test';
		};
		mockedRequest.mockResolvedValue({ STATUS: 'OK' });
		await endpoint(ctx, input);
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({ pathParameters: { id: '1' } }),
		);
	});

	it('uses documented CSV encoding for array query parameters', async () => {
		const operation = teamworkOperations.find(
			(item) => item.id === 'v2_get_projects_api_v2_tasklists_id_taskids_json',
		);
		if (!operation) throw new Error('Task IDs operation is missing');
		const endpoint = teamworkOperationsById[operation.id];
		if (!endpoint) throw new Error('Task IDs endpoint is missing');
		const input = {
			path: { id: 123 },
			query: {
				filterText: ['alpha', 'beta'],
				responsiblePartyIds: [2, 3],
			},
		};
		mockedRequest.mockResolvedValue(
			makeValue(
				operation.response,
				teamworkDefinitions[operation.version] ?? {},
			),
		);

		await endpoint(ctx, input);
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				query: {
					filterText: 'alpha,beta',
					responsiblePartyIds: '2,3',
				},
			}),
		);
	});

	it.each(teamworkOperations)(
		'$id rejects undocumented input before network I/O',
		async (operation) => {
			const endpoint = teamworkOperationsById[operation.id];
			if (!endpoint)
				throw new Error('Registered Teamwork operation is missing');
			await expect(endpoint(ctx, { unexpected: 'rejected' })).rejects.toThrow(
				'Invalid Teamwork endpoint input',
			);
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);

	it('uses a credential-required API-key connector and has no webhooks', () => {
		const plugin = teamwork({ siteName: 'teamwork-test' });
		expect(plugin.authConfig?.api_key?.account).toEqual(['site_name']);
		expect(plugin.webhooks).toEqual({});
		const operationIds = teamworkOperations
			.map((operation) => operation.id)
			.sort();
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operationIds,
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(operationIds);
		expect(plugin.endpointMeta?.['v1_delete_projects_id_json']?.riskLevel).toBe(
			'destructive',
		);
		expect(
			plugin.endpointMeta?.['v1_put_projects_projectid_update_request_json']
				?.riskLevel,
		).toBe('destructive');
	});

	it('marks operations that email or notify people, or replace a member list, destructive', () => {
		const plugin = teamwork({ siteName: 'teamwork-test' });
		for (const id of [
			// Sends an account invitation unless sendInvite is false.
			'v1_post_people_json',
			// Notifies the people in notifyIds.
			'v1_post_projects_projectid_update_json',
			// Reminders email, text or notify a person at the set time.
			'v1_post_tasks_id_reminders_json',
			'v3_post_projects_api_v3_tasks_taskid_reminders_json',
			// action defaults to "replace", which drops every other member.
			'v1_put_teams_id_people_json',
		] as const) {
			expect(plugin.endpointMeta?.[id]?.riskLevel).toBe('destructive');
		}
	});

	it('asks for the site through a connect link when a stored key has no site', async () => {
		// Casts through `unknown`: the test stubs only the two key getters the keyBuilder reads, not the whole key manager.
		const keyBuilderContext = (siteName: string | null) =>
			({
				authType: 'api_key',
				keys: {
					get_api_key: () => Promise.resolve('test-key'),
					get_site_name: () => Promise.resolve(siteName),
				},
			}) as unknown as TeamworkKeyBuilderContext;
		const buildKey = (
			options: Parameters<typeof teamwork>[0],
			siteName: string | null,
		) =>
			// `unknown` cast: the plugin's keyBuilder type is a union over auth types, and this test calls only the api_key branch.
			(
				teamwork(options).keyBuilder as unknown as (
					ctx: TeamworkKeyBuilderContext,
					source: 'endpoint',
				) => Promise<string>
			)(keyBuilderContext(siteName), 'endpoint');
		await expect(buildKey({}, null)).rejects.toThrow(AuthMissingError);
		await expect(buildKey({}, 'acme')).resolves.toBe('test-key');
		await expect(buildKey({ siteName: 'acme' }, null)).resolves.toBe(
			'test-key',
		);
	});

	it('supports direct API-key use without stored tenant metadata when overridden', async () => {
		await expect(
			resolveTeamworkSiteName('single-site', undefined),
		).resolves.toBe('single-site');
		await expect(resolveTeamworkSiteName(undefined, undefined)).rejects.toThrow(
			'A Teamwork site name is required',
		);
	});
});
